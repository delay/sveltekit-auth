import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
// const tailwindcss = require('tailwindcss');

export default defineConfig({
	plugins: [
		// tailwindcss(),
		enhancedImages(), // must come before the SvelteKit plugin
		sveltekit()
	]
});
