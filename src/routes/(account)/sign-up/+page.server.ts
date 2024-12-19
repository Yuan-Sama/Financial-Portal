import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { createUser, getUserByUsername, signUpValidator } from '$lib/server/user';
import { delay } from '$lib/server/development';
import { createAccessToken, lifeTimeMillis } from '$lib/server/auth';
import { CookiesAccessTokenName } from '$lib/server';

type ValidationErrors = { username?: string; password?: string; confirmPassword?: string };

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();

		if (dev) {
			console.log('formData:', formData);
			// Stimulate long request
			await delay(1, 2);
		}

		const result = signUpValidator.safeParse(Object.fromEntries(formData));
		if (result.error) {
			const validationErrors: ValidationErrors = result.error.errors.reduce(
				(obj, e) => Object.assign(obj, { [e.path[0]]: e.message }),
				{}
			);

			return fail(400, { validationErrors });
		}

		const { username, password } = result.data;

		const existedUser = await getUserByUsername(username);
		if (existedUser) {
			const validationErrors: ValidationErrors = {
				username: 'User exists'
			};

			return fail(400, { validationErrors });
		}

		const user = await createUser(username, password);

		if (!user)
			return fail(400, {
				error: 'Cannot create user'
			});

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
