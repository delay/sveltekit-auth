#!/bin/env julia
# Script to generate JSON list of producer's id by product's id. It allow a quick filter on map.
# 

import JSON, DBInterface, CSV, FunSQL, LibPQ
using Tables
using TOML

conffile = "../.env.local"
conf = TOML.parsefile(conffile)

DATABASE_NAME = conf["DATABASE_NAME"]
DATABASE_USER = conf["DATABASE_USER"]
DATABASE_PASSWORD = conf["DATABASE_PASSWORD"]

function write_product(id::Int32, name::String)
	println("Product ",name,", n°", id)
	sql = "Select producer_id from producers_products Where product_id=\$1"
	rows = DBInterface.execute(cnx, sql, [id])
	nb = 0
	filepath = "../static/data/products/p"*string(id)*".json"
	file = open(filepath, "w") do file
		producers = []
		for row in rows
			try
				producer_id = row[:1]
				nb += 1
				# println(" - Product ",name,", producer n°", producer_id)
				push!(producers, producer_id)
			catch err
				if isa(err, KeyError)
					println("ERROR : No departement : ",id)
				else rethrow(err)
				end
			end
		end
		write(file, JSON.json(producers))
		# println(filepath, "writen")
	end
	nb
end

# Get min/max points
connstr = "host=localhost port=5432 dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD";
# conn = LibPQ.Connection(connstr)
# cnx = LibPQ.Connection(connstr)
cnx = DBInterface.connect(LibPQ.Connection, connstr)
println("Connected")

sql = "SELECT id, name FROM products"
rows = DBInterface.execute(cnx, sql)
for row in rows
	try
		id, name = row
		nb = write_product(id, name)
		println("Product ",name,", n°", id,": ",nb," producers.")
	catch err
		if isa(err, KeyError)
			println("ERROR : No departement : ",id)
		else rethrow(err)
		end
	end
end
DBInterface.close!(cnx)
exit(0)

# Write output

