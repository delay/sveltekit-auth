#!/bin/env julia
#=
# Script to generate JSON list of producer's id by product's id. It allow a quick filter by product on /map.
# 
=#

import JSON, DBInterface, CSV, FunSQL, LibPQ
using Tables

include("connect.jl")
dbConnection = OpenProduct.get_connection(ROOT_PATH)


products_all_descendants = Dict{Int, Array{Int}}()

function get_all_childs(product_id)
	global products_all_descendants
	if length(products_all_descendants)==0
		sql = "Select parent_id, child_id
			from product_relationships
			order by id desc"
		rows = DBInterface.execute(dbConnection, sql)
		for row in rows
			parent = Int(row[1])
			child = Int(row[2])
			descendants = get(products_all_descendants, child,  [])
			descendants2 = get(products_all_descendants, parent,  [])
			push!(descendants, child)
			descendants3 = vcat(descendants, descendants2)
			products_all_descendants[parent] = descendants3
			# println("Desc (",parent,") = ",descendants3)
		end
	end
	retVal = get(products_all_descendants, product_id, [])
	# println("get_all_childs(",product_id,") : ", retVal)
	return retVal
end

function write_product(id::Int32, name::String)
	# println("Product ",name,", n°", id)
	sql = "Select producer_id from producers_products
		Where product_id in ("*string(id)
	subproducts = get_all_childs(id)
	for i in subproducts
		sql *= ", "*string(i)
	end
	sql *=") and producer_id is not null"
	# println("SQL: ",sql)
	rows = DBInterface.execute(dbConnection, sql)
	nb = 0
	filepath = "../static/data/products/p"*string(id)*".json"
	file = open(filepath, "w") do file
		producers = []
		producers_ids = ""
		sep = ""
		for row in rows
			try
				producer_id = row[:1]
				nb += 1
				# println(" - Product ",name,", producer n°", producer_id)
				push!(producers, producer_id)
				producers_ids *= sep*string(producer_id)
				sep = ","
			catch err
				if isa(err, KeyError)
					println("ERROR : No area : ",id)
				else rethrow(err)
				end
			end
		end
		write(file, "{\n \"subproducts\":")
		write(file, JSON.json(subproducts))
		write(file, ",\n \"producers\":")
		write(file, JSON.json(producers))
		if nb>0 && nb<100
			sql = "Select id, company_name as name, case when post_code>99 then post_code/1000 else post_code end as area, latitude as x, longitude as y
				from producers Where id in ("*string(producers_ids)*")"
			rows = DBInterface.execute(dbConnection, sql)
			producers = rowtable(rows)
			write(file, ",\n \"list\":"*JSON.json(producers))
		end
		write(file, "\n}")
		println("  - ",filepath, " writen.")
	end
	nb
end

# Get min/max points

sql = "SELECT id, name FROM products"
rows = DBInterface.execute(dbConnection, sql)
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
DBInterface.close!(dbConnection)
exit(0)

# Write output

