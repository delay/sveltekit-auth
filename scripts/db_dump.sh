#!/bin/bash

cd ${0/db_dump.sh/}/..
source scripts/config.sh

# for table in products product_relationships; do
# 	echo " - table:$table"
# 	pg_dump --data-only -U $DATABASE_USER -h localhost $DATABASE_NAME -t $table > ./$table.sql
# done

pg_dump --clean --if-exists --schema-only -U $DATABASE_USER -h localhost $DATABASE_NAME > $DUMP_PATH/pg_dump.schema.sql
pg_dump --clean --if-exists --exclude-table=users -U $DATABASE_USER -h localhost $DATABASE_NAME > $DUMP_PATH/pg_dump.sql
pg_dump --clean --if-exists --table=users -U $DATABASE_USER -h localhost $DATABASE_NAME > $DUMP_PATH/pg_dump_users.sql

echo "All dumped into '$DUMP_PATH'"

