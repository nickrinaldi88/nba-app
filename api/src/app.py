from flask import Flask, jsonify
from flask_cors import CORS
# Assuming the NBA API Python package is named nba_api
from nba_api.live.nba.endpoints import scoreboard
import json

app = Flask(__name__)
CORS(app)

@app.route('/nba/games', methods=['GET'])

def get_games():
    scoreboard_obj = scoreboard.ScoreBoard()
    game_data = json.loads(scoreboard_obj.get_json())  # See the overall structure
    # List all attributes and methods
    formatted_games = []
    for game in game_data["scoreboard"]["games"]:
        
        game_info = {
            "homeTeam": game["homeTeam"]["teamName"],
            "homeTeamRecord": f'{game["homeTeam"]["wins"]}-{game["homeTeam"]["losses"]}',
            "homeTeamScore": game["homeTeam"]["score"],
            "awayTeam": game["awayTeam"]["teamName"],
            "awayTeamRecord": f'{game["awayTeam"]["wins"]}-{game["awayTeam"]["losses"]}',
            "awayTeamScore": game["awayTeam"]["score"],
            "gameTimeUTC": game["gameTimeUTC"],
            "homeLeaders": {},
            "awayLeaders": {},
        }
        
        # Assuming gameLeaders contains the desired leader information directly
        if "homeLeaders" in game["gameLeaders"] and game["gameLeaders"]["homeLeaders"]:
            home_leaders = game["gameLeaders"]["homeLeaders"]
            game_info["homeLeaders"] = {
                "points": home_leaders["points"],
                "rebounds": home_leaders["rebounds"],
                "assists": home_leaders["assists"],
            }
        
        if "awayLeaders" in game["gameLeaders"] and game["gameLeaders"]["awayLeaders"]:
            away_leaders = game["gameLeaders"]["awayLeaders"]
            game_info["awayLeaders"] = {
                "points": away_leaders["points"],
                "rebounds": away_leaders["rebounds"],
                "assists": away_leaders["assists"],
            }
        
        formatted_games.append(game_info)
    
    return formatted_games
   


if __name__ == '__main__':
    app.run(debug=True)
