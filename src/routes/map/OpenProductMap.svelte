<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import { Search, MapPin, X, CircleX } from 'lucide-svelte';
	import ProductSelector from '$lib/components/product_selector/ProductSelector.svelte';
	import { resolve } from '$app/paths';

	type ProducerMinimalInfo = {
		id: number;
		name: string;
		area: number;
		x?: number;
		y?: number;
	}
	type ProductDetails = {
		producers: number[];
		list: ProducerMinimalInfo[];
	};
	initializeStores();
	const drawerStore = getDrawerStore();
	let filters = $state({
		category: '',
		address: '',
		produces: new Map<number, string>(),
		tags: 0
	});
	
	let availableTags = $state<any[]>([]);
	let producersDrawerData = $state<{
		productName: string;
		producers: Map<number, ProducerMinimalInfo[]>;
	} | null>(null);
	
	function openFilters() {
		drawerStore.open({
			id: 'filter-drawer',
			position: 'bottom',
			height: 'h-auto max-h-[80vh]',
			bgDrawer: 'bg-surface-50-900-token',
			bgBackdrop: 'bg-surface-backdrop-token',
			padding: 'p-0'
		});
	}

	function closeFilters() {
		drawerStore.close();
	}

	function openProducersDrawer(productName: string, producersByArea: Map<number, ProducerMinimalInfo[]>) {
		producersDrawerData = { productName, producers: producersByArea };
		drawerStore.open({
			id: 'producers-drawer',
			position: 'right',
			width: 'w-full md:w-96',
			bgDrawer: 'bg-surface-50-900-token',
			bgBackdrop: 'bg-surface-backdrop-token',
			padding: 'p-0'
		});
	}

	function closeProducersDrawer() {
		drawerStore.close();
		producersDrawerData = null;
	}

	function centerMapOnProducer(producer: ProducerMinimalInfo) {
		if (map && producer.x && producer.y) {
			map.setView([producer.x, producer.y], 15);
			closeProducersDrawer();
		}
	}

	function resetFilters() {
		filters = {
			category: '',
			address: '',
			produces: new Map<number, string>(),
			tags: 0
		};
		if (filterSelect) filterSelect.value = '';
		if (addressInput) addressInput.value = '';
		filterProducersByCategory('');
	}

	function applyFilters() {
		console.log("applyFilters();");
		
		// Combiner les filtres
		const combinedFilter = (producer: any) => {
			let result = true;
			
			// Filtre par produit
			if (filters.produces.size > 0) {
				result = result && filterByProduct(producer);
			}
			
			// Filtre par tag
			result = result && filterByTags(producer);
			
			// Filtre par catégorie
			if (filters.category) {
				result = result && charFilter(producer);
			}
			
			return result;
		};
		
		if (filters.produces.size>0) {
			console.log("applyFilters(products:",filters.produces,");");
			myfilter = filterByProduct;
			let someInCache = false;
			producersFilterByProduct = new Map();
			// console.log("applyFilters() : loadedAreas = ",loadedAreas,";");
			// for (const myArea of loadedAreas) {
				const myArea = 0;
				console.log("applyFilters() : area ",myArea,";");
				let datas = productsByAreas.get(myArea) || new Map<number, ProductDetails>();
				for (const product of filters.produces.keys()) {
					const producers = datas.get(product);
					if (!producers) {
						fetch(resolve('/data/products')+'/p'+product+'.json')
							.then(response => response.json())
							.then(producers => {
								let datas = productsByAreas.get(myArea) || new Map<number, ProductDetails>();
								datas.set(product, producers);
								productsByAreas.set(myArea, datas);
								for (const p of producers.producers) {
									producersFilterByProduct.set(p, true);
								}
								displayProducers(producersLoaded);
							})
							.catch(error => {
								console.error(
									'Erreur lors du chargement du département ',
									myArea, ' for product ', product, ' : ', error
								);
							});
					} else {
						for (const p of producers.producers) {
							producersFilterByProduct.set(p, true);
						}
						someInCache = true;
					}
				}
			// }
				if (someInCache) {
					myfilter = combinedFilter;
					displayProducers(producersLoaded);
				}
			} else if (filters.category) {
				console.log("applyFilters(category:",filters.category,");");
				myfilter = combinedFilter;
				filterProducersByCategory(filters.category);
			} else if (filters.tags > 0) {
				console.log("applyFilters(tags:",filters.tags,");");
				myfilter = combinedFilter;
				displayProducers(producersLoaded);
			} else {
				myfilter = noFilter;
				filterProducersByCategory("");
			}
		if (filters.address) {
			console.log("applyFilters(address:",filters.address,");");
			searchAddress();
		}
		closeFilters();
	}
	// Gérer la validation du ProductSelector
	function handleProductValidation(event: CustomEvent) {
		console.log("handleProductValidation(",event,");");
	}
	async function removeProduct(product_id: number) {
		// Créer un nouveau Map pour déclencher la réactivité
		const newMap = new Map(filters.produces);
		if (newMap.has(product_id)) {
			newMap.delete(product_id);
		}
		filters.produces = newMap;
	}


 	let mapContainer = $state<HTMLDivElement>();
	let filterSelect = $state<HTMLSelectElement>();
	let addressInput = $state<HTMLInputElement>();
	let subfilterDiv = $state<HTMLDivElement>();
	let produceFilterInput = $state<HTMLInputElement>();
	let geolocationButton = $state<HTMLButtonElement>();

	// Variables globales pour la carte
	let map: any;
	let areas: any;
	let loadedAreas: number[] = [];
	let loadingAreas: number[] = [];
	let areasToCheck: number[]|null = null;

	let productsByAreas: Map<number,Map<number, ProductDetails>> = new Map(); // Map<AreaId, Map<ProductId, Producers[]>>
	let producersFilterByProduct: Map<number, boolean> = new Map();
	let filterChar = "";
	let markersLoaded: any = {};
	let producersLoaded: any[] = [];
	let mapInitialized = false;
	let mapIcons: any = {};

	// Constantes
	const DEBUG = false;
	const MAP_MIN_ZOOM = 10;
	const MAP_MAX_ZOOM = 19;
	const MAP_DEFAULT_ZOOM = 12;
	const FILTER_CODE_NOT = '_';
	const LOCALSTORAGE_MAPCENTER_KEY = "mapCenter";

	// Filtres
	const noFilter = (producer: any) => true;
	let myfilter = noFilter;

	onMount(async () => {
		if (browser) {
			await loadLeaflet();
			initializeIcons();
			await initializeMap();
			await loadTags();
		}
	});

	function initializeIcons() {
		mapIcons = {
			green: getIcon("#0a6b1d"),    // Alimentaire
			yellow: getIcon("#fcba03"),   // Habillement
			blue: getIcon("#0a106b"),     // Artisans
			red: getIcon("#990000"),      // Produits
			cyan: getIcon("#359396"),     // PME
			black: getIcon("#000000")     // Défaut
		};
	}
	function is_tagged(tag_value: number, tag2test: number) {
		return (tag2test & tag_value) > 0;
	}

	async function loadLeaflet() {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
		document.head.appendChild(link);

		return new Promise((resolve) => {
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
			script.onload = resolve;
			document.head.appendChild(script);
		});
	}

	async function initializeMap() {
		if (!mapContainer) {
			console.log("mapContainer not found");
			return;
		}

		console.log("Initializing map...");

		// @ts-ignore
		const L = window.L;
		if (!L) {
			console.log("Leaflet not loaded");
			return;
		}

		// Essayer de récupérer la position stockée
		let latitude = 45.7640;
		let longitude = 4.8357;
		
		try {
			const storedPos = localStorage.getItem(LOCALSTORAGE_MAPCENTER_KEY);
			if (storedPos) {
				const pos = JSON.parse(storedPos);
				latitude = pos[0];
				longitude = pos[1];
				console.log("Using stored position:", latitude, longitude);
			}
		} catch (e) {
			console.log("Erreur lors de la récupération de la position stockée:", e);
		}

		// Initialiser directement la carte
		console.log("Creating map with position:", latitude, longitude);
		initMap(latitude, longitude);

		// Essayer la géolocalisation en arrière-plan
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const newLat = position.coords.latitude;
					const newLng = position.coords.longitude;
					console.log("Geolocation success:", newLat, newLng);
					if (mapInitialized && (Math.abs(newLat - latitude) > 0.01 || Math.abs(newLng - longitude) > 0.01)) {
						centerMap(newLat, newLng);
					}
				},
				(error) => {
					console.log("Géolocalisation échouée:", error);
				}
			);
		}
	}

	function initMap(latitude: number, longitude: number) {
		if (!mapInitialized && mapContainer) {
			// @ts-ignore
			const L = window.L;
			
			if (DEBUG) console.log("initMap(", [latitude, longitude], ")");
			
			map = L.map(mapContainer).setView([latitude, longitude], MAP_DEFAULT_ZOOM);
			
			map.on('moveend zoomend', function() {
				checkNeighbouring();
				storePosition();
			});

			// Charger les zones géographiques
			fetch('/data/departements.json')
				.then(response => response.json())
				.then(data => {
					areas = data;
					initProducers();
				})
				.catch(error => {
					console.error('Erreur lors du chargement des départements:', error);
				});

			// Ajouter la couche de tuiles
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: MAP_MAX_ZOOM,
				minZoom: MAP_MIN_ZOOM,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);

			mapInitialized = true;
		} else {
			centerMap(latitude, longitude);
		}
	}

	function centerMap(latitude: number, longitude: number) {
		const pos = [latitude, longitude];
		map.setView(pos, MAP_DEFAULT_ZOOM);
		localStorage.setItem(LOCALSTORAGE_MAPCENTER_KEY, JSON.stringify(pos));
		initProducers();
	}

	function storePosition() {
		const center = map.getCenter();
		if (DEBUG) console.log("storePosition(", center, ")");
		const pos = [center.lat, center.lng];
		localStorage.setItem(LOCALSTORAGE_MAPCENTER_KEY, JSON.stringify(pos));
	}

	function isInArea(area: any, point: any) {
		return area.min[0] < point.lat && area.max[0] > point.lat
			&& area.min[1] < point.lng && area.max[1] > point.lng;
	}

	function getMainArea() {
		const center = map.getCenter();
		for (const [areaId, area] of Object.entries(areas)) {
			if (isInArea(area, center)) {
				return parseInt(areaId);
			}
		}
		
		console.log("Warning : fail getMainArea() with center");
		const bounds = map.getBounds();
		const corners = [
			bounds.getNorthWest(),
			bounds.getNorthEast(),
			bounds.getSouthWest(),
			bounds.getSouthEast()
		];
		
		for (const [areaId, area] of Object.entries(areas)) {
			for (const corner of corners) {
				if (isInArea(area, corner)) {
					return parseInt(areaId);
				}
			}
		}
		
		console.log("Error : fail getMainArea()");
		return 0;
	}

	function refreshAreasToCheck() {
		if (DEBUG) console.log("refreshAreasToCheck() for ", loadedAreas);
		
		let neighbours: number[] = [];
		for (const area of loadedAreas) {
			if (areas[area] == undefined) {
				console.log("Error : areas[", area, "]==undefined");
			} else if (neighbours.length == 0) {
				neighbours = [...areas[area].nbhd];
			} else {
				const neighbours2 = areas[area].nbhd;
				const merged = [...new Set([...neighbours, ...neighbours2])].sort((a, b) => a - b);
				neighbours = merged;
			}
		}
		
		if (DEBUG) console.log("Neighbours:", neighbours);
		areasToCheck = neighbours.filter(x => !loadedAreas.includes(x));
		if (DEBUG) console.log("AreasToCheck:", areasToCheck, "; loadedAreas=", loadedAreas);
	}

	function checkNeighbouring() {
		if (DEBUG) console.log("checkNeighbouring()");
		if (areasToCheck == null) {
			refreshAreasToCheck();
		}

		const toLoad: number[] = [];
		const center = map.getCenter();
		const bounds = map.getBounds();
		const corners = [
			center,
			bounds.getNorthWest(),
			bounds.getNorthEast(),
			bounds.getSouthWest(),
			bounds.getSouthEast()
		];

		for (const areaId of areasToCheck || []) {
			const area = areas[areaId];
			for (const point of corners) {
				if (isInArea(area, point)) {
					toLoad.push(areaId);
					break;
				}
			}
		}

		if (toLoad.length > 0) {
			if (DEBUG) console.log("checkNeighbouring() : need to load : ", toLoad);
			getAllProducers(toLoad);
		}
	}

	async function getAllProducers(areaIds: number[]) {
		for (const areaId of areaIds) {
			if (!loadingAreas.includes(areaId) && !loadedAreas.includes(areaId)) {
				loadingAreas.push(areaId);
				try {
					const response = await fetch(resolve(`/data`)+"/producers_"+areaId.toString()+".json");
					if (response.ok) {
						let departementConfig = await response.json();
						console.log("getAllProducers() => " , departementConfig);
						const producers = departementConfig.producers;
						producersLoaded.push(...producers);
						displayProducers(producers);
						loadedAreas.push(areaId);
						loadingAreas = loadingAreas.filter(id => id !== areaId);
						areasToCheck = null; // Force refresh
					} else {
						console.log(`Pas de données pour la zone ${areaId}`);
						loadingAreas = loadingAreas.filter(id => id !== areaId);
					}
				} catch (error) {
					console.error(`Erreur lors du chargement de la zone ${areaId}:`, error);
					loadingAreas = loadingAreas.filter(id => id !== areaId);
				}
			}
		}
	}

	function initProducers() {
		loadedAreas = [];
		loadingAreas = [];

		// Supprimer tous les marqueurs précédents
		for (const key in markersLoaded) {
			map.removeLayer(markersLoaded[key][1]);
		}
		markersLoaded = {};
		producersLoaded = [];

		areasToCheck = null;
		const areaNumber = getMainArea();
		if (areaNumber > 0) {
			getAllProducers([areaNumber]);
		}
	}

	function getIcon(color: string) {
		const markerHtmlStyles = `
			background-color: ${color};
			width: 2rem;
			height: 2rem;
			display: block;
			left: -1rem;
			top: -1rem;
			position: relative;
			border-radius: 2rem 2rem 0;
			transform: rotate(45deg);
			border: 1px solid #FFFFFF`;

		// @ts-ignore
		return window.L.divIcon({
			className: "openproduct-pin",
			html: `<span style="${markerHtmlStyles}"></span>`
		});
	}

	function getMarkerPin(producer: any) {
		const cat = producer.cat;
		if (cat == null || !mapIcons.black) return mapIcons.green;
		
		switch (cat[0]) {
			case "H": return mapIcons.yellow;  // Habillement
			case "A": return mapIcons.green;   // Alimentaire
			case "P": return mapIcons.red;     // Produits
			case "O": return mapIcons.blue;    // Artisans
			case "I": return mapIcons.cyan;    // PME
			default: return mapIcons.black;
		}
	}

	function formatTel(tel: string) {
		const len = tel.length;
		let i = 0;
		let output = "";
		let sep = "";
		while ((i + 2) < len) {
			output += sep + tel[i] + tel[i + 1];
			sep = " ";
			i = i + 2;
		}
		output += sep + tel[i] + tel[i + 1];
		return output;
	}

	function newMarker(producer: any) {
		// @ts-ignore
		const L = window.L;
		const marker = L.marker([producer.lat, producer.lng], {
			icon: getMarkerPin(producer)
		});

		let text = `<h3>${producer.name}</h3>`;
		if (producer.web) {
			text = `<a href="${producer.web}" target="_blank">${text}</a>`;
		}
		if (producer.tag && producer.tag>0) {
			text += "<p>Tag : "; var sep = "";
			for (const t of availableTags) {
				if (is_tagged(t.mask, producer.tag)) {
					text += sep+t.label;
					sep = ",";
				}
			}
			text += "</p>";
		}
		if (producer.suspect == 1) {
			text += '<span style="color:red">Ce producteur semble ne plus exister. Contactez-nous si vous avez des informations.</span>';
		}
		text += `<p>${producer.txt}</p>`;
		if (producer.production && producer.production.length>0) {
			text += "<p>Production : "; var sep = "";
			for (const product of producer.production) {
				text += sep+product;
				sep = ",";
			}
			text += "</p>";
		}
		text += "<a href='"+resolve("/")+"producers/producer_"+producer.id+".html' target='producer'>+ d'infos</a><br>";
		if (producer.email) {
			text += `Email: <a href="mailto:${producer.email}">${producer.email}</a><br>`;
		}
		if (producer.tel) {
			text += `Tél: <a href="tel:${producer.tel}">${formatTel(producer.tel)}</a><br>`;
		}
		if (producer.addr) {
			text += `Adresse: <a href="geo:${producer.lat},${producer.lng}">${producer.addr}`;
			if (producer.postcode) {
				text += ` - ${producer.postcode}`;
				if (producer.city) {
					text += ` ${producer.city}`;
				}
			}
			text += '</a><br>';
		}

		marker.bindPopup(text);
		return marker;
	}

	function getProducerKey(producer: any) {
		return "m" + producer.id;
	}

	function displayProducers(producers: object[]) {
		// console.log("displayProducers(", producers, ")");
		let nbDisplayingProducers = 0;
		for (const producer of producers) {
			// console.log("displayProducers() : producer=", producer);
			if (producer != undefined) {
				const key = getProducerKey(producer);
				const markerManager = markersLoaded[key];
				
				if (myfilter(producer)) {
					nbDisplayingProducers += 1;
					if (markerManager != undefined) {
						if (markerManager[0] == false) {
							markerManager[0] = true;
							markerManager[1].addTo(map);
						}
					} else {
						const marker = newMarker(producer);
						marker.addTo(map);
						markersLoaded[key] = [true, marker];
					}
				} else {
					if (markerManager != undefined && markerManager[0] == true) {
						map.removeLayer(markerManager[1]);
						markerManager[0] = false;
					}
				}
			}
		}
		// If no pins displayed
		// console.log("displayProducers() => ", nbDisplayingProducers);
		if (nbDisplayingProducers==0 && myfilter==filterByProduct) {
			let myArea = 0;
			let datas = productsByAreas.get(myArea);
			if (!datas) { // Should not be null as filterByProduct has initialized it
				console.log("INFO : No product found on area ",myArea);
				return false;
			}
			// console.log("INFO : products found on ",myArea);
				for (const product of filters.produces.keys()) {
					const producers = datas.get(product);
					if (!producers) { // Should not be null as filterByProduct has initialized it
						console.log("ERROR : displayProducers() : No producers of ", product, " found.");
						return false;
					}
					// console.log("INFO : producer of ", product, " : ", producers);
					// Afficher la liste des producteurs si disponible
					if (producers.list && producers.list.length > 0) {
						const productName = filters.produces.get(product) || 'ce produit';
						
						// Grouper par département
						const byArea = new Map<number, ProducerMinimalInfo[]>();
						for (const p of producers.list) {
							const area = p.area || 0;
							if (!byArea.has(area)) {
								byArea.set(area, []);
							}
							byArea.get(area)!.push(p);
						}
						
						// Ouvrir le drawer avec la liste des producteurs
						openProducersDrawer(productName, byArea);
					} else if (producers.producers && producers.producers.length > 0) {
						const productName = filters.produces.get(product) || 'ce produit';
						alert(`Aucun producteur de "${productName}" trouvé dans la zone affichée.\n\n${producers.producers.length} producteurs disponibles au total (liste trop longue pour être affichée).`);
					}
				}
		}
	}

	// Fonctions de filtrage
	function str_contains(str: string, middle: string) {
		return str.includes(middle);
	}

	const filterByProduct = (producer: any) => {
		return producersFilterByProduct.get(producer.id) || false;
	};
	
	const filterByTags = (producer: any) => {
		if (filters.tags==0) return true;
		return (filters.tags & producer.tag)==filters.tags;
	};
	const charFilter = (producer: any) => {
		let inverse = false;
		let filter = filterChar;
		
		if (filterChar.charAt(0) == FILTER_CODE_NOT) {
			filter = filterChar.substring(1);
			inverse = true;
		}

		if (producer && producer.cat != null) {
			const is = str_contains(producer.cat, filter);
			return inverse ? !is : is;
		}
		return false;
	};

	async function filterProducersByCategory(filter: string) {
		if (DEBUG) console.log("filterProducersByCategory(", filter, ")");
		filterChar = filter;
		if (produceFilterInput) {
			produceFilterInput.value = "";
		}
		if (filter == "") {
			console.log("filterProducersByCategory(", filter, ") : no category filter");
			myfilter = noFilter;
			if (subfilterDiv) {
				subfilterDiv.innerHTML = "";
			}
		} else {
			myfilter = charFilter;
			if (subfilterDiv) {
				subfilterDiv.innerHTML = "";
			}
		}
		// Réappliquer le filtre sur tous les producteurs chargés
		displayProducers(producersLoaded);
	}

	// Géolocalisation
	function getCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const lat = position.coords.latitude;
					const lng = position.coords.longitude;
					centerMap(lat, lng);
				},
				(error) => {
					console.error("Erreur de géolocalisation:", error);
					alert("Impossible d'obtenir votre position. Vérifiez les permissions de géolocalisation.");
				}
			);
		} else {
			alert("La géolocalisation n'est pas supportée par ce navigateur.");
		}
	}

	// Recherche d'adresse
	async function searchAddress() {
		const address = filters.address || (addressInput ? addressInput.value.trim() : '');
		if (!address) return;

		const encodedAddress = encodeURIComponent(address);
		const url = `https://api-adresse.data.gouv.fr/search/?q=${encodedAddress}`;

		try {
			const response = await fetch(url);
			const data = await response.json();
			
			if (data.features && data.features.length > 0) {
				const coordinates = data.features[0].geometry.coordinates;
				const lat = coordinates[1];
				const lng = coordinates[0];
				centerMap(lat, lng);
			} else {
				alert("Adresse non trouvée");
			}
		} catch (error) {
			console.error("Erreur lors de la recherche d'adresse:", error);
			alert("Erreur lors de la recherche d'adresse");
		}
	}

	function handleFilterChange() {
		if (!filterSelect) return;
		const selectedValue = filterSelect.value;
		filterProducersByCategory(selectedValue);
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchAddress();
		}
	}
	
	async function loadTags() {
		try {
			const response = await fetch(resolve(`/data`)+"/tags/t1.json");
			const data = await response.json();
			availableTags = data;
			for (const tag of data) {
				availableTags[tag.id].mask = 2**tag.id
			}
			console.log('Tags chargés:', availableTags);
		} catch (error) {
			console.error('Erreur lors du chargement des tags:', error);
		}
	}
	
	function toggleTag(tagId: number) {
		var newSet = filters.tags;
		if (is_tagged(tagId, newSet)) {
			newSet = (newSet & ~tagId);
		} else {
			newSet = (newSet | tagId);
		}
		filters.tags = newSet;
		console.log(filters);
	}
