import { type Route } from 'jsr:@std/http/unstable-route';
import { logger } from './lib/logger.ts';
import webpush from 'web-push';
import { z } from 'zod';
import { getStore, subscriptionSchema } from './store.ts';

const endpointSchema = z.object({
	endpoint: z.string(),
});

const routes: Array<Route> = [
	{
		pattern: new URLPattern({ pathname: '/api/add-subscription' }),
		method: 'POST',
		handler: async (request) => {
			const body = await request.json();
			const data = subscriptionSchema.parse(body);
			logger.info('/add-subscription');
			logger.info(data);
			logger.info(`Subscribing ${data.endpoint}`);

			const store = await getStore();
			await store.addOneSubscriber(data);

			return new Response();
		},
	},
	{
		pattern: new URLPattern({ pathname: '/api/remove-subscription' }),
		method: 'POST',
		handler: async (request) => {
			const body = await request.json();
			const data = endpointSchema.parse(body);
			logger.info('/remove-subscription');
			logger.info(data);
			logger.info(`Subscribing ${data.endpoint}`);

			const store = await getStore();
			await store.removeOneSubscriber(data.endpoint);

			return new Response();
		},
	},
	{
		pattern: new URLPattern({ pathname: '/notify-me' }),
		method: 'GET',
		handler: async (request) => {
			const body = await request.json();
			const data = subscriptionSchema.parse(body);
			const store = await getStore();
			const subscription = store.getSubscriber(data.endpoint);

			if (!subscription) {
				logger.error(`No subscription found for endpoint: ${data.endpoint}`);
				return new Response('Subscription not found', { status: 404 });
			}

			const saveSub = subscriptionSchema.parse(subscription);
			sendNotifications([saveSub]);
			return new Response();
		},
	},
	{
		pattern: new URLPattern({ pathname: '/api/notify-all' }),
		method: 'GET',
		handler: async () => {
			const store = await getStore();
			const subscription = store.getAllSubscriber();
			sendNotifications(subscription.map((s) => subscriptionSchema.parse(s)));
			return new Response();
		},
	},
];

export { routes };

function sendNotifications(subscriptions: z.infer<typeof subscriptionSchema>[]) {
	const notification = JSON.stringify({
		title: 'Hello, Notifications!',
		options: {
			body: `ID: ${Math.floor(Math.random() * 100)}`,
		},
	});

	const options = {
		TTL: 10000,
		vapidDetails: {
			subject: 'mailto:julian_toscani@gmx.de',
			publicKey: Deno.env.get('VAPID_PUBLIC_KEY'),
			privateKey: Deno.env.get('VAPID_PRIVATE_KEY'),
		},
	};
	// Send a push message to each client specified in the subscriptions array.
	subscriptions.forEach((subscription) => {
		const endpoint = subscription.endpoint;
		const id = endpoint.slice(endpoint.length - 8, endpoint.length);
		webpush.sendNotification(subscription, notification, options)
			.then((result: { statusCode: number }) => {
				logger.info(`Result: ${result?.statusCode}`);
			})
			.catch((e: unknown) => {
				logger.error(`Error sending notification to ${id}:`, e);
				logger.info(`Endpoint ID: ${id}`);
			});
	});
}
