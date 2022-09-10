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

export const isValidURL = (input: string): boolean => {
	try {
		new URL(input);
	} catch {
		return false;
	}

	return true;
};

/** BROWSER ONLY - Computes the SHA-256 checksum of the given ArrayBuffer  */
export const calculateSHA256 = async (input: ArrayBufferLike): Promise<string> => {
	return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', input)))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
};
