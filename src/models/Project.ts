import type { ProjectType } from '@/models/ProjectType';
import type { ProjectVersion } from '@/models/ProjectVersion';

export interface Project {
	name: string;
	author: string;
	source: string;
	type: ProjectType;
	versions: ProjectVersion[];
	latest_version: string;
	summary: string;
	description: string;
	icon_url: string;
}
