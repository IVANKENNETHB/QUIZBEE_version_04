/**
 * Levels
 * -----------------------------------------------------------
 * The difficulty registry of the quiz.
 *
 * A level describes three things:
 *   - which question difficulties it may use (`difficulties`),
 *   - how many questions a round may contain (`max`),
 *   - how many of them should be scramble (`mix`).
 *
 * The four difficulty levels share the whole bank except the hidden
 * tiebreaker band, so every question stays reachable in every level. The
 * tiebreaker band is only ever used for a sudden-death round, and a level
 * that is picked on the setup screen can also play a round from it.
 */
class Levels {
  /**
   * The level registry, ordered from easiest to hardest.
   */
  static get REGISTRY() {
    return {
      easy: {
        label: "Easy",
        difficulties: ["easy", "normal", "hard", "expert"],
        counts: [10, 15, 20],
        max: 40,
        mix: 0
      },
      normal: {
        label: "Normal",
        difficulties: ["easy", "normal", "hard", "expert"],
        counts: [10, 15, 20, 40],
        max: 56,
        mix: 0.2
      },
      hard: {
        label: "Hard",
        difficulties: ["easy", "normal", "hard", "expert"],
        counts: [10, 15, 20, 40],
        max: 56,
        mix: 0.4
      },
      expert: {
        label: "Expert",
        difficulties: ["easy", "normal", "hard", "expert"],
        counts: [10, 15, 20, 40],
        max: 56,
        mix: 0.6
      },
      tiebreaker: {
        label: "Tiebreaker",
        difficulties: ["tiebreaker"],
        counts: [10, 15, 20],
        max: 20,
        mix: 0.75
      }
    };
  }

  /** Levels the host can pick on the setup screen. */
  static get SELECTABLE() {
    return ["easy", "normal", "hard", "expert", "tiebreaker"];
  }

  /** Level used when nothing (valid) is selected. */
  static get DEFAULT_KEY() {
    return "normal";
  }

  /** Shape of a tiebreaker round: 20 questions, 15 of them scramble. */
  static get TIEBREAKER_ROUND() {
    return { total: 20, scramble: 15 };
  }

  /**
   * Normalizes a level key. Legacy keys are mapped to their new home and
   * anything unknown falls back to the default level.
   *
   * @param {string} key
   * @returns {string}
   */
  static normalizeKey(key) {
    const name = String(key === null || key === undefined ? "" : key)
      .trim()
      .toLowerCase();

    // "advanced" was the old name of the hard level.
    const aliases = { advanced: "hard" };

    const resolved = aliases[name] || name;

    return Levels.REGISTRY[resolved] ? resolved : Levels.DEFAULT_KEY;
  }

  /**
   * The configuration of a level.
   * @param {string} key
   * @returns {object}
   */
  static getConfig(key) {
    return Levels.REGISTRY[Levels.normalizeKey(key)];
  }

  /**
   * Human readable label of a level.
   * @param {string} key
   * @returns {string}
   */
  static getLabel(key) {
    return Levels.getConfig(key).label;
  }

  /**
   * Questions that belong to a level, in bank order.
   *
   * @param {Array} questions Question instances.
   * @param {string} key      Level key.
   * @returns {Array}
   */
  static getPool(questions, key) {
    const list = Array.isArray(questions) ? questions : [];
    const difficulties = Levels.getConfig(key).difficulties;

    return list.filter((question) => question
      && difficulties.indexOf(Levels.normalizeDifficultyTag(question.difficulty)) !== -1);
  }

  /**
   * Normalizes a difficulty tag the same way `Question` does, so a raw
   * tag and a question object are always treated the same.
   *
   * @param {string} value
   * @returns {string}
   */
  static normalizeDifficultyTag(value) {
    const tag = String(value === null || value === undefined ? "" : value)
      .trim()
      .toLowerCase();

    const known = ["easy", "normal", "hard", "expert", "tiebreaker"];

    return known.indexOf(tag) !== -1 ? tag : "normal";
  }

  /**
   * Composition of a pool: how many questions it holds and how many of
   * them are scramble.
   *
   * @param {Array} pool
   * @returns {{total:number, mc:number, scramble:number}}
   */
  static getStats(pool) {
    const list = Array.isArray(pool) ? pool : [];

    const mc = list.filter((question) => question && question.type === "multiple-choice").length;

    return {
      total: list.length,
      mc,
      scramble: list.length - mc
    };
  }

  /**
   * The scramble share a level draws with (0 - 1).
   *
   * @param {string} key
   * @returns {number}
   */
  static getMix(key) {
    const mix = Number(Levels.getConfig(key).mix);

    return Number.isFinite(mix) ? Math.min(1, Math.max(0, mix)) : 0;
  }

  /**
   * The largest round a level allows.
   *
   * @param {string} key
   * @returns {number}
   */
  static getMax(key) {
    return Math.max(0, Number(Levels.getConfig(key).max) || 0);
  }

  /**
   * The "Number of questions" chips of a level. The presets belong to the
   * level, and the pool of the level is always offered as the "All" chip.
   *
   * @param {string} key
   * @returns {Array<{value:string, label:string, count:number}>}
   */
  static getCountOptions(key) {
    const config = Levels.getConfig(key);
    const max = Levels.getMax(key);

    if (max === 0) {
      return [];
    }

    const options = config.counts
      .filter((count) => count > 0 && count <= max)
      .map((count) => ({
        value: String(count),
        label: String(count),
        count
      }));

    if (!options.some((option) => option.count === max)) {
      options.push({
        value: "all",
        label: `All (${max})`,
        count: max
      });
    }

    return options;
  }

  /**
   * A short description of a level, used in the setup screen.
   *
   * @param {string} key
   * @param {Array}  pool
   * @returns {string}
   */
  static describe(key, pool) {
    const config = Levels.getConfig(key);
    const stats = Levels.getStats(pool);

    if (stats.total === 0) {
      return `${config.label} level: no questions available yet.`;
    }

    const plural = stats.total === 1 ? "" : "s";

    return `${config.label} level: ${stats.total} question${plural} available `
      + `(${stats.mc} multiple choice and ${stats.scramble} scramble).`;
  }

  /**
   * The note that explains how many questions a round may hold and how
   * many of them are scramble.
   *
   * @param {string} key
   * @returns {string}
   */
  static describeRound(key) {
    const percent = Math.round(Levels.getMix(key) * 100);
    const note = percent === 0 ? "multiple choice only" : `about ${percent}% scramble`;

    return `Maximum of ${Levels.getMax(key)} questions per round (${note}).`;
  }
}
