/**
 * Browser smoke test. Injected into a copy of index.html and executed
 * against the real DOM, so it exercises the actual wiring (level chips,
 * count chips, quiz mix, leaderboard, locked review, tiebreaker).
 */
(function () {
  const results = [];
  const ok = (name, cond, extra) => {
    results.push((cond ? "PASS" : "FAIL") + " :: " + name + (extra ? " :: " + extra : ""));
  };

  const chips = () => Array.from(document.querySelectorAll("#count-group .count-option"))
    .map((label) => label.querySelector("span").textContent);

  const fire = (element, type) => element.dispatchEvent(new Event(type, { bubbles: true }));

  function pickLevel(level) {
    const input = document.querySelector('input[name="level"][value="' + level + '"]');
    input.checked = true;
    fire(input, "change");
  }

  function pickMode(mode) {
    const input = document.querySelector('input[name="mode"][value="' + mode + '"]');
    input.checked = true;
    fire(input, "change");
  }

  function pickCount(value) {
    const input = document.querySelector('#count-group input[value="' + value + '"]');
    input.checked = true;
    fire(input, "change");
  }

  function checkedCount() {
    const input = document.querySelector("#count-group input:checked");
    return input ? input.value : "none";
  }

  function run() {
    const app = window.quizApp;

    if (!app) {
      results.push("FAIL :: the app did not start");
      return;
    }

    /* ---------------- the full width layout ---------------- */

    const styleOf = (selector) => getComputedStyle(document.querySelector(selector));
    const trackCount = (value) => String(value).trim().split(/\s+/).filter(Boolean).length;

    ok("the shell is capped at 1800px", styleOf(".app-shell").maxWidth === "1800px",
      styleOf(".app-shell").maxWidth);
    ok("the shell fills the window",
      parseFloat(styleOf(".app-shell").width) > 1200, styleOf(".app-shell").width);
    ok("the body fills the window", styleOf("body").width === styleOf("html").width,
      styleOf("body").width + " / " + styleOf("html").width);
    ok("the home grid has two columns", trackCount(styleOf(".home-grid").gridTemplateColumns) === 2,
      styleOf(".home-grid").gridTemplateColumns);
    ok("the setup options have two columns",
      trackCount(styleOf(".setup-fields").gridTemplateColumns) === 2,
      styleOf(".setup-fields").gridTemplateColumns);
    ok("the level spans the full row",
      styleOf(".setup-fields .field-wide").gridColumnEnd === "-1",
      styleOf(".setup-fields .field-wide").gridColumnStart + " / " + styleOf(".setup-fields .field-wide").gridColumnEnd);
    ok("the hero banner fits the artwork",
      parseFloat(styleOf(".home-hero").height) <= 430, styleOf(".home-hero").height);

    /* ---------------- the banner emblem ---------------- */

    const art = document.querySelector(".home-hero-art");
    const artImgEl = art ? art.querySelector("img") : null;
    const artBox = art ? art.getBoundingClientRect() : null;
    const artImg = artImgEl ? getComputedStyle(artImgEl) : null;
    const hero = document.querySelector(".home-hero");
    const heroBox = hero ? hero.getBoundingClientRect() : null;

    ok("the banner shows the artwork", art !== null);
    ok("the banner uses the extended animation",
      artImgEl && /byte_builders_wide\.gif/.test(artImgEl.getAttribute("src")),
      artImgEl ? artImgEl.getAttribute("src") : "none");
    ok("the artwork fills the banner", artImg && artImg.objectFit === "cover",
      artImg ? artImg.objectFit : "none");
    ok("the artwork covers the whole banner",
      artBox && heroBox
        && Math.abs(artBox.width - heroBox.width) <= 4
        && Math.abs(artBox.height - heroBox.height) <= 4,
      artBox ? Math.round(artBox.width) + "x" + Math.round(artBox.height) : "none");
    ok("the artwork is centred on the banner",
      artBox && Math.abs((artBox.left + artBox.width / 2)
        - (document.documentElement.clientWidth / 2)) < 3,
      artBox ? String(Math.round(artBox.left + artBox.width / 2)) : "none");

    // The animation is already extended to the band, so it is wider than the
    // band and only the sides get cropped - the badge stays whole.
    const natural = artImgEl && artImgEl.naturalWidth
      ? artImgEl.naturalWidth / artImgEl.naturalHeight
      : 0;
    const band = heroBox ? heroBox.width / heroBox.height : 0;

    ok("the animation is wider than the banner",
      natural > 0 && band > 1 && natural > band,
      natural.toFixed(2) + ":1 in a " + band.toFixed(2) + ":1 band");

    // The static backdrop paints the band while the animation is still
    // decoding, so the banner never flashes empty.
    const backdrop = getComputedStyle(document.querySelector(".home-hero"), "::before");

    ok("the banner is filled by the extended backdrop",
      /banner_wide\.png/.test(backdrop.backgroundImage) && backdrop.backgroundSize === "cover",
      backdrop.backgroundImage);
    ok("the caption stays on the bottom left",
      getComputedStyle(document.querySelector(".home-hero-overlay")).bottom === "0px",
      getComputedStyle(document.querySelector(".home-hero-overlay")).bottom);

    /* ---------------- the fullscreen controls ---------------- */

    ok("the settings have a fullscreen button", app.dom.fullscreenBtn !== null);
    ok("the settings have an exit fullscreen button", app.dom.exitFullscreenBtn !== null);
    ok("the fullscreen button is enabled while windowed", app.dom.fullscreenBtn.disabled === false);
    ok("the exit fullscreen button is disabled while windowed",
      app.dom.exitFullscreenBtn.disabled === true);
    ok("the hint explains the state",
      app.dom.fullscreenHint.textContent.indexOf("not fullscreen") !== -1,
      app.dom.fullscreenHint.textContent);

    app.isFullscreen = true;
    app.updateFullscreenControls();
    ok("the buttons follow the state",
      app.dom.fullscreenBtn.disabled === true && app.dom.exitFullscreenBtn.disabled === false,
      "fullscreen=" + app.dom.fullscreenBtn.disabled + "/" + app.dom.exitFullscreenBtn.disabled);
    ok("the hint follows the state",
      app.dom.fullscreenHint.textContent.indexOf("fullscreen,") !== -1,
      app.dom.fullscreenHint.textContent);
    app.isFullscreen = false;
    app.updateFullscreenControls();

    /* ---------------- levels and count chips ---------------- */

    ok("five level chips", document.querySelectorAll("#level-group input[name='level']").length === 5,
      String(document.querySelectorAll("#level-group input[name='level']").length));

    pickLevel("expert");
    ok("expert chips", chips().join(",") === "10,15,20,40,All (56)", chips().join(","));
    ok("expert round help",
      document.getElementById("count-help").textContent
        === "Maximum of 56 questions per round (about 60% scramble).",
      document.getElementById("count-help").textContent);

    pickLevel("easy");
    ok("easy chips", chips().join(",") === "10,15,20,All (40)", chips().join(","));
    ok("easy round help",
      document.getElementById("count-help").textContent
        === "Maximum of 40 questions per round (multiple choice only).",
      document.getElementById("count-help").textContent);

    pickLevel("normal");
    ok("normal chips", chips().join(",") === "10,15,20,40,All (56)", chips().join(","));
    ok("normal round help",
      document.getElementById("count-help").textContent
        === "Maximum of 56 questions per round (about 20% scramble).",
      document.getElementById("count-help").textContent);

    pickLevel("hard");
    ok("hard chips", chips().join(",") === "10,15,20,40,All (56)", chips().join(","));
    ok("hard round help",
      document.getElementById("count-help").textContent
        === "Maximum of 56 questions per round (about 40% scramble).",
      document.getElementById("count-help").textContent);

    pickLevel("tiebreaker");
    ok("tiebreaker chips", chips().join(",") === "10,15,20", chips().join(","));
    ok("tiebreaker level help",
      document.getElementById("level-help").textContent
        === "Tiebreaker level: 40 questions available (10 multiple choice and 30 scramble).",
      document.getElementById("level-help").textContent);

    pickLevel("expert");
    pickCount("20");
    ok("expert keeps its own count", checkedCount() === "20", checkedCount());

    pickLevel("easy");
    ok("easy uses its own count", checkedCount() !== "20", checkedCount());
    pickLevel("expert");
    ok("expert count is remembered", checkedCount() === "20", checkedCount());

    /* ---------------- the round mix ---------------- */

    pickLevel("expert");
    pickCount("20");
    app.startQuiz();
    const expertRound = app.quiz.questions;
    const expertScramble = expertRound.filter((q) => q.type === "scramble").length;
    ok("expert round size", expertRound.length === 20, String(expertRound.length));
    ok("expert round mix", expertScramble === 12, expertScramble + " scramble");

    pickLevel("normal");
    pickCount("20");
    app.startQuiz();
    ok("normal round mix",
      app.quiz.questions.filter((q) => q.type === "scramble").length === 4,
      String(app.quiz.questions.filter((q) => q.type === "scramble").length));

    pickLevel("easy");
    pickCount("all");
    app.startQuiz();
    ok("easy round size", app.quiz.questions.length === 40, String(app.quiz.questions.length));
    ok("easy round has no scramble",
      app.quiz.questions.every((q) => q.type === "multiple-choice"),
      String(app.quiz.questions.filter((q) => q.type === "scramble").length));

    /* ---------------- the tiebreaker round ---------------- */

    pickLevel("tiebreaker");
    pickCount("20");
    app.startQuiz();
    const tieQuestions = app.quiz.questions;
    ok("tiebreaker round size", tieQuestions.length === 20, String(tieQuestions.length));
    ok("tiebreaker round mix",
      tieQuestions.filter((q) => q.type === "scramble").length === 15,
      String(tieQuestions.filter((q) => q.type === "scramble").length));
    ok("tiebreaker questions are the hidden ones",
      tieQuestions.every((q) => q.difficulty === "tiebreaker"));

    // A second team gets a different set of questions: the questions that
    // were already served are left out.
    const firstSet = tieQuestions.map((q) => q.id).sort().join(",");
    app.startQuiz();
    const secondSet = app.quiz.questions.map((q) => q.id).sort().join(",");
    ok("the second team gets a different set", firstSet !== secondSet);
    ok("the second set is the rest of the band", secondSet.length > 0);
    app.tiebreakerMode = false;

    /* ---------------- quizmaster leaderboard with time ---------------- */

    pickLevel("normal");
    pickMode("quizmaster");
    ["Gray", "Blue"].forEach((name) => app.getTeamDrafts("normal").push(name));
    app.renderTeamsDraft();
    app.startQuiz();

    app.responses = new Map();
    app.quiz.questions.forEach((question, index) => {
      const correct = index < 8;
      app.quiz.recordResponse(correct);
      app.responses.set(index, {
        response: 0,
        isCorrect: correct,
        answered: true,
        revealed: true,
        team: "Gray",
        timeSpent: 30
      });
    });
    app.roundTimeSeconds = 300;
    app.finishQuiz();

    const board = app.dom.resultsLeaderboard.textContent;
    ok("leaderboard shows the points", board.indexOf("8/") !== -1, board);
    ok("leaderboard shows the time", board.indexOf("5:00") !== -1, board);
    ok("leaderboard shows the team", board.indexOf("Gray") !== -1);
    ok("the answered team leads",
      app.scoreboard.getLeaders().length === 1 && app.scoreboard.getLeaders()[0].name === "Gray");
    ok("the winner line shows the time",
      app.dom.resultsSummary.textContent.indexOf("5:00") !== -1,
      app.dom.resultsSummary.textContent);

    /* ---------------- every level has its own teams ---------------- */

    ok("the normal level has its own teams", app.getTeamDrafts("normal").join(",") === "Gray,Blue");
    ok("the expert level starts empty", app.getTeamDrafts("expert").length === 0);
    ok("the expert board holds no team of the normal level",
      app.getScoreboard("expert").getTeamNames().indexOf("Gray") === -1,
      app.getScoreboard("expert").getTeamNames().join(","));

    pickLevel("expert");
    app.renderTeamsDraft();
    ok("another level shows another team list", app.teamsDraft.length === 0);
    ok("the lobby shows the level of the teams",
      app.dom.lobbyLevelBadge.textContent === "Expert level",
      app.dom.lobbyLevelBadge.textContent);

    ["Rust", "Zinc"].forEach((name) => app.getTeamDrafts("expert").push(name));
    app.renderTeamsDraft();
    app.getScoreboard("expert").getTeam("Rust").addPoints(4);

    pickLevel("normal");
    app.renderTeamsDraft();
    ok("switching back shows the normal teams", app.teamsDraft.join(",") === "Gray,Blue");
    ok("the normal standings are untouched", app.getScoreboard("normal").getTopScore() === 8);
    ok("the expert standings are their own", app.getScoreboard("expert").getTopScore() === 4);
    ok("the lobby shows the normal teams again",
      app.dom.lobbyLevelBadge.textContent === "Normal level",
      app.dom.lobbyLevelBadge.textContent);

    /* ---------------- the locked answer review ---------------- */

    const review = app.dom.reviewList.textContent;
    ok("the review is locked", review.indexOf("locked - admin password required") !== -1);
    ok("the review badge is neutral",
      app.dom.reviewList.querySelector(".review-badge").textContent === "Answered",
      app.dom.reviewList.querySelector(".review-badge").textContent);
    ok("the review item is marked as locked",
      app.dom.reviewList.querySelector(".review-item").classList.contains("review-locked"));
    ok("the reveal button is offered", !app.dom.revealAnswersBtn.hidden);
    ok("the hide button is hidden", app.dom.hideAnswersBtn.hidden);

    // A wrong password must not unlock anything.
    app.dom.revealPassword.value = "wrong";
    app.confirmRevealAnswers().then(() => {
      ok("a wrong password does not unlock", app.answersRevealed === false);
      ok("the wrong password is reported",
        !app.dom.revealError.hidden && app.dom.revealError.textContent.length > 0);

      app.dom.revealPassword.value = "admin123";
      return app.confirmRevealAnswers();
    }).then(() => {
      const unlocked = app.dom.reviewList.textContent;
      ok("the admin password unlocks the review", app.answersRevealed === true);
      ok("the answers are visible", unlocked.indexOf("Correct answer") !== -1
        && unlocked.indexOf("locked - admin password required") === -1);
      ok("the badge comes back", unlocked.indexOf("Correct") !== -1);
      ok("the hide button is offered", !app.dom.hideAnswersBtn.hidden);

      app.hideAnswers();
      ok("the answers can be locked again", app.answersRevealed === false);
      ok("the locked review is back",
        app.dom.reviewList.textContent.indexOf("locked - admin password required") !== -1);

      /* ---------------- the tiebreaker flow ---------------- */

      const blue = app.scoreboard.getTeam("Blue");
      blue.recordResult({ score: 8, total: 10, seconds: 300 });
      ok("a real tie is detected", app.scoreboard.hasTies() === true);
      app.updateTiebreakerButton();
      ok("the tiebreaker button appears", !app.dom.tiebreakerBtn.hidden);

      // A faster team with the same score takes the lead.
      blue.timeSeconds = 240;
      ok("the faster team wins the tie", app.scoreboard.getLeaders()[0].name === "Blue",
        app.scoreboard.getLeaders()[0].name);
      ok("the tie is gone", app.scoreboard.hasTies() === false);
      blue.timeSeconds = 300;

      app.startTiebreaker();
      ok("the tiebreaker round starts", app.tiebreakerMode === true);
      ok("the tied teams move to the tiebreaker level",
        app.getTeamDrafts("tiebreaker").join(",") === "Gray,Blue",
        app.getTeamDrafts("tiebreaker").join(","));
      ok("the tiebreaker has its own standings",
        app.getScoreboard("tiebreaker").getTeamNames().join(",") === "Gray,Blue");
      ok("the original level keeps its own teams",
        app.getTeamDrafts("normal").join(",") === "Gray,Blue");
      const options = Array.from(app.dom.lobbyAwardTeam.options).map((o) => o.value);
      ok("only the tied teams take part",
        options.length === 2 && options.every((name) => ["Gray", "Blue"].indexOf(name) !== -1),
        options.join(","));
      ok("the tiebreaker uses 20 questions", Levels.TIEBREAKER_ROUND.total === 20);

      // The tiebreak round really uses the hidden band.
      app.startQuiz();
      const tiebreakRound = app.quiz.questions;
      ok("the tiebreak round is 20 questions", tiebreakRound.length === 20, String(tiebreakRound.length));
      ok("the tiebreak round is 15 scramble",
        tiebreakRound.filter((q) => q.type === "scramble").length === 15,
        String(tiebreakRound.filter((q) => q.type === "scramble").length));
      ok("the tiebreak round uses the hidden band",
        tiebreakRound.every((q) => q.difficulty === "tiebreaker"));
      ok("the exhausted band falls back to a full round",
        app.tiebreakerReused === true && tiebreakRound.length === 20,
        "reused=" + app.tiebreakerReused);

      // The tiebreak points are added to the tiebreaker level's own board,
      // which starts empty.
      const gray = app.scoreboard.getTeam("Gray");
      const before = gray.score;
      gray.addTiebreak({ correct: 2, total: 20, seconds: 120 });
      ok("the tiebreak points are added", gray.score === before + 2, String(gray.score));
      ok("the tiebreak time is added", gray.timeSeconds === 120, String(gray.timeSeconds));
      ok("the tiebreak points land on the tiebreaker leaderboard",
        app.getScoreboard("tiebreaker").getTeam("Gray").score === before + 2,
        String(app.getScoreboard("tiebreaker").getTeam("Gray").score));
      ok("the original level keeps its own standing",
        app.getScoreboard("normal").getTopScore() === 8,
        String(app.getScoreboard("normal").getTopScore()));
    });
  }

  /* A rejected sign-in must tell the user why it failed. The login call is
     stubbed so the rejection is deterministic without a Tauri backend. */
  async function checkSignInError() {
    const errorEl = document.getElementById("login-error");
    const usernameEl = document.getElementById("login-username");
    const passwordEl = document.getElementById("login-password");
    const button = document.querySelector('[data-action="login"]');

    if (!errorEl || !usernameEl || !passwordEl || !button || !window.QuizApi) {
      ok("a rejected sign-in shows the error message", false, "the sign-in form is missing");
      return;
    }

    const originalLogin = window.QuizApi.login;

    window.QuizApi.login = () => Promise.reject(new Error("Invalid username or password."));

    usernameEl.value = "tester";
    passwordEl.value = "wrong-password";
    button.click();
    await new Promise((resolve) => setTimeout(resolve, 200));

    ok("a rejected sign-in shows the error message",
      errorEl.hidden === false && errorEl.textContent.length > 0,
      errorEl.textContent);

    window.QuizApi.login = originalLogin;
  }

  function finish() {
    const pre = document.createElement("pre");
    pre.id = "smoke-results";
    pre.textContent = results.join("\n");
    document.body.appendChild(pre);
  }

  window.addEventListener("load", () => {
    setTimeout(async () => {
      try {
        run();
        await checkSignInError();
      } catch (error) {
        results.push("FAIL :: threw " + error.message);
      }
      finish();
    }, 300);
  });
})();
