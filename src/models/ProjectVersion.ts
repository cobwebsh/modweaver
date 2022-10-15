/** A single version or revision of a project */
export interface ProjectVersion {
	id?: string;
	/** The date this version was uploaded */
	created_at?: Date;
	/** The version number */
	version: string;
	/** The slug of the project this version belongs to */
	project_slug: string;
	/** The main download link */
	download_url: string;
	/** Has this version been approved by a moderator? */
	is_approved?: boolean;
}
