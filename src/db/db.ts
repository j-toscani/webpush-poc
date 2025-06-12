import { DB } from './db.d.ts';
import * as path from 'node:path';
import { promises as fs } from 'node:fs';
import Pool from 'pg-pool';
import z from 'zod';
import { FileMigrationProvider, Kysely, MigrationResultSet, Migrator, NO_MIGRATIONS, PostgresDialect } from 'kysely';
import {
	DATABASE_CONNECTION_POOL_SIZE,
	DATABASE_HOST,
	DATABASE_NAME,
	DATABASE_PASSWORD,
	DATABASE_PORT,
	DATABASE_USER,
} from '../constants.ts';
import { logger } from '../lib/logger.ts';

const dbConfigSchema = z.object({
	database: z.string(),
	host: z.string(),
	user: z.string(),
	password: z.string(),
	port: z.coerce.number().optional(),
	max: z.coerce.number().optional(),
});

const config = dbConfigSchema.parse({
	database: DATABASE_NAME,
	host: DATABASE_HOST,
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	port: DATABASE_PORT,
	max: DATABASE_CONNECTION_POOL_SIZE,
});

const dialect = new PostgresDialect({
	pool: new Pool(config),
});

export const db = new Kysely<DB>({
	dialect,
});

const migrator = new Migrator({
	db,
	provider: new FileMigrationProvider({
		fs,
		path,
		migrationFolder: path.join(import.meta.dirname!, 'migrations'),
	}),
});

export async function migrate() {
	const target = Deno.env.get('DATABASE_MIGRATION_TARGET');

	if (typeof target !== 'string') {
		logger.info('No migration defined. Skipping migrations.');
		return;
	}

	let result: MigrationResultSet | null = null;
	switch (target) {
		case 'NONE':
			break;
		case 'LATEST':
			result = await migrator.migrateToLatest();
			break;
		case 'ROLLBACK':
			result = await migrator.migrateDown();
			break;
		case 'ADVANCE':
			result = await migrator.migrateUp();
			break;
		case 'CLEAR':
			result = await migrator.migrateTo(NO_MIGRATIONS);
			break;
		default: {
			const migrationDate = new Date(target).getTime();
			if (!isNaN(migrationDate)) {
				result = await migrator.migrateTo(target);
			} else {
				logger.warn(`Target [${target}] is not a valid migration target`);
			}
			break;
		}
	}

	if (result) {
		reportMigrationResult(result);
	}
}

function reportMigrationResult(data: MigrationResultSet) {
	const { error, results } = data;

	results?.forEach((it) => {
		if (it.status === 'Success') {
			logger.info(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === 'Error') {
			logger.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		logger.error('failed to migrate');
		logger.error(error);
		throw new Error('failed to migrate');
	}
}
