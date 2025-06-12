import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { PaginationOptions } from '../lib/types.ts';
import { TestRepository } from '../repositories/TestRepository.ts';

export class TestService {
	private testRepository: TestRepository;

	constructor(testRepository: TestRepository) {
		this.testRepository = testRepository;
	}

	deleteTest(id: number) {
		return Promise.all([
			this.testRepository.delete(id),
		]);
	}

	getTests(options: PaginationOptions) {
		return this.testRepository.findAll(options);
	}

	getTest(id: number) {
		return this.testRepository.findOne(id);
	}

	createTest(
		data: {
			name: string;
			verified: boolean;
		},
	) {
		return this.testRepository.create(data);
	}

	async updateTest(
		data: {
			id: number;
			name: string;
			verified: boolean;
		},
	) {
		const result = await this.testRepository.update(data.id, data);
		const state = result.map((entry) => {
			if (entry instanceof InsertResult) {
				return {
					inserted: entry.numInsertedOrUpdatedRows,
				};
			}
			if (entry instanceof UpdateResult) {
				return {
					updated: entry.numUpdatedRows,
				};
			}
			if (entry instanceof DeleteResult) {
				return {
					deleted: entry.numDeletedRows,
				};
			}
		}).reduce((acc, curr) => ({ ...acc, ...curr }), {});

		return { id: data.id, success: true, state };
	}
}
