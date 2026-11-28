#!/bin/bash

DUMP_PATH=../openproduct-db/db/data
PRODUTION_HOST=openproduct
PRODUCTION_SCRIPT_DIR=/home/kaja9241/openproduct-svelte4/scripts

ENV=""
if [ -e .env.local ]; then
        echo "Developpement environment"
	source .env.local
        ENV=dev
else if [ -e .env.production ]; then
        echo "Production environment"
	source .env.production
        ENV=prod
else
        echo "Unknown environment => Exit"
        exit 1
fi fi
PGPASSWORD="$DATABASE_PASSWORD"
export PGPASSWORD

