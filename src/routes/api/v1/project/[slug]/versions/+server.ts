import { supabase } from '$lib/Supabase';
import { convertPGRSTErrorCodeToHttpStatusCode } from '@/lib/Helpers';
import type { ProjectVersion } from '@/models/ProjectVersion';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ params }: RequestEvent) {
	if (!params.slug) throw error(400, 'No slug given');

	const { data, error: err } = await supabase
		.from<ProjectVersion>('versions')
		.select()
		.eq('project_slug', params.slug);

	if (err) throw error(convertPGRSTErrorCodeToHttpStatusCode(err.code), err.message);

	return json(data);
}
