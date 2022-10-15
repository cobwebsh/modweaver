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

// /** The regex used to validate single semantic version numbers. https://semver.org/ */
// export const semverRegex =
// 	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
// /** The regex used to validate single semantic version numbers (as a string, not including leading and trailing slashes). https://semver.org/ */
// export const semverRegexPattern = semverRegex.toString().slice(1, -1);

// /** The regex used to validate NPM-style semantic version numbers. https://docs.npmjs.com/about-semantic-versioning */
// export const semverDependencyRegex =
// 	/^[*x]|(?:[~^]?(0|[1-9]\d*)(?:\.(?:[x*]|(0|[1-9]\d*))(?:\.(?:[x*]|(0|[1-9]\d*))(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)?)?)$/;

// /** The regex used to validate NPM-style semantic version numbers (as a string, not including leading and trailing slashes). https://docs.npmjs.com/about-semantic-versioning */
// export const semverDependencyRegexPattern = semverDependencyRegex.toString().slice(1, -1);

// /** Returns true if the input is a valid semantic version number. */
// export const isValidSemVer = (input: string): boolean => {
// 	return semverRegex.test(input);
// };
