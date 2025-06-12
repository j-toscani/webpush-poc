import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import deno from '@deno/vite-plugin';
import react from '@vitejs/plugin-react-swc';


// https://vite.dev/config/
export default defineConfig({
	plugins: [deno(), react(), tailwindcss(),
	VitePWA({
		registerType: 'autoUpdate',
		devOptions: { enabled: true },
		workbox: {
			globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
			navigateFallbackDenylist: [/^\/api\/auth.*/]
		},
		includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
		manifest: {
			name: 'Mein Kochbuch',
			short_name: 'Kochbuch',
			description: 'Meine Kochbuch-App in der ich Rezepte sammel und Technologien austeste',
			theme_color: '#12b886',
			icons: [
				{
					"src": "/app_images/web-app-manifest-192x192.png",
					"sizes": "192x192",
					"type": "image/png",
					"purpose": "maskable"
				},
				{
					"src": "/app_images/web-app-manifest-512x512.png",
					"sizes": "512x512",
					"type": "image/png",
				},
				{
					"src": "/app_images/web-app-manifest-512x512.png",
					"sizes": "512x512",
					"type": "image/png",
					"purpose": "any"
				},
				{
					"src": "/app_images/web-app-manifest-512x512.png",
					"sizes": "512x512",
					"type": "image/png",
					"purpose": "maskable"
				}
			]
		}
	}),
	],
	build: {
		outDir: '../dist',
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:4000/',
				changeOrigin: true,
			},
		},
	},
});
