import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { checkPassword, getUserByUsername, signInValidator } from '$lib/server/user';
import { delay } from '$lib/server/development';
import { createAccessToken, lifeTimeMillis } from '$lib/server/auth';
import { CookiesAccessTokenName } from '$lib/server';

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();

		if (dev) {
			console.log('formData:', formData);
			// Stimulate long request
			await delay(1, 2);
		}

		const result = signInValidator.safeParse(Object.fromEntries(formData));
		if (result.error) return fail(400, { error: 'Email or password incorrect' });

		const { username, password } = result.data;

		const user = await getUserByUsername(username);
		if (!user) return fail(400, { error: 'Email or password incorrect' });

		const passwordsMatch = await checkPassword(user, password);
		if (!passwordsMatch) return fail(400, { error: 'Email or password incorrect' });

		const accessToken = await createAccessToken({ id: user.id });
		cookies.set(CookiesAccessTokenName, accessToken, {
			secure: !dev,
			path: '/',
			httpOnly: !dev,
			expires: new Date(lifeTimeMillis)
		});

		const returnTo = url.searchParams.get('next');
		if (returnTo) redirect(303, decodeURIComponent(returnTo));

		redirect(303, '/');
	}
};
