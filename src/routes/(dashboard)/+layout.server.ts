import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { redirectToSignInWith } from '$lib/server';

export const load = (async ({ url, locals }) => {
	const user = await locals.Passport.getUser();

	if (!user) {
		if (url.pathname === '/') redirect(307, '/welcome');
		redirect(307, redirectToSignInWith(url, url.pathname));
	}

	return {
		user
	};
}) satisfies LayoutServerLoad;
