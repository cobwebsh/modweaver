<script lang="ts">
	import { goto } from '$app/navigation';
	import { authGuard } from '@/guards';
	import { toSlug } from '@/lib/Helpers';
	import { supabase } from '@/lib/Supabase';
	import type { Project } from '@/models/Project';
	import { user } from '@/stores/session';
	import { get } from 'svelte/store';

	authGuard();

	let isLoading = false;
	let newProject: Project = { slug: '', name: '', author_id: get(user).id };

	async function createProject() {
		isLoading = true;

		if (!newProject.name) {
			throw new Error('Name cannot be blank.');
		}

		newProject.slug = toSlug(newProject.name);

		// TODO: Check if slug already exists

		const { data, error } = await supabase.from<Project>('projects').insert(newProject).single();

		if (error) throw error;

		if (data) await goto(`/mods/${data.slug}`);

		isLoading = false;
	}
</script>

<svelte:head>
	<title>Create Project</title>
</svelte:head>

<h2>Create a Project</h2>

<form on:submit|preventDefault={createProject}>
	<label for="name">Project Name:</label>
	<input
		id="name"
		type="text"
		bind:value={newProject.name}
		placeholder="e.g. My Amazing Project"
		disabled={isLoading}
	/>

	<label for="iconUrl">Icon URL:</label>
	<input
		id="iconUrl"
		type="text"
		bind:value={newProject.icon_url}
		placeholder="e.g. https://i.imgur.com/12345.png"
		disabled={isLoading}
	/>
	{#if newProject.icon_url}
		<img alt="Project icon" src={newProject.icon_url} />
	{/if}

	<label for="repoUrl">Repository:</label>
	<input
		id="repoUrl"
		type="text"
		bind:value={newProject.repo_url}
		placeholder="e.g. https://github.com/you/my-amazing-project"
		disabled={isLoading}
	/>

	<label for="summary">Summary:</label>
	<input
		id="summary"
		type="text"
		bind:value={newProject.summary}
		placeholder="A short description of your project."
		disabled={isLoading}
	/>

	<label for="description">Description:</label>
	<textarea
		id="description"
		bind:value={newProject.description}
		placeholder="The full description of your project. Be as detailed as you want!"
		disabled={isLoading}
	/>

	<button type="submit" disabled={isLoading}>Create</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;

		width: 24rem;
	}

	form > label {
		margin-top: 0.5rem;
		margin-bottom: 0.25rem;
	}
</style>
