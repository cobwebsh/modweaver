import { supabase } from '$lib/Supabase';
import type { Project } from '@/models/Project';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	const { data, error: err } = await supabase.from<Project>('projects').select();

	if (err) throw error(500, err.message);

	return json(data);
}
