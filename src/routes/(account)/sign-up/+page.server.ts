import { db } from '$lib/server/db';
import { users, userSignUpValidator } from '$lib/server/user';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import type Joi from 'joi';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

const saltRounds = 12;

export const actions: Actions = {
	default: async ({ request }) => {
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
			await db.insert(users).values({
				username: userSignUp.email,
				password: await bcrypt.hash(userSignUp.password, saltRounds)
			});
		} catch (err) {
			console.error(err);
			return {
				error: 'Unknown error happens during sign up'
			};
		}

		// TODO: add jwt here

		redirect(303, '/dashboard');
	}
};
