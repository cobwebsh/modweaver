import { get } from '@/api/BaseApiClient';
import type { Project } from '@/models/Project';

export const getProjectIds = async (): Promise<string[]> => {
	return await get('/projects');
};

export const getProject = async (id: string): Promise<Project> => {
	return get(`/project/${id}`);
};
