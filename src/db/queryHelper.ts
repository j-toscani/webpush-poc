import { ColumnDefinitionBuilder } from 'kysely';

type QueryHelper = (col: ColumnDefinitionBuilder) => ColumnDefinitionBuilder;

export const notNull: QueryHelper = (col) => col.notNull();
export const primaryKey: QueryHelper = (col) => col.primaryKey();
