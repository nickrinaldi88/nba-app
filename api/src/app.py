from flask import Flask, jsonify
# Assuming the NBA API Python package is named nba_api
from nba_api.live.nba.endpoints import scoreboard # This is a placeholder; use the actual import

app = Flask(__name__)

@app.route('/nba/games', methods=['GET'])
def get_games():
    games = scoreboard.ScoreBoard()  # Use the actual function from the package
    return jsonify(games)

if __name__ == '__main__':
    app.run(debug=True)
