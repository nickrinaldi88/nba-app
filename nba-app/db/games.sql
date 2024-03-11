CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    game_time_utc TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    home_team_id INTEGER NOT NULL,
    away_team_id INTEGER NOT NULL,
    home_team_score INTEGER,
    away_team_score INTEGER,
    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id)
);
