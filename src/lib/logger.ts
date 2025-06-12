import console from 'node:console';

class Logger {
	constructor() { }

	warn(...args: Parameters<typeof console.warn>) {
		console.warn(...args);
	}

	error(...args: Parameters<typeof console.error>) {
		console.error(...args);
	}

	info(...args: Parameters<typeof console.info>) {
		console.info(...args);
	}
}

export const logger = new Logger();
