import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import Joi from 'joi';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey(),
	username: text('username').notNull(),
	password: text('password').notNull()
});

export const userSignInValidator = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
});

// TODO: check confirm password match password
export const userSignUpValidator = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	confirmPassword: Joi.string().required()
});
