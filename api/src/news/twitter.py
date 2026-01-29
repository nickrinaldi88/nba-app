# news/twitter.py
from flask import Blueprint, jsonify
import snscrape.modules.twitter as sntwitter

twitter_bp = Blueprint("twitter", __name__)

@twitter_bp.route("/", methods=["GET"])
def get_nba_tweets():
    query = "nba lang:en"
    tweets = []

    try:
        for i, tweet in enumerate(sntwitter.TwitterSearchScraper(query).get_items()):
            if i >= 10:
                break
            tweets.append({
                "username": tweet.user.username,
                "name": tweet.user.displayname,
                "content": tweet.content,
                "date": tweet.date.isoformat(),
                "url": tweet.url,
                "likes": tweet.likeCount,
                "retweets": tweet.retweetCount
            })

        return jsonify(tweets)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
