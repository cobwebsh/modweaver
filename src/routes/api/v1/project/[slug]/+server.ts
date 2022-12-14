import { supabase } from '$lib/Supabase';
import { convertPGRSTErrorCodeToHttpStatusCode } from '@/lib/Helpers';
import type { Project } from '@/models/Project';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ params }: RequestEvent) {
	if (!params.slug) throw error(400, 'No slug given');

	const { data, error: err } = await supabase.from<Project>('projects').select().eq('slug', params.slug).single();

	if (err) throw error(convertPGRSTErrorCodeToHttpStatusCode(err.code), err.message);

	return json(data);
}
