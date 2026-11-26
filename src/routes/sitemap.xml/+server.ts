import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;
	
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
	
	<!-- Page d'accueil -->
	<url>
		<loc>${baseUrl}/</loc>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
	
	<!-- Carte des producteurs -->
	<url>
		<loc>${baseUrl}/map</loc>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
	</url>
	
	<!-- À propos -->
	<url>
		<loc>${baseUrl}/about</loc>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>
	
	<!-- Inscription -->
	<url>
		<loc>${baseUrl}/auth/sign-up</loc>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>
	
	<!-- Connexion -->
	<url>
		<loc>${baseUrl}/auth/sign-in</loc>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>
	
	<!-- Dashboard producteur -->
	<url>
		<loc>${baseUrl}/dashboard</loc>
		<changefreq>weekly</changefreq>
		<priority>0.7</priority>
	</url>
	
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600, s-maxage=3600'
		}
	});
};

