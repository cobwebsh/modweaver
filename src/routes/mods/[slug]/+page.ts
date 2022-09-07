import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { getProject } from '@/api/ApiClient';
import type { AxiosError } from 'axios';

export const load: Load = async ({ params }) => {
	try {
		if (params.slug) {
			const project = await getProject(params.slug);

			return { project };
		}

		throw error(400);
	} catch (e) {
		const err = e as AxiosError;
		throw error(err.response?.status ?? 500, err.toString());
	}
};
