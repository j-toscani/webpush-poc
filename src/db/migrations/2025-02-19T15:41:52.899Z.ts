import type { Kysely } from 'kysely';
import { notNull, primaryKey } from '../queryHelper.ts';

// deno-lint-ignore no-explicit-any
export async function up(db: Kysely<any>) {
	await db.schema.createTable('subscriptions')
		.addColumn('id', 'serial', primaryKey)
		.addColumn('enpoint', 'varchar', notNull)
		.addColumn('expirationTime', 'varchar')
		.addColumn('keys', 'json', notNull)
		.execute();
}

// deno-lint-ignore no-explicit-any
export async function down(db: Kysely<any>) {
	await db.schema.dropTable('subscriptions').execute();
}
