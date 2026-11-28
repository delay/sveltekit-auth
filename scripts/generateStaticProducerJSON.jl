#!/bin/env julia
#=
	Script for regenerate static JSON data for producers : static/data/producers_[AREA].json
=#

# import Pkg; Pkg.add("JSON")
# import Pkg; Pkg.add("MySQL")
using ArgParse, Tables
using DataFrames
import JSON, DBInterface

include("connect.jl")
dbConnection = OpenProduct.get_connection(ROOT_PATH)


#=
	Load all producer from an area.
=#
function loadArea(departement::Int64)
	# println("loadArea(",departement,")")
	departementStr = string(departement)
	sql = "Select id, latitude lat, longitude lng, p.company_name as name,
			COALESCE(description, p.short_description) txt,
			post_code, city, address addr, p.category  cat,
			p.phone_number_1  tel,
			case when p.send_email is NULL or p.send_email!='ko' then email else '' end as email,
			case when p.website_status in ('ok','400') then p.website_1 else '' end as web,
			case when status in ('actif') then 0 else 1 end as suspect,
			p.tag,
			string_agg(cast(pp.product_id AS text), ',') as production
		from producers p
		left join producers_products pp on pp.producer_id=p.id
		where post_code IS NOT NULL AND (post_code="*departementStr*" or (post_code>="*departementStr*"000 and post_code<"*string(departement+1)*"000))
			AND latitude is not null AND longitude is not null
			AND status in ('actif','unknown','to-check')
		GROUP BY p.id"
	# println("SQL:", sql)
	result = DBInterface.execute(dbConnection, sql)
	# producers = rowtable(result)
	col_names = LibPQ.column_names(result)
	df = DataFrames.DataFrame(result)
	# producers = [Dict(col_names .=> row) for row in eachrow(df)]
	filepath = "../static/data/producers_"*departementStr*".json"
	file = open(filepath, "w") do file
		write(file, "{\"id\":"*departementStr*",\"producers\":[\n")
		sep = ""
		nbDone = 0
		for producer in eachrow(df)
			# println(producer)
			nbDone += 1
			if nbDone%1000==0
				print(".")
			end

			# Convert to dict for JSON.json() and to store list inside.
			producer_dict = Dict(names(producer) .=> values(producer))
			# Convert production ids to names
			producer_dict["production"] = OpenProduct.convert_product_ids_to_list(producer[:production], dbConnection)

			# Convert tags to theire translations
			# mytag = producer[:tag]
			# tag_lst = [tag.name for tag in OpenProduct.convert_tag_to_list(mytag)]
			# producer_dict["tag"] = tag_lst
			# println(" -> Tag:", tag_lst, ";")

			# Print as JSON
		    line = sep*JSON.json(producer_dict)*"\n"
		    write(file, line)
		    sep = ","
		end
		write(file, "]}")
	end
	println(" File '"*filepath*"' writed.")
end


OpenProduct.loadProducts(dbConnection)
if length(ARGS)>0
	for area in ARGS
		loadArea(parse(Int64, area))
	end
else
	areas::Vector{Int} = []
	sql = "SELECT case WHEN p.post_code > 200 THEN (p.post_code / 1000)::integer ELSE p.post_code END AS area
		FROM producers p
		WHERE post_code IS NOT null and post_code>0
		group by area
		order by area"
	areasRes = DBInterface.execute(dbConnection,sql)
	for area in areasRes
		if area[1] === missing
			println("Error : null postCode in producer")
			exit()
		end
		push!(areas, area[1])
	end
	println(areas)
	for area in areas
		loadArea(area)
	end
end

DBInterface.close!(dbConnection)

