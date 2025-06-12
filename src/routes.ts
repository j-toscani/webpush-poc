import { type Route } from 'jsr:@std/http/unstable-route';
import { catchError } from './lib/effects.ts';
import { auth, onlyKnownUsers } from './lib/auth.ts';

const routes: Array<Route> = [];

const routesWithMiddleware: Array<Route> = routes.map((route) => {
	route.handler = catchError(onlyKnownUsers(route.handler));
	return route;
});

if (auth) {
	routesWithMiddleware.push({
		pattern: new URLPattern({ pathname: '/api/auth/*' }),
		method: ['GET', 'POST'],
		handler: auth.handler,
	});
}

export { routesWithMiddleware as routes };
