use crate::models::{Question, Team};
use rusqlite::{params, Connection, OptionalExtension};
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::path::Path;

/// Settings key holding the fingerprint of the bundled built-in seed.
const SEED_VERSION_KEY: &str = "builtin_seed_version";

/// A stable fingerprint of the bundled `seed_questions.json` contents.
fn seed_version() -> String {
    let mut hasher = DefaultHasher::new();
    include_str!("../seed_questions.json").hash(&mut hasher);
    format!("{:x}", hasher.finish())
}

/// Opens (or creates) the SQLite database, applies the schema and seeds the
/// built-in question bank on first run.
pub fn open(path: &Path) -> rusqlite::Result<Connection> {
    let conn = Connection::open(path)?;
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.pragma_update(None, "foreign_keys", "ON")?;
    init_schema(&conn)?;
    seed_builtin(&conn)?;
    Ok(conn)
}

/// Creates the tables if they do not already exist.
pub fn init_schema(conn: &Connection) -> rusqlite::Result<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS questions (
            id               INTEGER PRIMARY KEY,
            source           TEXT NOT NULL DEFAULT 'builtin',
            type             TEXT NOT NULL,
            difficulty       TEXT NOT NULL DEFAULT 'normal',
            text             TEXT NOT NULL,
            options          TEXT,
            correct_answer   TEXT NOT NULL,
            accepted_answers TEXT NOT NULL DEFAULT '[]',
            explanation      TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            username      TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at    TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS teams (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT NOT NULL,
            level           TEXT NOT NULL DEFAULT 'normal',
            score           INTEGER NOT NULL DEFAULT 0,
            total_questions INTEGER NOT NULL DEFAULT 0,
            time_seconds    INTEGER NOT NULL DEFAULT 0,
            created_at      TEXT NOT NULL,
            UNIQUE (name, level)
        );

        CREATE TABLE IF NOT EXISTS attempts (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            given       TEXT,
            is_correct  INTEGER NOT NULL,
            answered_at TEXT NOT NULL
        );
        ",
    )?;

    // Databases created before team scores existed miss the column; add it
    // without touching existing rows.
    ensure_column(conn, "teams", "score", "INTEGER NOT NULL DEFAULT 0")?;
    // Leaderboard now breaks score ties on answering time, so a team also
    // stores how many questions it played and how long it took.
    ensure_column(conn, "teams", "total_questions", "INTEGER NOT NULL DEFAULT 0")?;
    ensure_column(conn, "teams", "time_seconds", "INTEGER NOT NULL DEFAULT 0")?;
    // Questions carry a difficulty band used to build the level pools.
    ensure_column(conn, "questions", "difficulty", "TEXT NOT NULL DEFAULT 'normal'")?;

    // Every level has its own team list, so a team name may only be used
    // once per level.
    migrate_teams_for_levels(conn)?;

    Ok(())
}

/// True when `table` already has the given column.
fn column_exists(conn: &Connection, table: &str, column: &str) -> rusqlite::Result<bool> {
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({})", table))?;
    let mut rows = stmt.query([])?;

    while let Some(row) = rows.next()? {
        let name: String = row.get("name")?;

        if name == column {
            return Ok(true);
        }
    }

    Ok(false)
}

/// Rebuilds the teams table so a team can exist once per level.
///
/// Older databases made `name` unique on its own, which would stop the same
/// team name from being used on two different levels. SQLite cannot drop a
/// UNIQUE constraint, so the table is rebuilt and the existing rows move to
/// the "normal" level.
fn migrate_teams_for_levels(conn: &Connection) -> rusqlite::Result<()> {
    if column_exists(conn, "teams", "level")? {
        return Ok(());
    }

    conn.execute_batch(
        "
        BEGIN;
        CREATE TABLE teams_by_level (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT NOT NULL,
            level           TEXT NOT NULL DEFAULT 'normal',
            score           INTEGER NOT NULL DEFAULT 0,
            total_questions INTEGER NOT NULL DEFAULT 0,
            time_seconds    INTEGER NOT NULL DEFAULT 0,
            created_at      TEXT NOT NULL
        );
        INSERT INTO teams_by_level (id, name, level, score, total_questions, time_seconds, created_at)
            SELECT id, name, 'normal', score, total_questions, time_seconds, created_at FROM teams;
        DROP TABLE teams;
        ALTER TABLE teams_by_level RENAME TO teams;
        CREATE UNIQUE INDEX idx_teams_name_level ON teams (name, level);
        COMMIT;
        ",
    )?;

    Ok(())
}

