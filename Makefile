.PHONY: api-setup api api-test frontend-setup frontend frontend-test frontend-build

api-setup:
	python3 -m venv api/.venv
	api/.venv/bin/pip install -r api/requirements.txt

api:
	cd api && . .venv/bin/activate && python src/app.py

api-test:
	cd api && PYTHONPATH=src .venv/bin/python -m unittest discover -s src

frontend-setup:
	cd nba-app && npm install

frontend:
	cd nba-app && npm start

frontend-test:
	cd nba-app && npm test -- --watchAll=false --runInBand

frontend-build:
	cd nba-app && npm run build
