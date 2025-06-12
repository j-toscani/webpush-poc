import { z } from 'zod';

export const paginationOptionsSchema = z.object({
	query: z.string(),
	page: z.coerce.number().default(1),
	perPage: z.coerce.number().default(20),
});
