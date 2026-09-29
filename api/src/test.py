
"""Offline regression tests for the launch-critical API behavior.

Run from api/ with: PYTHONPATH=src python -m unittest discover -s src
"""

import os
import tempfile
import unittest


TEST_DB_PATH = os.path.join(tempfile.gettempdir(), "hoopmob-api-tests.db")
os.environ["BLOG_DB_PATH"] = TEST_DB_PATH
os.environ["BLOG_PASSWORD"] = "test-password"
os.environ["FLASK_SECRET_KEY"] = "test-session-secret"
os.environ["USE_SAMPLE_DATA"] = "false"

import app as app_module  # noqa: E402
import blog as blog_module  # noqa: E402


class EmptyScoreboard:
    def get_json(self):
        return '{"scoreboard": {"games": []}}'


class FailingScoreboard:
    def get_json(self):
        raise RuntimeError("scoreboard unavailable")


class FailingBoxScore:
    def __init__(self, game_id):
        self.game_id = game_id

    def get_json(self):
        raise RuntimeError("box score unavailable")


class ApiRouteTests(unittest.TestCase):
    def setUp(self):
        self.client = app_module.app.test_client()
        self.original_scoreboard = app_module.scoreboard.ScoreBoard
        self.original_boxscore = app_module.boxscore.BoxScore
        app_module._scoreboard_cache.update({"data": None, "expires_at": 0})
        blog_module._failed_login_attempts.clear()

    def tearDown(self):
        app_module.scoreboard.ScoreBoard = self.original_scoreboard
        app_module.boxscore.BoxScore = self.original_boxscore

    def test_health_check_is_available_without_upstream_calls(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "ok"})

    def test_empty_live_schedule_returns_an_empty_list(self):
        app_module.scoreboard.ScoreBoard = EmptyScoreboard

        response = self.client.get("/games")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), [])

    def test_unavailable_scoreboard_returns_service_unavailable(self):
        app_module.scoreboard.ScoreBoard = FailingScoreboard

        response = self.client.get("/games")

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.get_json()["error"], "Live scores are temporarily unavailable.")

    def test_unavailable_box_score_returns_bad_gateway(self):
        app_module.boxscore.BoxScore = FailingBoxScore

        response = self.client.get("/boxscore/123")

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.get_json()["error"], "Box score is temporarily unavailable.")

    def test_blog_post_requires_an_authenticated_admin_session(self):
        response = self.client.post("/blog/", json={"title": "Test", "content": "Post"})

        self.assertEqual(response.status_code, 401)

    def test_admin_can_log_in_and_publish_a_post(self):
        login = self.client.post("/blog/admin/login", json={"password": "test-password"})
        post = self.client.post("/blog/", json={"title": "Test", "content": "Post"})
        delete = self.client.delete(f'/blog/{post.get_json()["id"]}')

        self.assertEqual(login.status_code, 200)
        self.assertEqual(post.status_code, 201)
        self.assertEqual(post.get_json()["title"], "Test")
        self.assertEqual(delete.status_code, 200)

    def test_login_is_rate_limited_after_five_failed_attempts(self):
        for _ in range(5):
            response = self.client.post("/blog/admin/login", json={"password": "incorrect"})
            self.assertEqual(response.status_code, 401)

        response = self.client.post("/blog/admin/login", json={"password": "incorrect"})

        self.assertEqual(response.status_code, 429)


if __name__ == "__main__":
    unittest.main()
