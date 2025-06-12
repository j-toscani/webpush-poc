import { BaseRepository } from '../lib/BaseRepository.ts';
import { tableNames } from '../constants.ts';

export class TestRepository extends BaseRepository<typeof tableNames.TEST> {
	tableName = tableNames.TEST;

	constructor(db: typeof BaseRepository.prototype.db) {
		super(db);
	}
}
