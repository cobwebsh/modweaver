/** A descriptor of a project that another project requires in order to work */
export interface VersionRequirement {
	/** The project's ID */
    id: string;
    /** The version number */
	version: string;
    /** Determines if ModWeaver knows about this project */
	is_in_api: boolean;
}
