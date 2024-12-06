import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id').notNull()
});

export const insertAccountSchema = createInsertSchema(accounts);
