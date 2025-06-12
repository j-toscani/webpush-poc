import { PORT } from './src/constants.ts';
import { migrate } from './src/db/db.ts';
import { routes } from './src/routes.ts';
import { serveClientController } from './src/controllers/serveClientController.ts';


await migrate();
export default Deno.serve(
	{ port: PORT },
	(request, info) => {
		const url = new URL(request.url)

		for (const route of routes) {
			const methods = Array.isArray(route.method) ? route.method : [route.method ?? "GET"]

			if (!methods.includes(request.method) || !route.pattern.test(url)) continue

			const params = route.pattern.exec(url)!
			return route.handler(request, params, info)
		}
		return serveClientController(request)
	}
);
