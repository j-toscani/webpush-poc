import { z, ZodTypeAny } from 'zod';
import { ValidationException } from './errors.ts';

export function toSuccessResponse(data: unknown) {
	return Response.json({ data, error: null }, { status: 200 });
}

export function validateData<T extends ZodTypeAny>(data: unknown, schema: T) {
	const parsed = schema.safeParse(data);

	if (!parsed.success) {
		throw new ValidationException(parsed.error.errors);
	}

	return parsed.data as z.infer<T>;
}

export function parseFormData(data: FormData) {
	const arrayKeyRegex = /([a-z,A-Z]+)\[(\d+)\]([a-z,A-Z]+)/;

	// deno-lint-ignore no-explicit-any
	const body: Record<string, any> = {};
	const arrayProps = new Set<string>();

	for (const [key, value] of data.entries()) {
		if (arrayKeyRegex.test(key)) {
			const [_, prop, index, subProp] = key.match(arrayKeyRegex) ?? [];
			if (!(prop in body)) {
				body[prop] = {};
				arrayProps.add(prop);
			}

			if (subProp) {
				body[prop][index] = { ...(body[prop][index] ?? {}) };
				body[prop][index][subProp] = value;
			}
		} else {
			body[key] = value;
		}
	}

	for (const prop of arrayProps) {
		body[prop] = Object.values(body[prop]);
	}
	return body;
}