/// Adds `column` to `table` when it is missing (idempotent migration helper).
fn ensure_column(conn: &Connection, table: &str, column: &str, definition: &str) -> rusqlite::Result<()> {
    if column_exists(conn, table, column)? {
        return Ok(());
    }

    conn.execute(
        &format!("ALTER TABLE {} ADD COLUMN {} {}", table, column, definition),
        [],
    )?;

    Ok(())
}

/// Seeds the built-in bank on first run and re-syncs it whenever the bundled
/// `seed_questions.json` changes. User-imported questions are preserved.
///
/// Old builds only inserted the built-in rows when the table was empty, so
/// edited seed data (for example shortened scramble answers) never reached
/// databases that had already been created. Storing a fingerprint of the seed
/// lets every install pick up new or corrected built-in questions.
fn seed_builtin(conn: &Connection) -> rusqlite::Result<()> {
    let version = seed_version();

    if get_setting(conn, SEED_VERSION_KEY)?.as_deref() == Some(version.as_str()) {
        return Ok(());
    }

    let seed: Vec<Question> =
        serde_json::from_str(include_str!("../seed_questions.json")).expect("seed_questions.json is valid");

    let tx = conn.unchecked_transaction()?;
    tx.execute("DELETE FROM questions WHERE source = 'builtin'", [])?;
    for q in &seed {
        insert_builtin_question(&tx, q)?;
    }
    tx.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        params![SEED_VERSION_KEY, version],
    )?;
    tx.commit()?;
    Ok(())
}

/// Inserts a built-in question preserving the id declared in the seed file.
fn insert_builtin_question(conn: &Connection, q: &Question) -> rusqlite::Result<()> {
    let options_json = match &q.options {
        Some(opts) => Some(serde_json::to_string(opts).unwrap()),
        None => None,
    };
    let correct_json = serde_json::to_string(&q.correct_answer).unwrap();
    let accepted_json = serde_json::to_string(&q.accepted_answers).unwrap();

    conn.execute(
        "INSERT INTO questions (id, source, type, difficulty, text, options, correct_answer, accepted_answers, explanation)
         VALUES (?1, 'builtin', ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            q.id,
            q.qtype,
            q.difficulty,
            q.text,
            options_json,
            correct_json,
            accepted_json,
            q.explanation
        ],
    )?;

    Ok(())
}

/// Inserts a single question and returns it with the assigned id.
pub fn insert_question(conn: &Connection, source: &str, q: &Question) -> rusqlite::Result<Question> {
    let options_json = match &q.options {
        Some(opts) => Some(serde_json::to_string(opts).unwrap()),
        None => None,
    };
    let correct_json = serde_json::to_string(&q.correct_answer).unwrap();
    let accepted_json = serde_json::to_string(&q.accepted_answers).unwrap();

    conn.execute(
        "INSERT INTO questions (source, type, difficulty, text, options, correct_answer, accepted_answers, explanation)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            source,
            q.qtype,
            q.difficulty,
            q.text,
            options_json,
            correct_json,
            accepted_json,
            q.explanation
        ],
    )?;

    let mut inserted = q.clone();
    inserted.id = conn.last_insert_rowid();
    inserted.source = source.to_string();
    Ok(inserted)
}

/// Maps a DB row into a `Question` for the frontend.
fn row_to_question(row: &rusqlite::Row) -> rusqlite::Result<Question> {
    let options_json: Option<String> = row.get("options")?;
    let correct_json: String = row.get("correct_answer")?;
    let accepted_json: String = row.get("accepted_answers")?;

    let options = options_json.and_then(|s| serde_json::from_str::<Vec<String>>(&s).ok());
    let correct_answer: serde_json::Value =
        serde_json::from_str(&correct_json).unwrap_or(serde_json::Value::Null);
    let accepted_answers: Vec<String> = serde_json::from_str(&accepted_json).unwrap_or_default();

    Ok(Question {
        id: row.get("id")?,
        source: row.get("source")?,
        qtype: row.get("type")?,
        difficulty: row.get("difficulty")?,
        text: row.get("text")?,
        options,
        correct_answer,
        accepted_answers,
        explanation: row.get("explanation")?,
    })
}

