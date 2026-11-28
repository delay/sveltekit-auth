#!/bin/bash

cd ${0/backup_production.sh/}/..
source scripts/config.sh

if [ $ENV == "prod" ]; then
	echo "Error : must not be launch on production environment."
	exit 1
fi

rsync -avpzh $PRODUTION_HOST:$PRODUCTION_SCRIPT_DIR/../$DUMP_PATH/pg_dump.sql $DUMP_PATH
