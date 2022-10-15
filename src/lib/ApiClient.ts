import { get } from '$lib/BaseApiClient';
import type { Profile } from '@/models/Profile';
import type { Project } from '@/models/Project';
import type { ProjectDependency } from '@/models/ProjectDependency';
import type { ProjectVersion } from '@/models/ProjectVersion';
import { supabase } from './Supabase';

/**
 * Get a list of all project slugs
 */
export const getProjectSlugs = async (): Promise<string[]> => {
	return await get<string[]>('/project');
};

/**
 * Get a list of all project slugs and names in Record form
 */
export const getProjectSlugsAndNames = async (): Promise<Record<string, string>[]> => {
	const { error, data } = await supabase.from<{ slug: string; name: string }>('projects').select('slug, name');
	if (error) throw error;

	return data;
};

/**
 * Get a specific project by slug
 * @param slug The slug of the project
 */
export const getProject = async (slug: string): Promise<Project> => {
	return await get<Project>(`/project/${slug}`);
};

/**
 * Get a project's versions
 * @param slug The slug of the project
 */
export const getProjectVersions = async (slug: string): Promise<ProjectVersion[]> => {
	// return await get<ProjectVersion[]>(`/project/${slug}/versions`);

	const { data, error: err } = await supabase.from<ProjectVersion>('versions').select().eq('project_slug', slug);
	if (err) throw err;
	return data;
};

/**
 * Get a specific version by id
 * @param id The id of the version
 */
export const getVersion = async (id: string): Promise<ProjectVersion> => {
	// return await get<ProjectVersion>(`/version/${id}`);

	const { data, error: err } = await supabase.from<ProjectVersion>('versions').select().eq('id', id).single();
	if (err) throw err;
	return data;
};

/** Gets the author of a project from the project's slug */
export const getAuthorProfileByProjectSlug = async (slug: string): Promise<Profile> => {
	// TODO: Figure out how to do a join instead of calling twice
	try {
		const { author_id } = (await supabase.from<Project>('projects').select('author_id').eq('slug', slug).single())
			.data as Project;

		const { data } = await supabase.from<Profile>('profiles').select().eq('id', author_id).single();

		return data ?? {};
	} catch (err) {
		return Promise.reject(err);
	}
};

/**
 * Get a version's dependencies
 * @param slug The slug of the project
 */
export const getProjectDependencies = async (version_id: string): Promise<ProjectDependency[]> => {
	// return await get<ProjectDependency[]>(`/version/${version_id}/dependencies`);

	const { data, error: err } = await supabase
		.from<ProjectDependency>('dependencies')
		.select()
		.eq('version_id', version_id);

	if (err) throw err;
	return data;
};
