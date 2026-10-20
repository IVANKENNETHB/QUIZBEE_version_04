#!/usr/bin/env python3
"""Build the wide animated banner for the home hero.

The artwork animation is 16:9 but the hero band is much wider, so the banner
is built as a wide canvas:

    | extended side | animated artwork (1280x720) | extended side |

The sides are extended once from the first frame and stay static, while the
middle keeps the original animation. Because the sides never change, the GIF
encoder only stores the changed middle for every following frame, so the file
stays close to the size of the source animation.

    python tools/make_banner_gif.py

Output: src/assets/byte_builders_wide.gif
"""

from __future__ import annotations

import argparse
import os

from PIL import Image

from make_banner import build_extension

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

DEFAULT_SRC = os.path.join(ROOT, "assets-original", "byte_builders_animated.gif")
DEFAULT_OUT = os.path.join(ROOT, "src", "assets", "byte_builders_wide.gif")

SIDE_EXTENSION = 896
TILE = (64, 36)


def shared_palette(frames: list[Image.Image], colors: int = 256) -> Image.Image:
    """One palette for every frame, so the encoder can delta-encode them."""
    columns = 6
    rows = (len(frames) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * TILE[0], rows * TILE[1]))

    for index, frame in enumerate(frames):
        sheet.paste(frame.resize(TILE, Image.LANCZOS), ((index % columns) * TILE[0], (index // columns) * TILE[1]))

    return sheet.quantize(colors=colors, method=Image.MEDIANCUT)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", default=DEFAULT_SRC, help="source GIF")
    parser.add_argument("--out", default=DEFAULT_OUT, help="output GIF")
    parser.add_argument("--side", type=int, default=SIDE_EXTENSION, help="pixels added per side")
    parser.add_argument("--colors", type=int, default=256, help="palette size")
    parser.add_argument("--duration", type=int, default=None, help="frame duration in ms")
    args = parser.parse_args()

    source = Image.open(args.src)
    duration = args.duration if args.duration is not None else source.info.get("duration", 100)
    loop = source.info.get("loop", 0)

    frames: list[Image.Image] = []
    for index in range(source.n_frames):
        source.seek(index)
        frames.append(source.convert("RGB"))

    art_width, art_height = frames[0].size

    # The sides come from the first frame and never change.
    left = build_extension(frames[0], "left", args.side)
    right = build_extension(frames[0], "right", args.side)

    palette = shared_palette(frames, args.colors)

    wide_frames: list[Image.Image] = []
    for frame in frames:
        canvas = Image.new("RGB", (art_width + 2 * args.side, art_height))
        canvas.paste(left, (0, 0))
        canvas.paste(frame, (args.side, 0))
        canvas.paste(right, (args.side + art_width, 0))
        # No dithering: the sides are smooth dark gradients, and the dither
        # noise would cost a megabyte of the file for no visible gain.
        wide_frames.append(canvas.quantize(palette=palette, dither=Image.NONE))

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    wide_frames[0].save(
        args.out,
        "GIF",
        save_all=True,
        append_images=wide_frames[1:],
        duration=duration,
        loop=loop,
        disposal=1,
        optimize=True,
    )

    source_size = os.path.getsize(args.src)
    out_size = os.path.getsize(args.out)
    print(f"wrote {args.out} ({wide_frames[0].width}x{wide_frames[0].height}, {len(wide_frames)} frames)")
    print(f"size: {source_size / 1024 / 1024:.2f} MB -> {out_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
