dev:
	$(MAKE) -j2 _dev-with-backend

_dev-with-backend: dev-frontend _dev-backend

_dev-backend:
	$(MAKE) -C backend dev

dev-frontend: install-deps
	yarn start

install-deps:
	yarn install --pure-lockfile

clean:
	rm -rf dist yarn-error.log

build: install-deps
	yarn build

distclean: clean
	rm -rf node_modules

run-docker-fullstack:
	docker-compose up