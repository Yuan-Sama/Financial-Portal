import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const user = await locals.getUser();

	return {
		user
	};
}) satisfies PageServerLoad;
