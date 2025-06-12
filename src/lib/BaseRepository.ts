import { Insertable, Updateable } from 'kysely';
import { DB } from '../db/db.d.ts';
import { db as database } from '../db/db.ts';
import { PaginationOptions } from './types.ts';

export abstract class BaseRepository<T extends keyof DB, Data = DB[T]> {
	db: typeof database;
	abstract tableName: keyof DB;

	constructor(db: typeof database) {
		this.db = db;
	}

	private _create(data: Array<Insertable<Data>> | Insertable<Data>) {
		return this.db.insertInto(this.tableName).values(data).returning('id').execute();
	}

	create(data: Insertable<Data>) {
		return this._create(data);
	}

	createMany(data: Array<Insertable<Data>>) {
		return this._create(data);
	}

	delete(id: number) {
		return this.db.deleteFrom(this.tableName).where('id', '=', id).returning('id').execute();
	}

	update(id: number, data: Updateable<Data>) {
		return this.db.updateTable(this.tableName).where('id', '=', id).set(data).returning('id').execute();
	}

	findOne(id: number) {
		return this.db.selectFrom(this.tableName).where('id', '=', id).selectAll().executeTakeFirst();
	}

	findAll(options: PaginationOptions) {
		const { page, perPage } = options;
		return this.db.selectFrom(this.tableName).selectAll().limit(perPage).offset((page - 1) * perPage)
			.execute();
	}
}
