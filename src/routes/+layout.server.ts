import { loadFlash } from 'sveltekit-flash-message/server';
import { error } from '@sveltejs/kit';

export const load = loadFlash(async (event) => {
    try {
        return { user: event.locals.user };
    } catch (err) {
        // Capturer l'erreur avec tous les détails
        const errorDetails = {
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
            name: err instanceof Error ? err.name : 'Unknown Error',
            timestamp: new Date().toISOString(),
            url: event.url.pathname,
            userAgent: event.request.headers.get('user-agent')
        };
        
        // Logger l'erreur côté serveur
        console.error('=== ERROR IN +layout.server.ts ===');
        console.error('Message:', errorDetails.message);
        console.error('Stack:', errorDetails.stack);
        console.error('Name:', errorDetails.name);
        console.error('Timestamp:', errorDetails.timestamp);
        console.error('URL:', errorDetails.url);
        console.error('User-Agent:', errorDetails.userAgent);
        console.error('Full error object:', err);
        console.error('===================================');
        
        // Relancer l'erreur avec les détails pour affichage côté client
        throw error(500, {
            message: errorDetails.message,
            stack: errorDetails.stack,
            name: errorDetails.name,
            timestamp: errorDetails.timestamp,
            url: errorDetails.url
        });
    }
});

