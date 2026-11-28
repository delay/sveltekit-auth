import DBInterface, LibPQ
using TOML
using Memoization

ENV=""
ENV_FILE = "../.env.local"
println("Define ENV_FILE")
if isfile(ENV_FILE)
	println("Development environment")
	ENV="dev"
else
	println("Production environment")
	ENV="prod"
	ENV_FILE = ".env"
end

CURDIR=pwd()
ROOT_PATH = ".."
if ENV=="dev"
	ROOT_PATH = "../../openproduct-web-svelte4"
end

include(ROOT_PATH*"/../OpenProduct.jl/src/OpenProduct.jl")
using .OpenProduct
