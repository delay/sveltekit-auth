#!/bin/env bash

cd ${0/install.sh/}
source ./scripts/config.sh

echo "Install commands."

# Bun
/bin/env bun --version
if [ $? -ne 0 ]; then
	echo "Install bun CLI"
	curl -fsSL https://bun.sh/install | bash
fi

# Julia
/bin/env julia --version
if [ $? -ne 0 ]; then
	echo "Install Julia CLI"
	curl -fsSL https://install.julialang.org | sh
fi

echo "Install Julia deps."

/bin/env julia <<EOF
import Pkg;
Pkg.add("ArgParse")
Pkg.add("DBInterface")
Pkg.add("LibPQ")
Pkg.add("JSON")
Pkg.add("Dates")
Pkg.add("OteraEngine")
Pkg.add("CSV")
Pkg.add("FunSQL")
Pkg.add("Tables")
Pkg.add("SMTPClient")
Pkg.add("DataFrames")
Pkg.add("Memoize")
Pkg.add("URIs")
Pkg.add("HTTP")
Pkg.add("Gumbo") # Parse HTML
Pkg.add("Cascadia") # CSS selector
Pkg.add("GZip")
Pkg.add("Memoization")
EOF


echo "Create folders."

mkdir -p ../static/data
mkdir -p ../static/producers
mkdir -p ../static/data/products
mkdir -p ../static/data/tags
mkdir -p $DUMP_PATH

echo "Set crontab"

crontab ../crontab.txt

