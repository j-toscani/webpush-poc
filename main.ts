import { routes } from './src/routes.ts';
import { serveDir, serveFile } from 'jsr:@std/http/file-server';


export default Deno.serve(
	{ port: 4000 },
	(request, info) => {
		const url = new URL(request.url)

		for (const route of routes) {
			const methods = Array.isArray(route.method) ? route.method : [route.method ?? "GET"]

			if (!methods.includes(request.method) || !route.pattern.test(url)) continue

			const params = route.pattern.exec(url)!
			return route.handler(request, params, info)
		}
		const path = new URL(request.url).pathname

		if (path.includes('images/')) {
			return serveDir(request, {
				fsRoot: 'images',
				urlRoot: 'images',
			})
		}

		if (path.includes('.')) {
			return serveDir(request, {
				fsRoot: 'dist',
				urlRoot: '',
			})
		}

		return serveFile(request, './dist/index.html')
	}
);
