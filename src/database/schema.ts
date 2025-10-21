export const createDatabase = `
CREATE TABLE IF NOT EXISTS exercises(
    id_exercise INTEGER PRIMARY KEY,
    name_exercise TEXT NOT NULL,
    muscles TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS exercises_logs (
    id_exercise_log INTEGER PRIMARY KEY,
    weight REAL,
    reps INTEGER,
    time_in TEXT,
    day_made TEXT NOT NULL,
    exercise_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id_exercise),
    FOREIGN KEY (player_id) REFERENCES players(id_player)
);
CREATE TABLE IF NOT EXISTS workouts (
    id_workout INTEGER PRIMARY KEY,
    name_workout TEXT NOT NULL,
    description TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    personal_trainer_id INTEGER,
    FOREIGN KEY (player_id) REFERENCES players(id_player),
    FOREIGN KEY (personal_trainer_id) REFERENCES personal_trainers(id_personal_trainer)
);
CREATE TABLE IF NOT EXISTS exercises_workouts (
    id_exercise_workout INTEGER PRIMARY KEY,
    min_reps INTEGER,
    max_reps INTEGER,
    time TEXT,
    n_sets INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id_exercise),
    FOREIGN KEY (workout_id) REFERENCES workouts(id_workout)
);

`
