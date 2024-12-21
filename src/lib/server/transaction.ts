import { createInsertSchema } from 'drizzle-zod';
import { transactions } from './db.schema';
import { z } from 'zod';

export const insertTransactionValidator = createInsertSchema(transactions, {
	date: z.coerce.date()
});
