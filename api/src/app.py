from flask import Flask, jsonify, request
import os
import time
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))
# Assuming the NBA API Python package is named nba_api
from nba_api.live.nba.endpoints import scoreboard
from nba_api.live.nba.endpoints import boxscore
import json
from news.reddit import reddit_bp
from blog import blog_bp

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.getenv("FLASK_SECRET_KEY"),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE=os.getenv("SESSION_COOKIE_SAMESITE", "Lax"),
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true",
)

# CORS headers are set explicitly below; flask_cors is not used to avoid
# emitting duplicate/conflicting Access-Control-* headers.
@app.after_request
def add_cors_headers(response):
    allowed_origins = {
        origin.strip()
        for origin in os.getenv("CORS_ORIGIN", "http://localhost:3000").split(",")
        if origin.strip()
    }
    origin = request.headers.get("Origin")
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-Blog-Password"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response

app.register_blueprint(reddit_bp, url_prefix='/news')
app.register_blueprint(blog_bp, url_prefix='/blog')

SCOREBOARD_CACHE_TTL_SECONDS = int(os.getenv("SCOREBOARD_CACHE_TTL_SECONDS", "20"))
_scoreboard_cache = {"data": None, "expires_at": 0}


def get_sample_games():
    sample_path = os.path.join(os.path.dirname(__file__), "../data/games-sample.json")
    with open(sample_path) as f:
        return json.load(f)


def get_cached_scoreboard():
    """Fetch the live scoreboard, falling back only to a recent successful result."""
    now = time.monotonic()
    if _scoreboard_cache["data"] and now < _scoreboard_cache["expires_at"]:
        return _scoreboard_cache["data"], "cache"

    scoreboard_obj = scoreboard.ScoreBoard()
    game_data = json.loads(scoreboard_obj.get_json())
    _scoreboard_cache["data"] = game_data
    _scoreboard_cache["expires_at"] = now + SCOREBOARD_CACHE_TTL_SECONDS
    return game_data, "live"


@app.get('/health')
def health_check():
    """Lightweight endpoint for hosting health checks; it never calls upstream APIs."""
    return jsonify({"status": "ok"})

# Games page
@app.route('/games', methods=['GET'])
def get_games():
    # Explicit local-demo mode. Never enable this in a deployed environment.
    if os.getenv("USE_SAMPLE_DATA", "false").lower() == "true":
        return jsonify(get_sample_games())

    try:
        game_data, source = get_cached_scoreboard()
    except Exception as err:
        print(f"Live scoreboard fetch failed: {err}")
        # A recent successful response is safer than inventing a schedule during
        # a temporary provider outage.
        game_data = _scoreboard_cache["data"]
        source = "stale-cache"

    if not game_data:
        return jsonify({"error": "Live scores are temporarily unavailable."}), 503

    games = game_data.get("scoreboard", {}).get("games", [])
    if not games:
        return jsonify([])

    formatted_games = []
    for game in games:
        home_leaders = game.get("gameLeaders", {}).get("homeLeaders", {})
        away_leaders = game.get("gameLeaders", {}).get("awayLeaders", {})
        game_info = {
            "gameId": game["gameId"],
            "homeTeam": game["homeTeam"]["teamName"],
            "homeTeamRecord": f'{game["homeTeam"].get("wins", 0)}-{game["homeTeam"].get("losses", 0)}',
            "homeTeamScore": game["homeTeam"].get("score", 0),
            "awayTeam": game["awayTeam"]["teamName"],
            "awayTeamRecord": f'{game["awayTeam"].get("wins", 0)}-{game["awayTeam"].get("losses", 0)}',
            "awayTeamScore": game["awayTeam"].get("score", 0),
            "gameTimeUTC": game.get("gameTimeUTC"),
            "gameStatus": game.get("gameStatus"),
            "gameStatusText": game.get("gameStatusText", ""),
            "homeLeaders": {
                "name": home_leaders.get("name", "—"),
                "points": home_leaders.get("points", 0),
                "rebounds": home_leaders.get("rebounds", 0),
                "assists": home_leaders.get("assists", 0),
            },
            "awayLeaders": {
                "name": away_leaders.get("name", "—"),
                "points": away_leaders.get("points", 0),
                "rebounds": away_leaders.get("rebounds", 0),
                "assists": away_leaders.get("assists", 0),
            },
        }
        formatted_games.append(game_info)

    response = jsonify(formatted_games)
    response.headers["X-Data-Source"] = source
    return response

# Box Score page
@app.get("/boxscore/<game_id>")
def get_box_score(game_id):
    try:
        box_score_obj = boxscore.BoxScore(game_id=game_id)
        raw = box_score_obj.get_json()
        if not raw or not raw.strip():
            return jsonify({"error": "Box score not available yet. The game may not have started."}), 404
        box_score_data = json.loads(raw)
        return jsonify(box_score_data)

    except Exception as live_err:
        print(f"Live box score fetch failed: {live_err}")
        return jsonify({"error": "Box score is temporarily unavailable."}), 502
# if to be run as script, run  
if __name__ == '__main__':
    port = int(os.getenv("PORT", "5001"))
    app.run(debug=True, host="127.0.0.1", port=port)
