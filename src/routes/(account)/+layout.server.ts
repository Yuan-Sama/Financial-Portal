import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const user = await locals.Passport.getUser();
	console.log(user);

	if (user) redirect(303, '/');
	return {};
}) satisfies LayoutServerLoad;
