import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id').notNull()
});

export const insertAccountSchema = createInsertSchema(accounts, {
	name: z
		.string({ required_error: 'Name is required' })
		.trim()
		.min(1, { message: 'Name can not be empty' })
});
