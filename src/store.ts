import fs from 'node:fs/promises';
import path from 'node:path';
import z from 'zod';
import { logger } from './lib/logger.ts';

export const subscriptionSchema = z.object({
	endpoint: z.string(),
	expirationTime: z.string().or(z.null()),
	keys: z.object({
		p256dh: z.string(),
		auth: z.string(),
	}),
});

type Store = {
	subscriptions: Array<z.infer<typeof subscriptionSchema>>;
};

try {
	await fs.readFile(path.join(import.meta.dirname!, 'store.json'), 'utf-8');
} catch (_) {
	logger.warn('Store file not found, creating a new one.');
	await fs.writeFile(
		path.join(import.meta.dirname!, 'store.json'),
		JSON.stringify({ subscriptions: [] }, null, 2),
	);
}

export async function getStore() {
	const content = await fs.readFile(path.join(import.meta.dirname!, 'store.json'), 'utf-8');
	const store = JSON.parse(content) as Store;

	const storeMap: Map<string, z.infer<typeof subscriptionSchema>> = new Map();
	store.subscriptions.forEach((sub) => {
		storeMap.set(sub.endpoint, sub);
	});

	function saveStore() {
		return fs.writeFile(
			path.join(import.meta.dirname!, 'store.json'),
			JSON.stringify({ subscriptions: Array.from(storeMap.values()) }, null, 2),
		);
	}
	return {
		getSubscriber(url: string) {
			return store.subscriptions.find((sub) => sub.endpoint === url);
		},

		getAllSubscriber() {
			return store.subscriptions;
		},

		addOneSubscriber(subscriber: z.infer<typeof subscriptionSchema>) {
			storeMap.set(subscriber.endpoint, subscriber);
			return saveStore();
		},

		removeOneSubscriber(endpoint: string) {
			storeMap.delete(endpoint);
			return saveStore();
		},
	};
}
