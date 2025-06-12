import type { Kysely } from 'kysely';
import { notNull, primaryKey } from '../queryHelper.ts';

// deno-lint-ignore no-explicit-any
export async function up(db: Kysely<any>) {
	await db.schema.createTable('test_table')
		.addColumn('id', 'serial', primaryKey)
		.addColumn('name', 'char(255)', notNull)
		.addColumn('verified', 'boolean', notNull)
		.execute();
}

// deno-lint-ignore no-explicit-any
export async function down(db: Kysely<any>) {
	await db.schema.dropTable('test_table').execute();
}
