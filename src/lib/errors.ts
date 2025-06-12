import { ZodIssue } from 'zod';
import { Handler } from './types.ts';
import { logger } from './logger.ts';

export const HTTP_CODES = {
	FOUND: 302,

	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,

	INTERNAL_SERVER_ERROR: 500,
	// BAD_GATEWAY: 502,
	// SERVICE_UNAVAILABLE: 503,
};

export abstract class ApiError extends Error {
	res: Response;
	constructor(code: typeof HTTP_CODES[keyof typeof HTTP_CODES], message: string, cause?: unknown) {
		super(message, { cause });
		this.res = Response.json({ error: cause ? cause : message, data: null }, {
			status: code,
			statusText: message,
		});
	}

	getResponse() {
		return this.res;
	}
}

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
		`${url} > [${error.res.status}] ${error.res.statusText}, ${
			error.cause ? JSON.stringify(error.cause, null, 2) : 'no-cause'
		}`,
	);
}

export class BadRequestException extends ApiError {
	constructor(message: string, cause?: unknown) {
		super(HTTP_CODES.BAD_REQUEST, message, cause);
	}
}

export class ValidationException extends BadRequestException {
	constructor(errors?: Array<ZodIssue>) {
		super('IvalidInput', errors);
	}
}

export class UnauthorizedException extends ApiError {
	constructor(message: string, cause?: unknown) {
		super(HTTP_CODES.UNAUTHORIZED, message, cause);
	}
}

export class ForbiddenException extends ApiError {
	constructor(message: string, cause?: unknown) {
		super(HTTP_CODES.FORBIDDEN, message, cause);
	}
}

export class NotFoundException extends ApiError {
	constructor(message: string, cause?: unknown) {
		super(HTTP_CODES.NOT_FOUND, message, cause);
	}
}

export class InternalServerException extends ApiError {
	constructor(message: string, cause?: unknown) {
		super(HTTP_CODES.INTERNAL_SERVER_ERROR, message, cause);
	}
}
