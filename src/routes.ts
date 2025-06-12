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

			const store = await getStore();
			await store.addOneSubscriber(data);

			return new Response('Success');
		},
	},
	{
		pattern: new URLPattern({ pathname: '/api/hi' }),
		method: 'GET',
		handler: () => {
			logger.info('Received a request to /api/hi');
			return new Response('Hello, world!');
		},
	},
	{
		pattern: new URLPattern({ pathname: '/api/remove-subscription' }),
		method: 'POST',
		handler: async (request) => {
			const body = await request.json();
			const data = endpointSchema.parse(body);

			const store = await getStore();
			await store.removeOneSubscriber(data.endpoint);

			return new Response('Success');
		},
	},
	{
		pattern: new URLPattern({ pathname: '/api/notify-me' }),
		method: 'POST',
		handler: async (request) => {
			const body = await request.json();
			const data = endpointSchema.parse(body);
			const store = await getStore();
			const subscription = store.getSubscriber(data.endpoint);

			if (!subscription) {
				logger.error(`No subscription found for endpoint: ${data.endpoint}`);
				return new Response('Subscription not found', { status: 404 });
			}

			sendNotifications([subscription], { message: 'Moin oder wat.', type: 'info' });
			return new Response('Sucess');
		},
	},
	{
		pattern: new URLPattern({ pathname: '/api/notify-all' }),
		method: 'GET',
		handler: async () => {
			const store = await getStore();
			const subscription = store.getAllSubscriber();
			sendNotifications(subscription.map((s) => subscriptionSchema.parse(s)), { message: 'PANIK!!!', type: 'warning' });
			return new Response('Success');
		},
	},
];

export { routes };

function sendNotifications(
	subscriptions: z.infer<typeof subscriptionSchema>[],
	payload: { message: string; type: 'info' | 'warning' },
) {
	const notification = JSON.stringify(payload);

	const options = {
		TTL: 10000,
		vapidDetails: {
			subject: Deno.env.get('VAPID_SUBJECT') || 'mailto:',
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
