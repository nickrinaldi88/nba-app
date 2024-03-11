CREATE TABLE players(
    player_id INT PRIMARY KEY,
    name VARCHAR(255),
    team_id INT,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
