#!/bin/env julia
#=
# Script to generate JSON list of producer's id by product's id. It allow a quick filter by product on /map.
# 
=#

import JSON, DBInterface, CSV, FunSQL, LibPQ
using Tables

include("connect.jl")
cnx = get_connection()

include("../../openproduct-web/lib/OpenProduct.jl/src/OpenProduct.jl")
mysqlCnx = OpenProduct.dbConnect("../../openproduct-web/db/connection.yml")

sqlInsert = "INSERT INTO public.producers
	(id, latitude, longitude, company_name, firstname, lastname, short_description, description, 
		post_code, city, address, siret_number, siret_status, phone_number_1, phone_number_2, email, website_1, website_status,
		category, company_infos, status, opening_hours, send_email,
		moderation_note, created_at, closed_at, updated_at)
	VALUES(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12, \$13, \$14, \$15, \$16, \$17, \$18, \$19, \$20, \$21, \$22, \$23, \$24, \$25, \$26, \$27)
	ON CONFLICT (id) DO UPDATE SET
		latitude = EXCLUDED.latitude,
		longitude = EXCLUDED.longitude,
		company_name = EXCLUDED.company_name,
		firstname = EXCLUDED.firstname,
		lastname = EXCLUDED.lastname,
		short_description = EXCLUDED.short_description,
		description = EXCLUDED.description,
		post_code = EXCLUDED.post_code,
		city = EXCLUDED.city,
		address = EXCLUDED.address,
		siret_number = EXCLUDED.siret_number,
		siret_status = EXCLUDED.siret_status,
		phone_number_1 = EXCLUDED.phone_number_1,
		phone_number_2 = EXCLUDED.phone_number_2,
		email = EXCLUDED.email,
		website_1 = EXCLUDED.website_1,
		website_status = EXCLUDED.website_status,
		category = EXCLUDED.category,
		company_infos = EXCLUDED.company_infos,
		status = EXCLUDED.status,
		opening_hours = EXCLUDED.opening_hours,
		send_email = EXCLUDED.send_email,
		moderation_note = EXCLUDED.moderation_note,
		created_at = EXCLUDED.created_at,
		closed_at = EXCLUDED.closed_at,
		updated_at = EXCLUDED.updated_at"

sqlSelect = "SELECT id, latitude, longitude, name, firstname, lastname, shortDescription, `text`,
		postCode, city, address, if(siret='', NULL, siret), siretStatus, if(phoneNumber='', NULL, phoneNumber), if(phoneNumber2='', NULL, phoneNumber2), email, if(website='', NULL, website), websiteStatus,
		categories, companyInfos, status, openingHours, case sendEmail when 'Yes' then 'ok' when 'wrongEmail' then 'unknown' when 'Never' then 'ko' else 'unknown' end,
		noteModeration, startdate, enddate, lastUpdateDate
	FROM openproduct.producer
	ORDER BY id"
rows = DBInterface.execute(mysqlCnx, sqlSelect)
rowNum = 0
for row in rows
	try
		global rowNum+=1
		println("Rows n°",rowNum,", id=",row[:id] )
		DBInterface.execute(cnx, sqlInsert, [t for t in row])
		# println("Product ",name,", n°", id,": ",nb," producers.")
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

