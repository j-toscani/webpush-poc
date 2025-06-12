import { type Route } from 'jsr:@std/http/unstable-route';
import { catchError } from './lib/effects.ts';
import { auth, onlyKnownUsers } from './lib/auth.ts';
import { logger } from './lib/logger.ts';
import webpush from 'web-push';

const routes: Array<Route> = [
	{
		pattern: new URLPattern({ pathname: '/api/add-subscription' }),
		method: 'POST',
		handler: async (request) => {
			const body = await request.json();
			logger.info('/add-subscription');
			logger.info(body);
			logger.info(`Subscribing ${body.endpoint}`);

			logger.info('Body: ', body);

			return new Response();
		},
	},
	{
		pattern: new URLPattern({ pathname: '/notify-me' }),
		method: 'GET',
		handler: async (request) => {
			const body = await request.json();

			logger.info('/notify-me');
			logger.info(request.body);
			logger.info(`Notifying ${body.endpoint}`);
			const subscription = {};
			sendNotifications([subscription]);
			return new Response();
		},
	},
	{
		pattern: new URLPattern({ pathname: '/notify-all' }),
		method: 'GET',
		handler: async (request) => {
			const body = await request.json();

			logger.info('/notify-me');
			logger.info(request.body);
			logger.info(`Notifying ${body.endpoint}`);
			const subscription = [{}];
			sendNotifications(subscription);
			return new Response();
		},
	},
];

const routesWithMiddleware: Array<Route> = routes.map((route) => {
	route.handler = catchError(route.handler);
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

function sendNotifications(subscriptions: any[]) {
	// TODO
	// Create the notification content.
	const notification = JSON.stringify({
		title: 'Hello, Notifications!',
		options: {
			body: `ID: ${Math.floor(Math.random() * 100)}`,
		},
	});
	// Customize how the push service should attempt to deliver the push message.
	// And provide authentication information.
	const options = {
		TTL: 10000,
		vapidDetails: {
			subject: 'John Doe <',
			publicKey: Deno.env.get('VAPID_PUBLIC_KEY'),
			privateKey: Deno.env.get('VAPID_PRIVATE_KEY'),
		},
	};
	// Send a push message to each client specified in the subscriptions array.
	subscriptions.forEach((subscription) => {
		const endpoint = subscription.endpoint;
		const id = endpoint.substr(endpoint.length - 8, endpoint.length);
		webpush.sendNotification(subscription, notification, options)
			.then((result: any) => {
				logger.info(`Result: ${result.statusCode}, ${result}`);
			})
			.catch(() => {
				logger.info(`Endpoint ID: ${id}`);
			});
	});
}
