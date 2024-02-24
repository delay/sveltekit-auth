declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			startTimer: number;
			error: string;
			errorId: string;
			errorStackTrace: string;
			message: unknown;
			track: unknown;
		}
		interface Error {
			code?: string;
			errorId?: string;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
	}
}

export {};
