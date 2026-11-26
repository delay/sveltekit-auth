#!/bin/env bash

cd ${0/generate_static.sh/}

./generateStaticProducerHTML.jl
if [ $? -ne 0 ]; then
	echo "Fail run ./generateStaticProducerHTML.jl"
	exit 1
fi
./generateStaticProducerJSON.jl
if [ $? -ne 0 ]; then
	echo "Fail run ./generateStaticProducerJSON.jl"
	exit 1
fi
./generateStaticProducersListByProducts.jl
if [ $? -ne 0 ]; then
	echo "Fail run ./generateStaticProducersListByProducts.jl"
	exit 1
fi
./generateStaticProducersListByTags.jl
if [ $? -ne 0 ]; then
	echo "Fail run ./generateStaticProducersListByTags.jl"
	exit 1
fi

