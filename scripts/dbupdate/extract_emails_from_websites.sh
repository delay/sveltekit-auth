#!/bin/env bash

cd ${0/extract_emails_from_websites.sh/}/../..

source scripts/config.sh
export DATABASE_URL=$DATABASE_URL
source scripts/venv/3.11/bin/activate

echo params=$*

python3 scripts/dbupdate/extract_emails_from_websites.py $*

