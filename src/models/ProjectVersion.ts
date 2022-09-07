import type { VersionRequirement } from '@/models/VersionRequirement';

export interface ProjectVersion {
	version: string;
	url: string;
	requires: VersionRequirement[];
}
