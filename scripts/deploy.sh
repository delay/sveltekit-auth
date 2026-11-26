#!/bin/bash

PRODUCTION_DIR=/home/kaja9241/public_node

cd ${0/deploy.sh/}/..
source scripts/config.sh

if [ $ENV == "prod" ]; then
	echo "Generate static datas"
	./scripts/generate_static.sh
	if [ $? -ne 0 ]; then
		echo "Fail generate static datas"
		exit 1
	fi
fi

bun install
bun run build
# npm ci --omit=dev # --production For node_modules

if [ $ENV == "dev" ]; then
	echo "Send to production"
	# rsync -avpzh build package.json  svelte.config.js tailwind.config.js postcss.config.cjs components.json vite.config.ts tsconfig.json drizzle.config.ts $PRODUTION_HOST:$PRODUCTION_DIR/
	# rsync -avpzh scripts .env.production $PRODUTION_HOST:~/
else
	echo "Copy to production"
	cp -r build package.json  svelte.config.js tailwind.config.js postcss.config.cjs components.json vite.config.ts tsconfig.json drizzle.config.ts $PRODUCTION_DIR/
fi

./scripts/db_dump.sh
