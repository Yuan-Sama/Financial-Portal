import { relations, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id').notNull()
});

export type Account = InferSelectModel<typeof accounts>;

export const accountsRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions)
}));

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id').notNull()
});

export type Category = InferSelectModel<typeof categories>;

export const categoriesRelations = relations(categories, ({ many }) => ({
	transactions: many(transactions)
}));

export const users = sqliteTable('users', {
	id: integer('id').primaryKey(),
	username: text('username').notNull(),
	password: text('password').notNull()
});

export type User = InferSelectModel<typeof users>;

export const transactions = sqliteTable('transactions', {
	id: integer('id').primaryKey(),
	amount: integer('amount').notNull(),
	payee: integer('payee').notNull(),
	notes: text('notes'),
	date: text('date').notNull(),
	accountId: integer('account_id')
		.references(() => accounts.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	categoryId: integer('category_id').references(() => categories.id, {
		onDelete: 'set null'
	})
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
	accounts: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id]
	}),
	categories: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id]
	})
}));
