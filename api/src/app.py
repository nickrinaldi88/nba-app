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
   


if __name__ == '__main__':
    app.run(debug=True)
