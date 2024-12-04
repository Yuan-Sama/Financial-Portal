import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const user = (await locals.auth.authenticate()) as
		| {
				id: number;
				username: string;
				password: string;
		  }
		| undefined;

	if (!user) redirect(307, '/');
	return {};
}) satisfies LayoutServerLoad;
