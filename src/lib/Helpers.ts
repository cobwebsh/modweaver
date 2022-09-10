/** Returns true if the string is a UUID */
export const isUUID = (s: string): boolean => {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g.test(s.toLowerCase());
};

// TODO: Add more PGRST error codes
export const convertPGRSTErrorCodeToHttpStatusCode = (pgrstErrorCode: string): number => {
	switch (pgrstErrorCode) {
		case 'PGRST116':
			return 404;
		default:
			return 500;
	}
};

/** Removes non-alphanumeric characters, converts to lower case, and converts spaces to dashes */
export const toSlug = (input: string): string => {
	return input
		.split(' ')
		.map((word) => word.toLocaleLowerCase().replace(/[^a-z0-9]/gi, ''))
		.join('-');
};
