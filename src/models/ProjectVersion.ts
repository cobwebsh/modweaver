import type { VersionRequirement } from '@/models/VersionRequirement';

/** A single version or revision of a project */
export interface ProjectVersion {
	id: string;
    /** The slug of the project this version belongs to */
    project_slug: string;
	/** The version number */
	version: string;
	/** The main download link */
	url: string;
	/** A list of other mods that this version requires in order to work */
	requires: VersionRequirement[];
}
