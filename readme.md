# Hoopmob

An NBA scoreboard with live game cards, box scores, NBA community news, and a blog.

## Run it locally

You need Node.js 20+ and Python 3.10+ installed. Open two terminal windows from the repository root.

### Terminal 1 — API

Run these once to create local configuration and install Python packages:

```bash
[ -f api/.env ] || cp api/.env.example api/.env
make api-setup
```

To preview a game card any day of the year, open `api/.env` and set:

```env
USE_SAMPLE_DATA=true
```

Then start the API:

```bash
make api
```

Leave this terminal running. A successful start means the API is available at `http://localhost:5001` and `http://localhost:5001/health` returns `{"status":"ok"}`.

### Terminal 2 — website

Run these once to create local configuration and install JavaScript packages:

```bash
[ -f nba-app/.env ] || cp nba-app/.env.example nba-app/.env
make frontend-setup
```

Then start the site:

```bash
make frontend
```

Your browser should open automatically. If it does not, visit [http://localhost:3000](http://localhost:3000).

### What works without extra setup

- Games and box-score demo: set `USE_SAMPLE_DATA=true` as above.
- Live games: leave `USE_SAMPLE_DATA=false`. On an NBA off-day, the site correctly says there are no games.
- News: add valid Reddit credentials to `api/.env` to enable it. Without them, only the news page is unavailable.
- Blog publishing: set a local `BLOG_PASSWORD` in `api/.env`. Never put a production password in a committed file.

## Checks before a deploy

```bash
make api-test
make frontend-test
make frontend-build
```

GitHub Actions runs these checks automatically on pushes and pull requests.

## Environment variables

Copy the included `.env.example` files; keep the generated `.env` files private.

- `REACT_APP_URL`: backend URL used by the frontend; locally, `http://localhost:5001`.
- `CORS_ORIGIN`: allowed frontend origin; locally, `http://localhost:3000`.
- `USE_SAMPLE_DATA`: local demonstration mode only. Keep `false` in production.
- `BLOG_PASSWORD`, `FLASK_SECRET_KEY`, `REDDIT_CLIENT_ID`, and `REDDIT_CLIENT_SECRET`: private deployment secrets.

## Contributing

Email `rinaldinick88@gmail.com` if you are interested in contributing.
