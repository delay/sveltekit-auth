#!/bin/env julia
#=
# Script to generate HTML producer page used to get details from /map pins : static/data/producers/producer_[ID].html.
# 
=#

import JSON, OteraEngine, Dates, DBInterface
using DataFrames
DEBUG=true

include("connect.jl")
dbConnection = OpenProduct.get_connection(ROOT_PATH)

TemplateProducerPage = missing

function generateStaticProducerPage(filepath::String, producer::DataFrameRow{DataFrame, DataFrames.Index}, col_names::Vector{String})
	# println("generateStaticProducerPage(",filepath,",",producer,")")
	if ismissing(TemplateProducerPage)
		global TemplateProducerPage = OteraEngine.Template("./templateProducerPage.html")
	end
	open(filepath, "w") do fd
		producer_dict = Dict(names(producer) .=> values(producer))
		producer_dict["production"] = join(OpenProduct.convert_product_ids_to_list(producer_dict["production"], dbConnection), ", ")
		producer_dict["tag"] = join([tag.label for tag in OpenProduct.convert_tag_to_list(producer_dict["tag"])], ", ")
		# println("Dict:", producer_dict)
		dictionary = Dict{Symbol, String}(
			Symbol(name) => string(producer_dict[name]) for (index, name) in enumerate(col_names)
		)
		write(fd, TemplateProducerPage(init=dictionary))
	end
	# println("File ",filepath," written.")
end

function generateStaticProducerPages(webrootpath::String, webpath::String; useCache=false)
	if DEBUG; println("generateStaticProducerPages(",webrootpath,",",webpath,")"); end
	mindate = "2000-01-01 00:00:00"
	sql = "Select case when updated_at>='"*mindate*"' then 0 else 1 end ok, id, latitude lat, longitude lng, company_name as name,
			COALESCE(description, short_description) as text,
			short_description as job,
			concat(address,' ',post_code,' ',city) as address,
			phone_number_1, phone_number_2,
			case when send_email is NULL or send_email!='ko' then email else '' end as email,
			case when website_status in ('ok','400') then website_1 else '' end as website, siret_number as siret,
			p.tag,
			string_agg(cast(pp.product_id AS text), ',') as production
		FROM producers p
		left join producers_products pp on pp.producer_id=p.id
		WHERE latitude is not null AND longitude is not null
			AND status in ('actif','unknown','to-check')
		GROUP BY p.id
		ORDER BY p.company_name;"
	if DEBUG
		println("SQL:",sql)
	end
	producers = DBInterface.execute(dbConnection, sql)
	weburl = webpath*"/producer_%d.html"
	nb::Int = 0
	nbDone::Int = 0
	producers2 = Dict{Int, String}()
	col_names = LibPQ.column_names(producers)
	df = DataFrames.DataFrame(producers)
	for producer in eachrow(df)
		if producer[:ok]==0
			producerFilepath = webrootpath*replace(weburl, "%d"=>string(producer[:id]))
			generateStaticProducerPage(producerFilepath, producer, col_names)
			nbDone += 1
			if nbDone%1000==0
				print(".")
			end
		end
		# println(" File '"*producerFilepath*"' writed.")
		producers2[producer[:id]] = producer[:name]
		nb += 1
	end
	filepath = webrootpath*webpath*"/index.html"
	page = OteraEngine.Template("./templateProducerDirectory.html")
	file = open(filepath, "w") do file
		write(file, page(init=Dict(
			Symbol("producers")=>producers2,
			Symbol("weburl")=>webpath
		)))
	end
	println(string(nb)*" producers in file '"*filepath*"' writed (",string(nbDone),").")
end

generateStaticProducerPages("../static","/producers", useCache=true)

