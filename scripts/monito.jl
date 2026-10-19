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

monito_id = 0



#=
	Load all producer from an area.
=#
function monito_postgreSQL()
	# println("monito_postgreSQL()")
	sql = "INSERT INTO query_metrics (query_id, monito_id, duration, state)
SELECT md5(query) as query_id, "+string(monito_id)+" as monito_id, query, EXTRACT(MS FROM NOW() - query_start)::int as duration,  state
FROM pg_stat_activity
WHERE state is not null and state!='idle'
-- AND NOW() - query_start > '100ms'::interval"
	# println("SQL:", sql)
	result = DBInterface.execute(dbConnection, sql)
end

monito_postgreSQL()

DBInterface.close!(dbConnection)

