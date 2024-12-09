import { db } from '$lib/server/db';
import { signUpSchema, users } from '$lib/server/user.schema';
import type { Actions } from './$types';
import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import * as jose from 'jose';
import { AppName } from '$lib';
import { AccessTokenName, alg, lifeTimeInSeconds, secret } from '$lib/server/auth';
import { dev } from '$app/environment';
import { getUserByUsername } from '$lib/server/user';

const saltRounds = 12;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000)); // Stimulate long request

		const result = signUpSchema.safeParse(rawData);
		if (result.error) {
			const validationErrors = result.error.errors.reduce(
				(obj, e) => Object.assign(obj, { [e.path[0]]: e.message }),
				{}
			);
			return fail(400, { validationErrors });
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

			cookies.delete(AccessTokenName, {
				path: '/'
			});

			cookies.set(AccessTokenName, accessToken, {
				secure: !dev,
				path: '/',
				httpOnly: !dev,
				expires: new Date(lifeTimeInSeconds)
			});
		} catch (err) {
			console.error(err);
			return fail(400, {
				error: 'Unknown error happens during sign up'
			});
		}

		const returnTo = url.searchParams.get('returnTo');
		if (returnTo) redirect(303, decodeURIComponent(returnTo));

		redirect(303, '/');
	}
};
