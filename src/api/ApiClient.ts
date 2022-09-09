import { get } from '@/api/BaseApiClient';
import type { Project } from '@/models/Project';

/**
 * Get a list of all project IDs
 */
export const getProjectIds = async (): Promise<string[]> => {
	return await get<string[]>('/projects');
};

/**
 * Get a specific project by ID
 * @param id The id of the project
 */
export const getProject = async (id: string): Promise<Project> => {
	return await get<Project>(`/project/${id}`);
};
