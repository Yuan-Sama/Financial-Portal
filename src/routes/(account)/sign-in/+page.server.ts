import { db } from '$lib/server/db';
import { userSignInValidator, users } from '$lib/server/user';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';
import type Joi from 'joi';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const signInRequest = Object.fromEntries(await request.formData());
		const { error: err, value: userSignIn } = <
			{ error: Joi.ValidationError | undefined; value: { email: string; password: string } }
		>userSignInValidator.validate(signInRequest);

		if (err) return { error: 'Email or password incorrect' };

		const user = (
			await db.select().from(users).where(eq(users.username, userSignIn.email)).limit(1)
		)[0];
		if (!user) return { error: 'Email or password incorrect' };

		const passwordsMatch = await bcrypt.compare(userSignIn.password, user.password);
		if (!passwordsMatch) return { error: 'Email or password incorrect' };

		redirect(303, '/dashboard');
	}
};
