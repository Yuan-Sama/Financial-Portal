// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Auth } from '$lib/server/auth';
import type { User } from '$lib/server/user';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getUser: () => Promise<User | undefined>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
