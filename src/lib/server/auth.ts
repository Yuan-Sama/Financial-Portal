export const AccessTokenName = 'access';

// TODO: get from .env
export const secret = new TextEncoder().encode(
	'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
);

export class Auth<T> {
	#verify: () => Promise<T | undefined>;

	constructor(verify: () => Promise<T | undefined>) {
		this.#verify = verify;
	}

	async getUser() {
		return this.#verify();
	}
}
