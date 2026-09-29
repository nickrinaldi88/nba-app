import os
import sqlite3
import uuid
import hmac
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from flask import Blueprint, current_app, jsonify, request, session

blog_bp = Blueprint("blog", __name__)

DB_PATH = os.environ.get(
    "BLOG_DB_PATH",
    os.path.join(os.path.dirname(__file__), "../data/blog.db"),
)
BLOG_PASSWORD = os.getenv("BLOG_PASSWORD")
MAX_TITLE_LENGTH = 160
MAX_CONTENT_LENGTH = 50_000
MAX_LOGIN_ATTEMPTS = 5
LOGIN_WINDOW_SECONDS = 15 * 60
_failed_login_attempts = {}


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)


init_db()


def admin_is_configured():
    return bool(BLOG_PASSWORD and current_app.config.get("SECRET_KEY"))


def check_auth():
    return admin_is_configured() and session.get("blog_admin") is True


def login_key():
    return request.remote_addr or "unknown"


def login_is_rate_limited(key):
    attempt = _failed_login_attempts.get(key)
    if not attempt:
        return False
    if time.monotonic() - attempt["first_failure"] > LOGIN_WINDOW_SECONDS:
        _failed_login_attempts.pop(key, None)
        return False
    return attempt["count"] >= MAX_LOGIN_ATTEMPTS


def record_failed_login(key):
    now = time.monotonic()
    attempt = _failed_login_attempts.get(key)
    if not attempt or now - attempt["first_failure"] > LOGIN_WINDOW_SECONDS:
        _failed_login_attempts[key] = {"count": 1, "first_failure": now}
        return
    attempt["count"] += 1


def require_admin_session():
    if not admin_is_configured():
        return jsonify({"error": "Blog admin is not configured."}), 503
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
    return None


def row_to_post(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "content": row["content"],
        "createdAt": row["created_at"],
    }


@blog_bp.get("/")
def get_posts():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM posts ORDER BY created_at DESC").fetchall()
    return jsonify([row_to_post(r) for r in rows])


@blog_bp.get("/<post_id>")
def get_post(post_id):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()
    if not row:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(row_to_post(row))


@blog_bp.post("/admin/login")
def admin_login():
    if not admin_is_configured():
        return jsonify({"error": "Blog admin is not configured."}), 503

    key = login_key()
    if login_is_rate_limited(key):
        return jsonify({"error": "Too many failed attempts. Try again in 15 minutes."}), 429

    body = request.get_json(silent=True) or {}
    submitted_password = body.get("password", "")
    if not hmac.compare_digest(submitted_password, BLOG_PASSWORD):
        record_failed_login(key)
        return jsonify({"error": "Incorrect password."}), 401

    _failed_login_attempts.pop(key, None)
    session.clear()
    session["blog_admin"] = True
    return jsonify({"authenticated": True})


@blog_bp.post("/admin/logout")
def admin_logout():
    session.clear()
    return "", 204


@blog_bp.post("/")
def create_post():
    auth_error = require_admin_session()
    if auth_error:
        return auth_error

    body = request.get_json(silent=True)
    title = (body or {}).get("title", "").strip()
    content = (body or {}).get("content", "").strip()

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400
    if len(title) > MAX_TITLE_LENGTH or len(content) > MAX_CONTENT_LENGTH:
        return jsonify({"error": "Post exceeds the allowed length."}), 400

    post = {
        "id": str(uuid.uuid4()),
        "title": title,
        "content": content,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    with get_db() as conn:
        conn.execute(
            "INSERT INTO posts (id, title, content, created_at) VALUES (?, ?, ?, ?)",
            (post["id"], post["title"], post["content"], post["createdAt"]),
        )
    return jsonify(post), 201


@blog_bp.delete("/<post_id>")
def delete_post(post_id):
    auth_error = require_admin_session()
    if auth_error:
        return auth_error

    with get_db() as conn:
        cursor = conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Post not found"}), 404

    return jsonify({"deleted": post_id})
