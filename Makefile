up:
	docker-compose up

build:
	docker-compose build

backup:
	python server/scripts/backup_server.py

draw:
	python server/scripts/export/draw.py

draw_pdf:
	python server/app/draw.py