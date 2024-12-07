import { type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey(),
	username: text('username').notNull(),
	password: text('password').notNull()
});

export type User = InferSelectModel<typeof users>;

export const signInSchema = createSelectSchema(users, {
	username: z.string({ required_error: 'Username is required' }),
	password: z.string({ required_error: 'Password is required' })
}).pick({ username: true, password: true });

export const signUpSchema = createSelectSchema(users, {
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
