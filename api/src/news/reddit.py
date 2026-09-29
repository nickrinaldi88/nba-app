# news/reddit.py
import praw
from flask import Blueprint, jsonify
import os
import time

reddit_bp = Blueprint("reddit", __name__)

NEWS_CACHE_TTL_SECONDS = int(os.getenv("NEWS_CACHE_TTL_SECONDS", "300"))
_news_cache = {"posts": None, "expires_at": 0}


def get_reddit_client():
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    if not client_id or not client_secret:
        return None
    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent="Hoopmob/1.0 by u/SnooCats1084",
    )

@reddit_bp.route("/", methods=["GET"])
def get_reddit_posts():
    if _news_cache["posts"] and time.monotonic() < _news_cache["expires_at"]:
        return jsonify(_news_cache["posts"])

    reddit = get_reddit_client()
    if not reddit:
        return jsonify({"error": "News feed is not configured."}), 503

    posts = []
    try:
        for submission in reddit.subreddit("nba").hot(limit=25):
            if submission.stickied:
                continue
            posts.append({
                "title": submission.title,
                "upvotes": submission.score,
                "comments": submission.num_comments,
                "url": f"https://reddit.com{submission.permalink}",
                "created_utc": submission.created_utc,
            })
            if len(posts) == 20:
                break
    except Exception as err:
        print(f"Reddit fetch failed: {err}")
        if _news_cache["posts"]:
            return jsonify(_news_cache["posts"])
        return jsonify({"error": "News feed is temporarily unavailable."}), 502

    _news_cache["posts"] = posts
    _news_cache["expires_at"] = time.monotonic() + NEWS_CACHE_TTL_SECONDS
    return jsonify(posts)

    
