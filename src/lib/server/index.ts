import { z } from 'zod';

export const CookiesAccessTokenName = 'access';

export class Paginator {
	#currentPage: number = 1;
	#prevPage: number | null = null;
	#totalPages: number = 1;
	#totalRecords: number = 0;
	#nextPage: number | null = null;

	constructor(page: number, pageSize: number, totalRecords: number) {
		this.#currentPage = page;

		this.#prevPage = this.#currentPage - 1 < 1 ? null : this.#currentPage - 1;

		this.#totalRecords = totalRecords;

		this.#totalPages = !pageSize ? 0 : Math.ceil(this.#totalRecords / pageSize);

		this.#nextPage = this.#currentPage >= this.#totalPages ? null : this.#currentPage + 1;
	}

	get currentPage() {
		return this.#currentPage;
	}

	get prevPage() {
		return this.#prevPage;
	}

	get totalRecords() {
		return this.#totalRecords;
	}

	get totalPages() {
		return this.#totalPages;
	}

	get nextPage() {
		return this.#nextPage;
	}

	toObject() {
		return {
			prevPage: this.#prevPage,
			currentPage: this.#currentPage,
			nextPage: this.#nextPage,
			totalPages: this.#totalPages,
			totalRecords: this.#totalRecords
		};
	}
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;

export const searchParamsValidator = z.object({
	p: z.coerce
		.number()
		.default(DEFAULT_PAGE)
		.transform((val) => {
			return val < DEFAULT_PAGE ? DEFAULT_PAGE : val;
		}),
	pz: z.coerce
		.number()
		.default(DEFAULT_PAGE_SIZE)
		.transform((val) => {
			if (val < DEFAULT_PAGE_SIZE) return DEFAULT_PAGE_SIZE;

			if (val > 100) return 100;

			return val;
		}),
	s: z.coerce.string().trim().default(''),
	o: z.string().toLowerCase().default('')
});

function _delay(minSeconds: number, maxSeconds: number) {
	let min = Math.ceil(minSeconds * 1000);
	let max = Math.floor(maxSeconds * 1000);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function delay(minSeconds: number, maxSeconds: number): Promise<void> {
	return new Promise((fullfill) => setTimeout(fullfill, _delay(minSeconds, maxSeconds)));
}

function isUrl(urlString: string) {
	try {
		new URL(urlString);
		return true;
	} catch (error) {
		return false;
	}
}

const redirectName = 'next';

export function redirectToSignInWith(url: URL, pathname: string) {
	const path = url.origin + pathname;
	if (!isUrl(path)) return '/sign-in';
	return `/sign-in?${redirectName}=${encodeURIComponent(path)}`;
}

export function decodeStringRedirectTo(url: URL) {
	const urlString = url.searchParams.get(redirectName);
	if (!urlString || !isUrl(urlString)) return undefined;
	return decodeURIComponent(urlString);
}
