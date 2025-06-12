import { Handler } from './types.ts';
import { ApiError, InternalServerException } from './errors.ts';
import { logger } from './logger.ts';

export function catchError(handler: Handler): Handler {
	return async (...args) => {
		const path = new URL(args[0].url).pathname;
		try {
			logger.info(`${path} <`);
			const result = await handler(...args);
			logger.info(`${path} > [${result.status}]`);
			return result;
		} catch (error: unknown) {
			if (error instanceof ApiError) {
				logError(path, error);
				return error.getResponse();
			}

			const internalError = new InternalServerException(
				error instanceof Error ? error.message : 'Unknown Error',
				error,
			);
			logError(path, internalError);

			return internalError.getResponse();
		}
	};
}

function logError(url: string, error: ApiError) {
	logger.error(
		`${url} > [${error.res.status}] ${error.res.statusText}, ${error.cause ? JSON.stringify(error.cause, null, 2) : 'no-cause'
		}`,
	);
}

type Context = {
	req: Parameters<Handler>[0];
	params: Parameters<Handler>[1];
	info: Parameters<Handler>[2];
	// deno-lint-ignore no-explicit-any
	state: Map<symbol, any>;
};
// deno-lint-ignore ban-types
export type Effect<Input = {}, Output = {}> = (input: Input, context: Context) => Promise<Output> | Output;

export function toHandler(effect: Effect): Handler {
	return catchError(async (req, params, info?) => {
		const output = await effect({}, { req, params, info, state: new Map() });
		return Response.json(output, { status: 200 });
	});
}

export function chainEffects<I, R1, R2>(...effects: [Effect<I, R1>, Effect<R1, R2>]): Effect<I, R2>;
export function chainEffects<I, R1, R2, R3>(
	...effects: [Effect<I, R1>, Effect<R1, R2>, Effect<R2, R3>]
): Effect<I, R3>;
export function chainEffects<I, R1, R2, R3, R4>(
	...effects: [Effect<I, R1>, Effect<R1, R2>, Effect<R2, R3>, Effect<R3, R4>]
): Effect<I, R4>;
export function chainEffects<I, R1, R2, R3, R4, R5>(
	...effects: [Effect<I, R1>, Effect<R1, R2>, Effect<R2, R3>, Effect<R3, R4>, Effect<R4, R5>]
): Effect<I, R5>;

export function chainEffects(...effects: Array<Effect>): Effect {
	return async (input, context) => {
		let result = input;

		for (const effect of effects) {
			result = await effect(result, context);
		}

		return result;
	};
}
