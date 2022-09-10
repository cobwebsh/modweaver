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
