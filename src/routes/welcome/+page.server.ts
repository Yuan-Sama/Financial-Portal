import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const user = await locals.Passport.getUser();

	return {
		user
	};
}) satisfies PageServerLoad;
