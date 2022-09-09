import type { ProjectType } from '@/models/ProjectType';
import type { ProjectVersion } from '@/models/ProjectVersion';

/** A project hosted on ModWeaver */
export interface Project {
    /** The title of the project */
	name: string;
    /** The user who created the project */
	author: string;
    /** A URL pointing to the source code of the project */
	source: string;
    /** The type of project */
	type: ProjectType;
    /** A list of the project's available versions */
	versions: ProjectVersion[];
    /** The version number of the latest version */
	latest_version: string;
    /** A short summary of what the project is */
	summary: string;
    /** A full description of what the project is */
	description: string;
    /** A URL pointing to the mod's icon image */
	icon_url: string;
}
