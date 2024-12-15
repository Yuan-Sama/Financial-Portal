import type { User } from './user.schema';

export const AccessTokenName = 'access';

// TODO: get from .env
export const secret = new TextEncoder().encode(
	'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
);

/**
 * @see {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}
 */
export const alg = 'HS256';

export class Authentication {
	#authenticate;
	#callAuthenticateFn;
	#user: User | null = null;

	constructor(authenticate: () => Promise<User | null> | User | null) {
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