</script>

<svelte:head>
	<title>Carte des producteurs</title>
</svelte:head>

<div class="relative w-full h-screen overflow-hidden">
	<!-- Carte en plein écran -->
	<div bind:this={mapContainer} class="absolute inset-0 z-0"></div>

	<!-- Boutons flottants -->
	<div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
		<button type="button"
				class="btn variant-filled-primary shadow-xl"
				onclick={openFilters}>
			<Search size={20} />
			<span>Filtres</span>
		</button>
	</div>
</div>

<!-- Drawer de filtres -->
<Drawer>
	{#if $drawerStore.id === 'filter-drawer'}
		<div class="flex flex-col h-full bg-surface-50-900-token">
			<!-- Header -->
			<header class="bg-primary-500 text-white p-4 flex items-center justify-between">
				<h2 class="h3 font-bold">Filtrer les producteurs</h2>
				<button type="button"
					class="btn-icon variant-filled hover:variant-filled-error"
					onclick={closeFilters}>
					<X size={24} />
				</button>
			</header>

			<!-- Contenu des filtres -->
			<div class="flex-1 overflow-y-auto p-6">
				<div class="max-w-2xl mx-auto space-y-6">
					
					<!-- Category -->
					<label class="label">
						<span class="font-semibold mb-2">Catégorie de producteur</span>
						<select id="categoryFilter" 
							bind:value={filters.category}
							bind:this={filterSelect}
							class="border border-gray-300 rounded px-3 py-1"
							onchange={handleFilterChange}
						>
							<option value="">Toutes</option>
							<option value="A">Alimentaire</option>
							<option value="_A">Tout sauf alimentaire</option>
							<option value="H">Habillement</option>
							<option value="3">Produits ménagers / de beauté / médicinal</option>
							<option value="4">Plantes (Fleurs, arbustes)</option>
							<option value="O">Artisans / Artistes</option>
							<option value="I">Petites et moyennes entreprises (PME)</option>
						</select>
						<div bind:this={subfilterDiv} id="subfilter"></div>
					</label>

					<!-- Recherche d'adresse -->
					<label class="label">
						<span class="font-semibold mb-2 flex items-center gap-2">
							<MapPin size={20} />
							<span>Rechercher une adresse</span>
						</span>
						<div class="input-group input-group-divider grid-cols-[1fr_auto]">
							<input class="input" 
								id="addressSearch"
								type="text" 
								bind:value={filters.address}
								bind:this={addressInput}
								onkeypress={handleKeyPress}
								placeholder="Ville, code postal, adresse..." 
							/>
							<button 
								type="button" 
								class="variant-filled-primary"
								onclick={searchAddress}>
								<Search size={20} />
							</button>
						</div>
					</label>

					<!-- Sous-filtres (pour les produits spécifiques) -->
					<label class="label">
						<span class="font-semibold mb-2">Produit</span>
							{#if filters.produces && filters.produces.size>0}
								{#each [...filters.produces] as [id, name]}
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2">
											<div class="w-2 h-2 bg-primary-400 rounded-full"></div>
											<span class="font-medium">{name}</span>
											<button onclick={() => removeProduct(id)} class="text-xs text-surface-500">
												<CircleX />
											</button>
										</div>
									</div>
								{/each}
							{:else}
								<div>Aucun produits de définis</div>
							{/if}
							<ProductSelector bind:selectedProductIds={filters.produces} usedOnly={true}/>
					</label>
					
					<!-- Filtre par tags -->
					<label class="label">
						<span class="font-semibold mb-2">Tags</span>
						<div class="space-y-2">
							{#each availableTags as tag}
								<button
									type="button"
									class="btn w-full {is_tagged(tag.mask, filters.tags) ? 'variant-filled-primary' : 'variant-ghost-surface'}"
									onclick={() => toggleTag(tag.mask)}
								>
									<span class="flex items-center gap-2">
										{#if is_tagged(tag.mask, filters.tags)}
											<div class="w-2 h-2 bg-white rounded-full"></div>
										{/if}
										<span>{tag.label}</span>
									</span>
								</button>
							{/each}
						</div>
					</label>
				</div>
			</div>

			<!-- Footer avec boutons -->
			<footer class="border-t border-surface-300-600-token p-4 flex gap-3">
				<button type="button"
						class="btn variant-ghost-surface flex-1"
						onclick={resetFilters}>
					Réinitialiser
				</button>
				<button type="button"
						class="btn variant-filled-primary flex-1"
						onclick={applyFilters}>
					Appliquer
				</button>
			</footer>
		</div>
	{/if}
	
	<!-- Drawer pour la liste des producteurs -->
	{#if $drawerStore.id === 'producers-drawer' && producersDrawerData}
		<div class="flex flex-col h-full bg-surface-50-900-token">
			<!-- Header -->
			<header class="bg-primary-500 text-white p-4 flex items-center justify-between">
				<h2 class="h3 font-bold">Producteurs de {producersDrawerData.productName}</h2>
				<button type="button"
					class="btn-icon variant-filled hover:variant-filled-error"
					onclick={closeProducersDrawer}>
					<X size={24} />
				</button>
			</header>

			<!-- Message d'info -->
			<div class="bg-warning-500/10 border-l-4 border-warning-500 p-4">
				<p class="text-sm">
					Aucun producteur trouvé dans la zone affichée.
					<br />
					<strong>Cliquez sur un producteur</strong> pour centrer la carte sur sa position.
				</p>
			</div>

			<!-- Liste des producteurs groupés par département -->
			<div class="flex-1 overflow-y-auto p-4">
				{#each Array.from(producersDrawerData.producers.keys()).sort((a, b) => a - b) as area}
					{@const producersList = producersDrawerData.producers.get(area)}
					{#if producersList}
						<div class="mb-6">
							<!-- En-tête du département -->
							<div class="flex items-center gap-2 mb-3 pb-2 border-b border-surface-300-600-token">
								<MapPin size={20} class="text-primary-500" />
								<h3 class="font-bold text-lg">
									Département {area.toString().padStart(2, '0')}
								</h3>
								<span class="badge variant-filled-surface">{producersList.length}</span>
							</div>

							<!-- Liste des producteurs -->
							<div class="space-y-2">
								{#each producersList as producer}
									<button
										type="button"
										class="w-full text-left p-3 rounded-lg bg-surface-100-800-token hover:bg-primary-500/20 transition-colors border border-surface-300-600-token"
										onclick={() => centerMapOnProducer(producer)}
									>
										<div class="flex items-center justify-between">
											<span class="font-medium">{producer.name}</span>
											<MapPin size={16} class="text-primary-500" />
										</div>
										{#if producer.x && producer.y}
											<div class="text-xs text-surface-600-300-token mt-1">
												{producer.x.toFixed(4)}, {producer.y.toFixed(4)}
											</div>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</Drawer>

<style>
	:global(.openproduct-pin) {
		background: transparent !important;
		border: none !important;
	}
	
	/* S'assurer que Leaflet prend toute la hauteur */
	:global(.leaflet-container) {
		height: 100%;
		width: 100%;
	}
</style>
