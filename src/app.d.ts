// src/app.d.ts
import type { AvailableLanguageTag } from "$paraglide/runtime";
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: Lucia.UserAttributes;
			startTimer: number;
			error: string;
			errorId: string;
			errorStackTrace: string;
			lang: AvailableLanguageTag;
			defaultLang: AvailableLanguageTag;
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
		interface MailConfig {
			recipient: string;
			subject: string;
			htmlMessage: string;
		}
	}
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			userId: string;
			email: string;
			firstName: string;
			lastName: string;
			role: string;
			verified: boolean;
			receiveEmail: boolean;
			token: string;
		};
	}
}

declare module 'prisma';

// THIS IS IMPORTANT!!!
export {};
