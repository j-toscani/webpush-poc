export const IS_PROD = Deno.env.get('NODE_ENV') === 'production';
export const PORT = Number(Deno.env.get('PORT')) ?? 4000;

export const DATABASE_PASSWORD = Deno.env.get('DATABASE_PASSWORD');
export const DATABASE_USER = Deno.env.get('DATABASE_USER');
export const DATABASE_NAME = Deno.env.get('DATABASE_NAME');
export const DATABASE_HOST = Deno.env.get('DATABASE_HOST');
export const DATABASE_PORT = Number(Deno.env.get('DATABASE_PORT')) ?? 5434;
export const DATABASE_CONNECTION_POOL_SIZE = Number(Deno.env.get('DATABASE_CONNECTION_POOL_SIZE')) ?? 10;
export const BETTER_AUTH_SECRET = Deno.env.get('BETTER_AUTH_SECRET');
export const BETTER_AUTH_URL = Deno.env.get('BETTER_AUTH_URL');
export const GITHUB_CLIENT_ID = Deno.env.get('GITHUB_CLIENT_ID');
export const GITHUB_CLIENT_SECRET = Deno.env.get('GITHUB_CLIENT_SECRET');
export const GITHUB_ALLOWED_USERS = Deno.env.get('GITHUB_ALLOWED_USERS');

export const tableNames = {
	TEST: 'test_table',
} as const;