/// Returns every question (built-in + imported), ordered by id.
pub fn list_all(conn: &Connection) -> rusqlite::Result<Vec<Question>> {
    let mut stmt = conn.prepare(
        "SELECT id, source, type, difficulty, text, options, correct_answer, accepted_answers, explanation
         FROM questions ORDER BY id ASC",
    )?;

    let rows = stmt.query_map([], |row| row_to_question(row))?;
    rows.collect()
}

/// Removes all user-imported questions; the built-in bank is untouched.
pub fn clear_imported(conn: &Connection) -> rusqlite::Result<usize> {
    conn.execute("DELETE FROM questions WHERE source = 'imported'", [])
}

/// Records a single attempt.
pub fn record_attempt(
    conn: &Connection,
    question_id: i64,
    given: Option<String>,
    is_correct: bool,
) -> rusqlite::Result<()> {
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "INSERT INTO attempts (question_id, given, is_correct, answered_at) VALUES (?1, ?2, ?3, ?4)",
        params![question_id, given, if is_correct { 1 } else { 0 }, now],
    )?;
    Ok(())
}

/// Reads a setting value, falling back to `None` when unset.
pub fn get_setting(conn: &Connection, key: &str) -> rusqlite::Result<Option<String>> {
    conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        params![key],
        |row| row.get(0),
    )
    .optional()
}

/// Upserts a setting value.
pub fn set_setting(conn: &Connection, key: &str, value: &str) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        params![key, value],
    )?;
    Ok(())
}

/// Inserts a team on a level, or returns the existing one if the name is
/// already taken on that level.
pub fn add_team(conn: &Connection, name: &str, level: &str) -> rusqlite::Result<Team> {
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "INSERT OR IGNORE INTO teams (name, level, created_at) VALUES (?1, ?2, ?3)",
        params![name, level, now],
    )?;

    conn.query_row(
        "SELECT id, name, level, score, total_questions, time_seconds
         FROM teams WHERE name = ?1 AND level = ?2",
        params![name, level],
        |row| {
            Ok(Team {
                id: row.get(0)?,
                name: row.get(1)?,
                level: row.get(2)?,
                score: row.get(3)?,
                total_questions: row.get(4)?,
                time_seconds: row.get(5)?,
            })
        },
    )
}

/// Returns all saved teams, ordered by level and then by name.
pub fn get_teams(conn: &Connection) -> rusqlite::Result<Vec<Team>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, level, score, total_questions, time_seconds
         FROM teams ORDER BY level ASC, name ASC",
    )?;
    let rows = stmt.query_map([], |row| {
        Ok(Team {
            id: row.get(0)?,
            name: row.get(1)?,
            level: row.get(2)?,
            score: row.get(3)?,
            total_questions: row.get(4)?,
            time_seconds: row.get(5)?,
        })
    })?;
    rows.collect()
}

/// Removes a team (and its score) from a level.
pub fn remove_team(conn: &Connection, name: &str, level: &str) -> rusqlite::Result<usize> {
    conn.execute(
        "DELETE FROM teams WHERE name = ?1 AND level = ?2",
        params![name, level],
    )
}

