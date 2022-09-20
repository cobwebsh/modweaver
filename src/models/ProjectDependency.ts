/** A descriptor of a project that another project requires in order to work */
export interface ProjectDependency {
	id?: string;
	/** The version id that depends on another project */
	version_id: string;
	/** The slug of the project this version depends on */
	dependency_slug: string;
	/** The valid semver range defining which versions of the depended project are compatible */
	version_range: string;
}

export const defaultProjectDependency: ProjectDependency = { version_id: '', dependency_slug: '', version_range: '*' };
