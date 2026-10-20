#!/usr/bin/env python3
"""Build the wide banner backdrop for the home hero.

The animated artwork (src/assets/byte_builders_animated.gif) is 16:9, but the
hero band is much wider (2.7:1 up to 4.2:1 depending on the window width), so
the artwork used to float in the middle of a band with CSS gradients faking
the sides.

This script takes one frame of that artwork and extends its own edge pixels
outwards, so the circuit-board texture continues to the edges of the band and
the artwork sits flush inside the banner instead of floating in a box.

    python tools/make_banner.py

Output: src/assets/banner_wide.png (RGB, 3072x720).
"""

from __future__ import annotations

import argparse
import os

from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

DEFAULT_SRC = os.path.join(ROOT, "assets-original", "byte_builders_animated.gif")
DEFAULT_OUT = os.path.join(ROOT, "src", "assets", "banner_wide.png")

# The artwork is 1280x720. The widest band the app can show is 1752x420 (4.17:1),
# so 3072x720 (4.27:1) covers it with a little to spare.
SIDE_EXTENSION = 896


def ramp_mask(width: int, height: int, lo: float, hi: float, seam_side: str) -> Image.Image:
    """An L-mode mask that ramps from `lo` to `hi` away from the seam.

    `seam_side` is the side of the extension that touches the artwork.
    """
    mask = Image.new("L", (width, 1))
    pixels = mask.load()

    for x in range(width):
        distance = x if seam_side == "left" else width - 1 - x
        t = distance / max(1, width - 1)
        pixels[x, 0] = int(max(0, min(255, round((lo + (hi - lo) * t) * 255))))

    return mask.resize((width, height))


def progressive_blur(image: Image.Image, max_radius: float, seam_side: str) -> Image.Image:
    """Blur that grows with the distance from the seam.

    The strip next to the artwork stays sharp, so the artwork's own edge pixels
    flow into the extension; further out the texture sinks into a soft field.
    """
    width, height = image.size
    result = image.copy()

    steps = (
        (image.filter(ImageFilter.GaussianBlur(max_radius * 0.25)), 0.00, 0.34),
        (image.filter(ImageFilter.GaussianBlur(max_radius * 0.60)), 0.34, 0.67),
        (image.filter(ImageFilter.GaussianBlur(max_radius)), 0.67, 1.00),
    )

    for blurred, lo, hi in steps:
        result = Image.composite(blurred, result, ramp_mask(width, height, lo, hi, seam_side))

    return result


def build_extension(artwork: Image.Image, side: str, extent: int) -> Image.Image:
    """Continues the artwork's edge outwards by `extent` pixels."""
    art_width, art_height = artwork.size
    strip_width = min(384, art_width)

    if side == "left":
        strip = artwork.crop((0, 0, strip_width, art_height))
    else:
        strip = artwork.crop((art_width - strip_width, 0, art_width, art_height))

    # Mirror the strip so it reads as a continuation of the pattern, then put
    # the mirrored pixels that touch the artwork right at the seam.
    mirrored = strip.transpose(Image.FLIP_LEFT_RIGHT)

    if side == "left":
        inner_at = extent - strip_width
    else:
        inner_at = 0

    extension = Image.new("RGB", (extent, art_height))

    inner = mirrored
    extension.paste(inner, (inner_at, 0))

    # Whatever is left beyond the 1:1 mirror keeps the same pattern but is
    # stretched, and the blur ramp hides the scale change.
    outer_width = extent - strip_width
    if outer_width > 0:
        outer = mirrored.resize((outer_width, art_height), Image.LANCZOS)
        extension.paste(outer, (0 if side == "left" else strip_width, 0))

    seam_side = "right" if side == "left" else "left"
    extension = progressive_blur(extension, 20.0, seam_side)

    # Darken towards the outside so the centre stays the focus and the band
    # edges melt into the dark page background.
    darken = ramp_mask(extent, art_height, 1.0, 0.72, seam_side)
    extension = Image.composite(
        Image.new("RGB", extension.size, (0, 0, 0)),
        extension,
        Image.eval(darken, lambda value: 255 - value),
    )

    return extension


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", default=DEFAULT_SRC, help="source GIF")
    parser.add_argument("--out", default=DEFAULT_OUT, help="output PNG")
    parser.add_argument("--frame", type=int, default=0, help="frame to use as the source")
    parser.add_argument("--side", type=int, default=SIDE_EXTENSION, help="pixels added per side")
    args = parser.parse_args()

    source = Image.open(args.src)
    source.seek(args.frame)
    artwork = source.convert("RGB")
    art_width, art_height = artwork.size

    canvas = Image.new("RGB", (art_width + 2 * args.side, art_height))

    left = build_extension(artwork, "left", args.side)
    right = build_extension(artwork, "right", args.side)

    canvas.paste(left, (0, 0))
    canvas.paste(artwork, (args.side, 0))
    canvas.paste(right, (args.side + art_width, 0))

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    canvas.save(args.out, "PNG", optimize=True)

    print(f"wrote {args.out} ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
