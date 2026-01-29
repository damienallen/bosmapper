up:
	docker compose build; docker compose up

build:
	docker compose build

backup:
	python bosmapper/scripts/backup_server.py

draw:
	python bosmapper/scripts/export/draw.py

draw_pdf:
	python bosmapper/app/draw.py
