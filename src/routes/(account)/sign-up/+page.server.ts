import { db } from '$lib/server/db';
import { signUpSchema, users } from '$lib/server/user.schema';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import * as jose from 'jose';
import { AppName } from '$lib';
import { AccessTokenName, alg, lifeTimeInSeconds, secret } from '$lib/server/auth';
import { dev } from '$app/environment';
import { getUserByUsername } from '$lib/server/user';

export const load = (async ({ locals }) => {
	const user = await locals.getUser();
	if (user) redirect(303, '/');

	return {};
}) satisfies PageServerLoad;

const saltRounds = 12;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

		const result = signUpSchema.safeParse(rawData);

		if (result.error) {
			console.error(result.error);
			return fail(400, { error: 'Something wrong with sign up' });
		}

		const existedUser = await getUserByUsername(result.data.username);
		if (existedUser)
			return fail(400, {
				error: 'User exists'
			});

		try {
			const user = (
				await db
					.insert(users)
					.values({
						username: result.data.username,
						password: await bcrypt.hash(result.data.password, saltRounds)
					})
					.returning()
			)[0];

			const accessToken = await new jose.SignJWT({ id: user.id })
				.setProtectedHeader({ alg })
				.setIssuedAt()
				.setIssuer(AppName)
				.setAudience(AppName)
				.setExpirationTime(Math.floor(lifeTimeInSeconds / 1000))
				.sign(secret);

			cookies.set(AccessTokenName, accessToken, {
				secure: !dev,
				path: '/',
				httpOnly: !dev,
				expires: new Date(lifeTimeInSeconds)
			});
		} catch (err) {
			console.error(err);
			return {
				error: 'Unknown error happens during sign up'
			};
		}

		const returnTo = url.searchParams.get('returnTo');
		if (returnTo) redirect(303, decodeURIComponent(returnTo));

		redirect(303, '/');
	}
};
