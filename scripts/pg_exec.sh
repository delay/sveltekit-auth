#!/bin/bash

cd ${0/pg_exec.sh/..}
source scripts/config.sh

SQL_SCRIPT=./scripts/pg_exec.sql

# for table in products product_relationships; do
# 	echo " - table:$table"
# 	pg_dump --data-only -U $DATABASE_USER -h localhost $DATABASE_NAME -t $table > ./$table.sql
# done

if [ $# -gt 0 ]; then
	if [ -f $1 ]; then
		echo "EXEC : $1"
		SQL_SCRIPT=$1
	else if [ -f ./scripts/$1 ]; then
		echo "EXEC : $1"
		SQL_SCRIPT=./scripts/$1
	fi
	fi
fi

psql -U $DATABASE_USER -h localhost $DATABASE_NAME < $SQL_SCRIPT
