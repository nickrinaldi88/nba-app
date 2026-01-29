from flask import Flask, jsonify
import os
from flask_cors import CORS
# Assuming the NBA API Python package is named nba_api
from nba_api.live.nba.endpoints import scoreboard
from nba_api.live.nba.endpoints import boxscore
import json
from news.reddit import reddit_bp
from news.twitter import twitter_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register the Reddit blueprint
app.register_blueprint(reddit_bp, url_prefix='/news')
app.register_blueprint(twitter_bp, url_prefix='/news')

# Games page
@app.route('/games', methods=['GET'])
def get_games():
    scoreboard_obj = scoreboard.ScoreBoard()
    game_data = json.loads(scoreboard_obj.get_json())  # See the overall structure
    
    # display sample data 
    if not game_data["scoreboard"]["games"]:
        with open("data/games-sample.json") as f:
            return jsonify(json.load(f))
    
    formatted_games = []
    for game in game_data["scoreboard"]["games"]:

        game_info = {

            "gameId": game["gameId"],
            
            "homeTeam": game["homeTeam"]["teamName"],
            "homeTeamRecord": f'{game["homeTeam"]["wins"]}-{game["homeTeam"]["losses"]}',
            "homeTeamScore": game["homeTeam"]["score"],
            "awayTeam": game["awayTeam"]["teamName"],
            "awayTeamRecord": f'{game["awayTeam"]["wins"]}-{game["awayTeam"]["losses"]}',
            "awayTeamScore": game["awayTeam"]["score"],
            "gameTimeUTC": game["gameTimeUTC"],

            "homeLeaders": {
                "name": game["gameLeaders"]["homeLeaders"]["name"],
                "points": game["gameLeaders"]["homeLeaders"]["points"],
                "rebounds": game["gameLeaders"]["homeLeaders"]["rebounds"],
                "assists": game["gameLeaders"]["homeLeaders"]["assists"],
            },

            "awayLeaders": {
                "name": game["gameLeaders"]["awayLeaders"]["name"],
                "points": game["gameLeaders"]["awayLeaders"]["points"],
                "rebounds": game["gameLeaders"]["awayLeaders"]["rebounds"],
                "assists": game["gameLeaders"]["awayLeaders"]["assists"],
            },
        }
        formatted_games.append(game_info)
        
    return formatted_games

# Box Score page
@app.get("/boxscore/<game_id>")
def get_box_score(game_id):
    try:
        # try to load the live data
        box_score_obj = boxscore.BoxScore(game_id=game_id)
        box_score_data = json.loads(box_score_obj.get_json())
        return jsonify(box_score_data)

    except Exception as live_err:
        print(f"Live box score fetch failed: {live_err}")

        try:
            # fall back to sample data
            sample_path = os.path.join(
                os.path.dirname(__file__),
                "../data/boxscore-sample.json"
            )
            with open(sample_path) as f:
                return jsonify(json.load(f))

        except Exception as test_err:
            print(f"Error loading boxscore sample: {test_err}")
            return jsonify({"error": "Box score data not available"}), 500
# if to be run as script, run  
if __name__ == '__main__':
    app.run(debug=True)
