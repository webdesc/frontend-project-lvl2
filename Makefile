install:
	npm install

build:
	rm -rf dist
	npm run build

start:
	npx babel-node src/bin/gendiff.js

publish:
	npm publish --dry-run

lint:
	npx eslint .
