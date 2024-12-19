import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users, type User } from './db.schema';

const saltRounds = 12;

export const signInValidator = createSelectSchema(users, {
	username: z.string({ required_error: 'Username is required' }),
	password: z.string({ required_error: 'Password is required' })
}).pick({ username: true, password: true });

export const signUpValidator = createSelectSchema(users, {
	username: z
		.string({ required_error: 'Username is required' })
		.min(1, { message: 'Username cannot be empty' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(1, { message: 'Password cannot be empty' })
})
	.pick({ username: true, password: true })
	.extend({
		confirmPassword: z.string({ required_error: 'Confirm password is required' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export async function getUserByUsername(username: string) {
	return (await db.select().from(users).where(eq(users.username, username)).limit(1)).at(0);
}

export async function checkPassword(user: User, password: string) {
	return bcrypt.compare(password, user.password);
}

export async function createUser(username: string, password: string) {
	try {
		return (
			await db
				.insert(users)
				.values({
					username: username,
					password: await bcrypt.hash(password, saltRounds)
				})
				.returning()
		).at(0);
	} catch (err) {
		console.error('createUser() Error:', err);
		return undefined;
	}
}

export async function getUserById(id: number) {
	return (await db.select().from(users).where(eq(users.id, id)).limit(1)).at(0);
}
