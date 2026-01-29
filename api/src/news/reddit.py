# news/reddit.py
import praw
from flask import Blueprint, jsonify
import os

reddit_bp = Blueprint("reddit", __name__)

# variables

client_id = "l85_6mmbcp-GBnjAUjdwUg"
secret = "hkYSbjmZoVJG0iH7xEa_k2n7lGsPCA"

# Initialize PRAW Reddit client
reddit = praw.Reddit(
    client_id=client_id,
    client_secret=secret, # store in variable
    user_agent="Hoopmob/1.0 by u/SnooCats1084"
)

@reddit_bp.route("/", methods=["GET"])
def get_reddit_posts():
    subreddit = reddit.subreddit("nba")
    posts = []

    for submission in subreddit.hot(limit=10):
        if submission.stickied:
            continue
        posts.append({
            "title": submission.title,
            "upvotes": submission.score,
            "comments": submission.num_comments,
            "url": f"https://reddit.com{submission.permalink}"
        })
    print("Total posts:", len(posts))
    return jsonify(posts)

    
