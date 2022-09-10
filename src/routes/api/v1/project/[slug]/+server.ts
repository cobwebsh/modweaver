import { supabase } from '$lib/Supabase';
import { convertPGRSTErrorCodeToHttpStatusCode, isUUID } from '@/lib/Helpers';
import type { Project } from '@/models/Project';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ params }: RequestEvent) {
	if (!params.slug) throw error(400, 'No UUID given');
	if (!isUUID(params.slug)) throw error(400, 'Not a valid UUID');

	const { data, error: err } = await supabase.from<Project>('projects').select().eq('id', params.slug).single();

	if (err) throw error(convertPGRSTErrorCodeToHttpStatusCode(err.code), err.message);

	return json(data);
}
