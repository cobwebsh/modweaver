/** Publicly available information about a user */
export interface Profile {
	/** This is the same UUID as the associated user */
	id: string;
	/** A display name */
	username: string;
	/** A URL pointing to the user's avatar image */
	avatar_url: string;
	/** A URL pointing to the user's website */
	website_url: string;
}
