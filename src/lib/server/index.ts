import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '$lib/index.svelte';
import { z } from 'zod';

export class Paginator {
	#currentPage: number = 1;
	#prevPage: number | null = null;
	#pageSize: number = 5;
	#totalPages: number = 1;
	#totalRecords: number = 0;
	#nextPage: number | null = null;

	constructor(page: number, pageSize: number, totalRecords: number) {
		this.#currentPage = page;

		this.#prevPage = this.#currentPage - 1 < 1 ? null : this.#currentPage - 1;

		this.#totalRecords = totalRecords;

		this.#pageSize = pageSize;

		this.#totalPages = !this.#pageSize ? 0 : Math.ceil(this.#totalRecords / this.#pageSize);

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

	get pageSize() {
		return this.#pageSize;
	}

	toObject() {
		return {
			prevPage: this.#prevPage,
			currentPage: this.#currentPage,
			nextPage: this.#nextPage,
			totalPages: this.#totalPages,
			pageSize: this.#pageSize,
			totalRecords: this.#totalRecords
		};
	}
}

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
	s: z.coerce.string().trim().default('')
});
