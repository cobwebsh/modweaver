import { supabase } from '$lib/Supabase';
import { convertPGRSTErrorCodeToHttpStatusCode } from '@/lib/Helpers';
import type { Project } from '@/models/Project';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	const { data, error: err } = await supabase.from<Project>('projects').select('slug');

	if (err) throw error(convertPGRSTErrorCodeToHttpStatusCode(err.code), err.message);

	return json(data.map((proj) => proj.slug) ?? []);
}
