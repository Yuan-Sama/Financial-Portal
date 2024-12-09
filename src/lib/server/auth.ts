export const AccessTokenName = 'access';

// TODO: get from .env
export const secret = new TextEncoder().encode(
	'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
);

/**
 * @see {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}
 */
export const alg = 'HS256';

const tempDate = new Date();
/**
 * the seconds value in the Date object using local time.
 */
export const lifeTimeInSeconds = tempDate.setSeconds(tempDate.getSeconds() + 3600);