/// Stores a team's best result on a level.
///
/// The stored result is only replaced when the new run is genuinely better:
/// a higher score always wins, and an equal score only wins when it was
/// achieved faster. The question count and the time always travel with the
/// score they belong to, so the leaderboard can always show a consistent
/// "8/10 pts in 5:00".
pub fn set_team_result(
    conn: &Connection,
    name: &str,
    level: &str,
    score: i64,
    total_questions: i64,
    time_seconds: i64,
) -> rusqlite::Result<()> {
    let score = score.max(0);
    let total_questions = total_questions.max(0);
    let time_seconds = time_seconds.max(0);

    let current: Option<(i64, i64)> = conn
        .query_row(
            "SELECT score, time_seconds FROM teams WHERE name = ?1 AND level = ?2",
            params![name, level],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .optional()?;

    let should_replace = match current {
        None => true,
        Some((current_score, current_time)) => {
            score > current_score || (score == current_score && time_seconds < current_time)
        }
    };

    if should_replace {
        conn.execute(
            "UPDATE teams SET score = ?3, total_questions = ?4, time_seconds = ?5
             WHERE name = ?1 AND level = ?2",
            params![name, level, score, total_questions, time_seconds],
        )?;
    }

    Ok(())
}

/// Aggregate attempt totals.
pub fn get_stats(conn: &Connection) -> rusqlite::Result<(i64, i64)> {
    conn.query_row(
        "SELECT COUNT(*), COALESCE(SUM(is_correct), 0) FROM attempts",
        [],
        |row| Ok((row.get(0)?, row.get(1)?)),
    )
}

/// Deletes every recorded attempt.
pub fn reset_attempts(conn: &Connection) -> rusqlite::Result<usize> {
    conn.execute("DELETE FROM attempts", [])
}

/// True when at least one user is registered. Used to decide between the
/// registration and sign-in screens on startup.
pub fn has_users(conn: &Connection) -> rusqlite::Result<bool> {
    let count: i64 = conn.query_row("SELECT COUNT(*) FROM users", [], |row| row.get(0))?;

    Ok(count > 0)
}

/// Inserts a user together with the password digest computed by the caller.
pub fn create_user(conn: &Connection, username: &str, password_hash: &str) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO users (username, password_hash, created_at) VALUES (?1, ?2, datetime('now'))",
        params![username, password_hash],
    )?;

    Ok(())
}

/// Compares a password digest against the stored one. Returns false when the
/// username is unknown or when the password does not match.
///
/// Note: this only makes sense when `password_hash` was produced with the
/// *same* salt as the stored digest (e.g. in tests, with plain placeholder
/// strings standing in for real hashes). Argon2 hashes embed a fresh random
/// salt per call, so comparing two independently-hashed digests for the same
/// password will never match. To verify a real login, fetch the stored hash
/// with `get_password_hash` and check it with `argon2::PasswordVerifier`
/// instead of hashing the candidate password yourself.
pub fn verify_user(conn: &Connection, username: &str, password_hash: &str) -> rusqlite::Result<bool> {
    let stored = get_password_hash(conn, username)?;

    Ok(stored.as_deref() == Some(password_hash))
}

/// Returns the stored password digest for a username, if the user exists.
pub fn get_password_hash(conn: &Connection, username: &str) -> rusqlite::Result<Option<String>> {
    conn.query_row(
        "SELECT password_hash FROM users WHERE username = ?1",
        params![username],
        |row| row.get("password_hash"),
    )
    .optional()
}

