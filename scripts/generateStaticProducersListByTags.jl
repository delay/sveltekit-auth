#!/bin/env julia
#=
# Script to generate JSON list of producer's id by product's id. It allow a quick filter by product on /map.
# 
=#

import JSON, DBInterface, CSV, FunSQL, LibPQ
using Tables

include("connect.jl")
dbConnection = OpenProduct.get_connection(ROOT_PATH)

function write_tags(producers_tag::Dict{Int, OpenProduct.Tag})::Int
	nb = 0
	filepath = "../static/data/tags/t1.json"
	file = open(filepath, "w") do file
		write(file, JSON.json(collect(values(producers_tag))))
		nb += 1
		# println(filepath, "writen")
	end
	println("File ",filepath," updated.")
	nb
end

# Get min/max points
producers_tag = OpenProduct.get_all_available_tags()

sql = "SELECT id, tag FROM producers where tag>0"
rows = DBInterface.execute(dbConnection, sql)
for row in rows
	id_producer, tag = row
	global producers_tag
	for t in OpenProduct.convert_tag_to_list(tag)
		push!(producers_tag[t.id+1].producers, id_producer)
	end
end
nb = write_tags(producers_tag)
DBInterface.close!(dbConnection)
exit(0)

# Write output

