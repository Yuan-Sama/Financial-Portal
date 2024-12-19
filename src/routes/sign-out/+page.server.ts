import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { CookiesAccessTokenName } from '$lib/server';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		const user = await locals.Passport.getUser();
		if (user)
			cookies.delete(CookiesAccessTokenName, {
				path: '/'
			});

		redirect(303, '/');
	}
};
