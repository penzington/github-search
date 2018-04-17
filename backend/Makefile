BIN := $(shell pwd)/node_modules/.bin

install-deps:
	yarn install --pure-lockfile

clean:
	rm -rf dist yarn-error.log

distclean: clean
	rm -rf node_modules

dev: install-deps
	PORT=3001 yarn dev

deploy:
	now && now alias
