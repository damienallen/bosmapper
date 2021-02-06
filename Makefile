deploy-prod:
	@echo "Deploying to bosmapper.dallen.co"
	rsync -azP ./build -e "ssh -i ~/.ssh/deploy" deploy@mothership.dallen.co:/home/deploy/bosmapper/

deploy-dev:
	@echo "Deploying to devbos.dallen.co"
	rsync -azP ./build -e "ssh -i ~/.ssh/id_ed25519" damien@dallen.dev:/home/damien/mothership/bosmapper/
