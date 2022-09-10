/** A project hosted on ModWeaver */
export interface Project {
	slug: string;
	/** The title of the project */
	name: string;
	/** The user who created the project */
	author_id?: string;
	/** A URL pointing to the source code of the project */
	repo_url?: string;
	/** A short summary of what the project is */
	summary?: string;
	/** A full description of what the project is */
	description?: string;
	/** A URL pointing to the mod's icon image */
	icon_url?: string;
}

export const defaultProject: Project = { slug: '', name: '' };
