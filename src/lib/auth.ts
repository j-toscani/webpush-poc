import { betterAuth } from 'better-auth';
import { db } from '../db/db.ts';
import { z } from 'zod';
import {
	BETTER_AUTH_SECRET,
	BETTER_AUTH_URL,
	GITHUB_ALLOWED_USERS,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	IS_PROD,
} from '../constants.ts';
import { Handler } from './types.ts';
import { UnauthorizedException } from './errors.ts';
import { logger } from './logger.ts';

const authConfigSchema = z.object({
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string().url(),
	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),
	GITHUB_ALLOWED_USERS: z.string().transform((d) => d.split(',')),
});

const { error, data: configData } = authConfigSchema.safeParse({
	BETTER_AUTH_SECRET: BETTER_AUTH_SECRET,
	BETTER_AUTH_URL: BETTER_AUTH_URL,
	GITHUB_CLIENT_ID: GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: GITHUB_CLIENT_SECRET,
	GITHUB_ALLOWED_USERS: GITHUB_ALLOWED_USERS,
});

if (error) {
	logger.warn('Invalid auth configuration:', error.issues.map((issue) => issue.path.join(', ')).join(', '));
}

if (error && IS_PROD) {
	throw new Error('Invalid auth configuration');
}

export const auth = error ? null : betterAuth({
	database: { db, type: 'postgres' },
	...(IS_PROD ? {} : {
		trustedOrigins: [
			'http://localhost:5173',
		],
	}),
	advanced: {
		generateId: false,
	},
	socialProviders: {
		github: {
			clientId: configData.GITHUB_CLIENT_ID,
			clientSecret: configData.GITHUB_CLIENT_SECRET,
		},
	},
});

export function onlyKnownUsers(handler: Handler) {
	return async (...args: Parameters<Handler>) => {
		if (error) return handler(...args);

		const session = await auth?.api.getSession({ headers: args[0].headers });

		if (!session || !configData?.GITHUB_ALLOWED_USERS.includes(session?.user?.email.trim() ?? '')) {
			throw new UnauthorizedException('Not logged in');
		}

		return handler(...args);
	};
}
