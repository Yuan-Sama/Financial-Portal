import { db } from '$lib/server/db';
import { users, userSignUpValidator } from '$lib/server/user';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import type Joi from 'joi';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';
import * as jose from 'jose';
import { AppName } from '$lib';
import { AccessTokenName, alg, lifeTimeInSeconds, secret } from '$lib/server/auth';

export const load = (async ({ locals }) => {
	const user = await locals.getUser();
	if (user) redirect(303, '/');

	return {};
}) satisfies PageServerLoad;

const saltRounds = 12;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const signUpRequest = Object.fromEntries(await request.formData());
		const { error: err, value: userSignUp } = <
			{
				error: Joi.ValidationError | undefined;
				value: {
					email: string;
					password: string;
					confirmPassword: string;
				};
			}
		>userSignUpValidator.validate(signUpRequest);

		if (err) {
			console.error(err);
			// TODO: enhance error
			return {
				error: 'Something wrong with sign up'
			};
		}

		const existedUser = (
			await db.select().from(users).where(eq(users.username, userSignUp.email)).limit(1)
		)[0];
		if (existedUser)
			return {
				error: 'User exists'
			};

		try {
			const user = (
				await db
					.insert(users)
					.values({
						username: userSignUp.email,
						password: await bcrypt.hash(userSignUp.password, saltRounds)
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
				secure: true,
				path: '/',
				httpOnly: true,
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
