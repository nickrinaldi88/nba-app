
# Assuming the NBA API Python package is named nba_api
from nba_api.live.nba.endpoints import scoreboard
import json
import pprint

def get_games():
    scoreboard_obj = scoreboard.ScoreBoard()
    game_data = json.loads(scoreboard_obj.get_json())  # See the overall structure
    # List all attributes and methods
    formatted_games = []
    # print(type(game_data))
    for game in game_data["scoreboard"]["games"]:
        print(game)
        break

get_games()