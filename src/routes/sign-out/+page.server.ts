import { AccessTokenName } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		const user = await locals.Passport.getUser();
		if (user)
			cookies.delete(AccessTokenName, {
				path: '/'
			});

		redirect(303, '/');
	}
};
