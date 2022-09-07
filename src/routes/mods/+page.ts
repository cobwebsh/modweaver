import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { getProjectIds } from '@/api/ApiClient';
import type { AxiosError } from 'axios';

export const load: Load = async () => {
	try {
		const project_ids = await getProjectIds();

		return { project_ids };
	} catch (e) {
		const err = e as AxiosError;
		throw error(err.response?.status ?? 500, err.toString());
	}
};
