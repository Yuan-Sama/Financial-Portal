import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './user.schema';

export async function getUserByUsername(username: string) {
	return (await db.select().from(users).where(eq(users.username, username)).limit(1)).at(0);
}
