// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Authentication } from '$lib/server/auth';
import type { User } from '$lib/server/user.schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			Passport: Authentication;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
