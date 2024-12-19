import type { InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id').notNull()
});

export type Account = InferSelectModel<typeof accounts>;

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id').notNull()
});

export type Category = InferSelectModel<typeof categories>;

export const users = sqliteTable('users', {
	id: integer('id').primaryKey(),
	username: text('username').notNull(),
	password: text('password').notNull()
});

export type User = InferSelectModel<typeof users>;
