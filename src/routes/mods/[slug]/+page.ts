import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { getProject } from '@/api/ApiClient';
import type { AxiosError } from 'axios';

export const load: Load = async ({ params }) => {
	if (params.slug) {
		const project = await getProject(params.slug).catch((err: AxiosError) => {
			throw error(err.response?.status ?? 500, JSON.stringify(err.toJSON()));
		});

		return { project };
	}
};
