import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const user = (await locals.auth.getUser()) as
		| {
				id: number;
				username: string;
				password: string;
		  }
		| undefined;

	if (!user) redirect(307, `/welcome`);

	return {
		user
	};
}) satisfies LayoutServerLoad;
