import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const user = await locals.auth.getUser();
	return {
		user
	};
}) satisfies PageServerLoad;
