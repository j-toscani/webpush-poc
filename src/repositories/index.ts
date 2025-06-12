import { db } from '../db/db.ts';
import { TestRepository } from '../repositories/TestRepository.ts';

export const testRepository = new TestRepository(db);