/// Returns the stored password digest of the first registered user.
///
/// The app registers a single admin account on first launch, so this is
/// what the "reveal answers" gate verifies against.
pub fn get_admin_password_hash(conn: &Connection) -> rusqlite::Result<Option<String>> {
    conn.query_row(
        "SELECT password_hash FROM users ORDER BY id ASC LIMIT 1",
        [],
        |row| row.get("password_hash"),
    )
    .optional()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_db() -> Connection {
        let mut path = std::env::temp_dir();
        let unique = format!(
            "quizbee_test_{}_{}.db",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        );
        path.push(unique);
        let conn = Connection::open(&path).unwrap();
        init_schema(&conn).unwrap();
        conn
    }

    fn mcq(id: i64) -> Question {
        Question {
            id,
            source: "builtin".to_string(),
            qtype: "multiple-choice".to_string(),
            difficulty: "normal".to_string(),
            text: "Sample?".to_string(),
            options: Some(vec!["A".into(), "B".into()]),
            correct_answer: serde_json::json!(0),
            accepted_answers: vec![],
            explanation: "because".to_string(),
        }
    }

    fn scramble(id: i64) -> Question {
        Question {
            id,
            source: "builtin".to_string(),
            qtype: "scramble".to_string(),
            difficulty: "normal".to_string(),
            text: "Term?".to_string(),
            options: None,
            correct_answer: serde_json::json!("Phishing"),
            accepted_answers: vec!["phishing".into()],
            explanation: "".to_string(),
        }
    }

    /// The number of questions the bundled seed file holds.
    const SEED_QUESTION_COUNT: usize = 124;

    #[test]
    fn seeds_all_builtin_questions() {
        let conn = temp_db();
        seed_builtin(&conn).unwrap();
        let all = list_all(&conn).unwrap();
        assert_eq!(all.len(), SEED_QUESTION_COUNT);
        assert_eq!(all[0].id, 1);
        assert_eq!(all[0].qtype, "multiple-choice");
        assert!(all[0].options.as_ref().unwrap().len() == 4);
    }

    #[test]
    fn seed_is_idempotent() {
        let conn = temp_db();
        seed_builtin(&conn).unwrap();
        seed_builtin(&conn).unwrap();
        assert_eq!(list_all(&conn).unwrap().len(), SEED_QUESTION_COUNT);
    }

    #[test]
    fn resyncs_builtin_when_seed_changes_and_keeps_imported() {
        let conn = temp_db();

        // Simulate a database seeded by an older build whose built-in answers
        // were long/multi-word and which had no stored seed fingerprint.
        conn.execute(
            "INSERT INTO questions (id, source, type, text, options, correct_answer, accepted_answers, explanation)
             VALUES (29, 'builtin', 'scramble', 'old prompt', NULL, '\"Multi-factor authentication (MFA)\"', '[\"mfa\"]', '')",
            [],
        )
        .unwrap();
        conn.execute(
            "INSERT INTO questions (id, source, type, text, options, correct_answer, accepted_answers, explanation)
             VALUES (41, 'imported', 'scramble', 'keep me', NULL, '\"Firewall\"', '[\"firewall\"]', '')",
            [],
        )
        .unwrap();

        seed_builtin(&conn).unwrap();

        let all = list_all(&conn).unwrap();
        let builtin: Vec<&Question> = all.iter().filter(|q| q.source == "builtin").collect();

        // Built-in bank was fully refreshed...
        assert_eq!(builtin.len(), SEED_QUESTION_COUNT);
        let q29 = all.iter().find(|q| q.id == 29).unwrap();
        assert_eq!(q29.correct_answer, serde_json::json!("Token"));
        // ...and the stale long answer is gone.
        assert!(all
            .iter()
            .all(|q| q.correct_answer != serde_json::json!("Multi-factor authentication (MFA)")));

        // ...while imported questions are preserved.
        assert!(all.iter().any(|q| q.source == "imported" && q.text == "keep me"));
    }

    #[test]
    fn round_trips_answer_types() {
        let conn = temp_db();
        seed_builtin(&conn).unwrap();
        let all = list_all(&conn).unwrap();

        let mc = all.iter().find(|q| q.id == 1).unwrap();
        assert_eq!(mc.correct_answer, serde_json::json!(0));

        let id_q = all.iter().find(|q| q.qtype == "scramble").unwrap();
        assert!(id_q.correct_answer.is_string());
        assert!(id_q.options.is_none());
    }

    #[test]
    fn import_add_and_clear_keeps_builtin() {
        let conn = temp_db();
        seed_builtin(&conn).unwrap();

        let inserted = insert_question(&conn, "imported", &mcq(0)).unwrap();
        assert!(inserted.id > 1016);
        insert_question(&conn, "imported", &scramble(0)).unwrap();
        assert_eq!(list_all(&conn).unwrap().len(), SEED_QUESTION_COUNT + 2);

        let removed = clear_imported(&conn).unwrap();
        assert_eq!(removed, 2);
        assert_eq!(list_all(&conn).unwrap().len(), SEED_QUESTION_COUNT);
    }

    #[test]
    fn settings_upsert_and_defaults() {
        let conn = temp_db();
        assert!(get_setting(&conn, "timer_default").unwrap().is_none());

        set_setting(&conn, "timer_default", "30").unwrap();
        assert_eq!(get_setting(&conn, "timer_default").unwrap().unwrap(), "30");

        set_setting(&conn, "timer_default", "15").unwrap();
        assert_eq!(get_setting(&conn, "timer_default").unwrap().unwrap(), "15");
    }

    #[test]
    fn records_and_resets_attempts() {
        let conn = temp_db();
        record_attempt(&conn, 1, Some("0".into()), true).unwrap();
        record_attempt(&conn, 2, None, false).unwrap();

        let (total, correct) = get_stats(&conn).unwrap();
        assert_eq!(total, 2);
        assert_eq!(correct, 1);

        reset_attempts(&conn).unwrap();
        let (total, correct) = get_stats(&conn).unwrap();
        assert_eq!(total, 0);
        assert_eq!(correct, 0);
    }

    #[test]
    fn deserializes_frontend_payload_and_imports() {
        let conn = temp_db();
        seed_builtin(&conn).unwrap();

        // Shape sent by src/js/api.js: camelCase keys, null options for
        // scramble, numeric or string correctAnswer.
        let payload = r#"[
            {
                "type": "multiple-choice",
                "text": "Imported MCQ?",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": 2,
                "acceptedAnswers": [],
                "explanation": "because"
            },
            {
                "type": "scramble",
                "text": "Imported ID?",
                "options": null,
                "correctAnswer": "Firewall",
                "acceptedAnswers": ["firewall"],
                "explanation": ""
            }
        ]"#;

        let questions: Vec<Question> = serde_json::from_str(payload).unwrap();
        assert_eq!(questions.len(), 2);
        assert_eq!(questions[0].correct_answer, serde_json::json!(2));
        assert_eq!(questions[1].correct_answer, serde_json::json!("Firewall"));
        assert!(questions[1].options.is_none());
        // A payload without a difficulty tag falls back to "normal".
        assert_eq!(questions[0].difficulty, "normal");

        for q in &questions {
            let inserted = insert_question(&conn, "imported", q).unwrap();
            assert_eq!(inserted.source, "imported");
        }

        let all = list_all(&conn).unwrap();
        assert_eq!(all.len(), SEED_QUESTION_COUNT + 2);
        assert_eq!(
            all.iter().filter(|q| q.source == "imported").count(),
            2
        );
    }

    #[test]
    fn adds_and_retrieves_teams() {
        let conn = temp_db();

        let team = add_team(&conn, "Alpha", "normal").unwrap();
        assert_eq!(team.name, "Alpha");
        assert_eq!(team.level, "normal");
        assert_eq!(team.score, 0);
        assert!(team.id > 0);

        add_team(&conn, "Beta", "normal").unwrap();
        add_team(&conn, "Gamma", "expert").unwrap();

        let teams = get_teams(&conn).unwrap();
        assert_eq!(teams.len(), 3);

        let names: Vec<&str> = teams.iter().map(|t| t.name.as_str()).collect();
        assert!(names.contains(&"Alpha"));
        assert!(names.contains(&"Beta"));
        assert!(names.contains(&"Gamma"));
    }

    #[test]
    fn add_team_is_idempotent_for_duplicate_name() {
        let conn = temp_db();

        let first = add_team(&conn, "Alpha", "normal").unwrap();
        let second = add_team(&conn, "Alpha", "normal").unwrap();

        assert_eq!(first.id, second.id);
        assert_eq!(first.name, second.name);

        let teams = get_teams(&conn).unwrap();
        assert_eq!(teams.len(), 1);
    }

    #[test]
    fn keeps_teams_apart_per_level() {
        let conn = temp_db();

        let normal = add_team(&conn, "Alpha", "normal").unwrap();
        let expert = add_team(&conn, "Alpha", "expert").unwrap();

        // The same name may be used once per level.
        assert_ne!(normal.id, expert.id);
        assert_eq!(normal.level, "normal");
        assert_eq!(expert.level, "expert");

        set_team_result(&conn, "Alpha", "normal", 8, 10, 300).unwrap();
        set_team_result(&conn, "Alpha", "expert", 3, 10, 120).unwrap();

        let teams = get_teams(&conn).unwrap();
        assert_eq!(teams.len(), 2);

        let normal_team = teams.iter().find(|t| t.level == "normal").unwrap();
        let expert_team = teams.iter().find(|t| t.level == "expert").unwrap();

        assert_eq!(normal_team.score, 8);
        assert_eq!(normal_team.time_seconds, 300);
        assert_eq!(expert_team.score, 3);
        assert_eq!(expert_team.time_seconds, 120);

        // Removing a team only touches its own level.
        assert_eq!(remove_team(&conn, "Alpha", "expert").unwrap(), 1);
        let teams = get_teams(&conn).unwrap();
        assert_eq!(teams.len(), 1);
        assert_eq!(teams[0].level, "normal");
    }

    #[test]
    fn set_team_result_keeps_the_best_result() {
        let conn = temp_db();
        add_team(&conn, "Alpha", "normal").unwrap();

        set_team_result(&conn, "Alpha", "normal", 7, 10, 300).unwrap();
        let team = add_team(&conn, "Alpha", "normal").unwrap();
        assert_eq!(team.score, 7);
        assert_eq!(team.total_questions, 10);
        assert_eq!(team.time_seconds, 300);

        // A lower score must not overwrite the best.
        set_team_result(&conn, "Alpha", "normal", 4, 10, 100).unwrap();
        let team = add_team(&conn, "Alpha", "normal").unwrap();
        assert_eq!(team.score, 7);
        assert_eq!(team.time_seconds, 300);

        // The same score but slower is not an improvement either.
        set_team_result(&conn, "Alpha", "normal", 7, 10, 400).unwrap();
        let team = add_team(&conn, "Alpha", "normal").unwrap();
        assert_eq!(team.time_seconds, 300);

        // The same score in less time wins: the leaderboard uses it to
        // break a tie.
        set_team_result(&conn, "Alpha", "normal", 7, 10, 200).unwrap();
        let team = add_team(&conn, "Alpha", "normal").unwrap();
        assert_eq!(team.score, 7);
        assert_eq!(team.time_seconds, 200);

        // A higher score replaces it.
        set_team_result(&conn, "Alpha", "normal", 9, 10, 500).unwrap();
        let team = add_team(&conn, "Alpha", "normal").unwrap();
        assert_eq!(team.score, 9);
        assert_eq!(team.time_seconds, 500);
    }

    #[test]
    fn remove_team_deletes_the_row_and_score() {
        let conn = temp_db();
        add_team(&conn, "Alpha", "normal").unwrap();
        add_team(&conn, "Beta", "normal").unwrap();
        set_team_result(&conn, "Alpha", "normal", 5, 10, 120).unwrap();

        let removed = remove_team(&conn, "Alpha", "normal").unwrap();
        assert_eq!(removed, 1);

        let teams = get_teams(&conn).unwrap();
        assert_eq!(teams.len(), 1);
        assert_eq!(teams[0].name, "Beta");

        assert_eq!(remove_team(&conn, "Alpha", "normal").unwrap(), 0);
    }

    #[test]
    fn migrates_legacy_teams_without_score_column() {
        let mut path = std::env::temp_dir();
        let unique = format!(
            "quizbee_legacy_{}_{}.db",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        );
        path.push(unique);
        let conn = Connection::open(&path).unwrap();

        // Simulate an old database missing the score column.
        conn.execute_batch(
            "CREATE TABLE teams (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL
            );
            INSERT INTO teams (name, created_at) VALUES ('Alpha', '2024-01-01T00:00:00Z');",
        )
        .unwrap();

        init_schema(&conn).unwrap();

        let teams = get_teams(&conn).unwrap();
        assert_eq!(teams.len(), 1);
        assert_eq!(teams[0].name, "Alpha");
        assert_eq!(teams[0].score, 0);
        assert_eq!(teams[0].total_questions, 0);
        assert_eq!(teams[0].time_seconds, 0);
        // The old rows move to the normal level.
        assert_eq!(teams[0].level, "normal");

        set_team_result(&conn, "Alpha", "normal", 3, 10, 60).unwrap();
        let team = &get_teams(&conn).unwrap()[0];
        assert_eq!(team.score, 3);
        assert_eq!(team.total_questions, 10);
        assert_eq!(team.time_seconds, 60);
    }

    #[test]
    fn migrates_legacy_teams_with_a_unique_name() {
        let mut path = std::env::temp_dir();
        let unique = format!(
            "quizbee_legacy_unique_{}_{}.db",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        );
        path.push(unique);
        let conn = Connection::open(&path).unwrap();

        // Simulate the previous release: the score columns are there, but
        // the name is unique on its own and there is no level yet.
        conn.execute_batch(
            "CREATE TABLE teams (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                name            TEXT NOT NULL UNIQUE,
                score           INTEGER NOT NULL DEFAULT 0,
                total_questions INTEGER NOT NULL DEFAULT 0,
                time_seconds    INTEGER NOT NULL DEFAULT 0,
                created_at      TEXT NOT NULL
            );
            INSERT INTO teams (name, score, total_questions, time_seconds, created_at)
            VALUES ('Alpha', 8, 10, 300, '2024-01-01T00:00:00Z');",
        )
        .unwrap();

        init_schema(&conn).unwrap();

        let teams = get_teams(&conn).unwrap();
        assert_eq!(teams.len(), 1);
        assert_eq!(teams[0].name, "Alpha");
        assert_eq!(teams[0].level, "normal");
        assert_eq!(teams[0].score, 8);
        assert_eq!(teams[0].total_questions, 10);
        assert_eq!(teams[0].time_seconds, 300);

        // The same name may now be used on another level.
        let expert = add_team(&conn, "Alpha", "expert").unwrap();
        assert_eq!(expert.level, "expert");
        assert_eq!(expert.score, 0);
        assert_eq!(get_teams(&conn).unwrap().len(), 2);
    }

    #[test]
    fn migrates_legacy_questions_without_difficulty_column() {
        let mut path = std::env::temp_dir();
        let unique = format!(
            "quizbee_legacy_questions_{}_{}.db",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        );
        path.push(unique);
        let conn = Connection::open(&path).unwrap();

        // Simulate an old database without the difficulty column.
        conn.execute_batch(
            "CREATE TABLE questions (
                id               INTEGER PRIMARY KEY,
                source           TEXT NOT NULL DEFAULT 'builtin',
                type             TEXT NOT NULL,
                text             TEXT NOT NULL,
                options          TEXT,
                correct_answer   TEXT NOT NULL,
                accepted_answers TEXT NOT NULL DEFAULT '[]',
                explanation      TEXT NOT NULL DEFAULT ''
            );
            INSERT INTO questions (id, source, type, text, options, correct_answer, accepted_answers, explanation)
            VALUES (1, 'builtin', 'multiple-choice', 'Old?', '[\"A\",\"B\"]', '0', '[]', '');",
        )
        .unwrap();

        init_schema(&conn).unwrap();

        let all = list_all(&conn).unwrap();
        assert_eq!(all.len(), 1);
        assert_eq!(all[0].difficulty, "normal");
    }

    #[test]
    fn admin_password_hash_is_the_first_registered_user() {
        let conn = temp_db();

        assert!(get_admin_password_hash(&conn).unwrap().is_none());

        create_user(&conn, "admin", "admin-hash").unwrap();
        create_user(&conn, "teacher", "teacher-hash").unwrap();

        assert_eq!(
            get_admin_password_hash(&conn).unwrap().as_deref(),
            Some("admin-hash")
        );
    }

    #[test]
    fn has_users_reflects_registration() {
        let conn = temp_db();

        assert!(!has_users(&conn).unwrap());

        create_user(&conn, "admin", "admin-hash").unwrap();
        assert!(has_users(&conn).unwrap());

        create_user(&conn, "teacher", "teacher-hash").unwrap();
        assert!(has_users(&conn).unwrap());
    }

    #[test]
    fn verify_user_accepts_only_the_matching_digest() {
        let conn = temp_db();
        create_user(&conn, "admin", "admin-hash").unwrap();

        assert!(verify_user(&conn, "admin", "admin-hash").unwrap());
        assert!(!verify_user(&conn, "admin", "teacher-hash").unwrap());
        assert!(!verify_user(&conn, "guest", "admin-hash").unwrap());
    }

    #[test]
    fn create_user_rejects_a_taken_username() {
        let conn = temp_db();
        create_user(&conn, "admin", "admin-hash").unwrap();

        let error = create_user(&conn, "admin", "other-hash").unwrap_err();
        assert!(error.to_string().contains("UNIQUE"));
    }
}
