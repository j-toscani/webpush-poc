import { defineConfig, PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno() as PluginOption,
    react() as PluginOption,
    tailwindcss() as PluginOption,
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      devOptions: { enabled: true },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallbackDenylist: [/^\/api\/auth.*/],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Webpush POC",
        short_name: "Webpush POC",
        description: "Webpush POC",
        theme_color: "#12b886",
        icons: [
          {
            "src": "/app_images/web-app-manifest-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable",
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
            "purpose": "any",
          },
          {
            "src": "/app_images/web-app-manifest-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable",
          },
        ],
      },
    }) as PluginOption,
  ],
  build: {
    outDir: "../dist",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4000/",
        changeOrigin: true,
      },
    },
  },
});
