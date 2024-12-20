import { AppName } from '$lib';
import type { User } from './db.schema';
import * as jose from 'jose';

const seconds = 10; // 1 hour
const millis = seconds * 1000;
// TODO: get from .env
const secret = new TextEncoder().encode(
	'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
);
/**
 * @see {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}
 */
const alg = 'HS256';

export class Authentication {
	#authenticate;
	#callAuthenticateFn;
	#user: User | undefined;

	constructor(authenticate: () => Promise<User | undefined> | User | undefined) {
		this.#authenticate = authenticate;
		this.#callAuthenticateFn = false;
	}

	async getUser() {
		if (!this.#callAuthenticateFn) {
			this.#user = await this.#authenticate();
			this.#callAuthenticateFn = true;
		}
		return this.#user;
	}
}

export function getTokenLifeTimeMillis() {
	return Date.now() + millis;
}

export async function createAccessToken(lifeTimeMillis: number, payload?: jose.JWTPayload) {
	return new jose.SignJWT(payload)
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setIssuer(AppName)
		.setAudience(AppName)
		.setExpirationTime(Math.floor(lifeTimeMillis / 1000))
		.sign(secret);
}

export async function verifyAccessToken(token: string) {
	try {
		return jose.jwtVerify(token, secret, {
			issuer: AppName,
			audience: AppName
		});
	} catch (err) {
		console.error('verifyAccessToken() Error:', err);
		return;
	}
}
