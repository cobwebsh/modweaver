<script lang="ts">
	import { goto } from '$app/navigation';

	import { authGuard } from '@/guards';
	import { toSlug } from '@/lib/Helpers';
	import { supabase } from '@/lib/Supabase';

	import type { Project } from '@/models/Project';
	import { user } from '@/stores/session';
	import { Button, Heading, Input, Label, Textarea } from 'flowbite-svelte';
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

<Heading>Create a Project</Heading>

<form on:submit|preventDefault={createProject}>
	<Label for="name" class="mt-2 mb-1">Project Name:</Label>
	<Input
		id="name"
		type="text"
		bind:value={newProject.name}
		placeholder="e.g. My Amazing Project"
		disabled={isLoading}
		required
	/>

	<Label for="iconUrl" class="mt-2 mb-1">Icon URL:</Label>
	<Input
		id="iconUrl"
		type="text"
		bind:value={newProject.icon_url}
		placeholder="e.g. https://i.imgur.com/12345.png"
		disabled={isLoading}
	/>
	{#if newProject.icon_url}
		<img alt="Project icon" src={newProject.icon_url} />
	{/if}

	<Label for="repoUrl" class="mt-2 mb-1">Repository:</Label>
	<Input
		id="repoUrl"
		type="text"
		bind:value={newProject.repo_url}
		placeholder="e.g. https://github.com/you/my-amazing-project"
		disabled={isLoading}
	/>

	<Label for="summary" class="mt-2 mb-1">Summary:</Label>
	<Input
		id="summary"
		type="text"
		bind:value={newProject.summary}
		placeholder="A short description of your project."
		disabled={isLoading}
	/>

	<Label for="description" class="mt-2 mb-1">Description:</Label>
	<Textarea
		id="description"
		bind:value={newProject.description}
		placeholder="The full description of your project. Be as detailed as you want!"
		disabled={isLoading}
	/>

	<Button type="submit" disabled={isLoading}>Create</Button>
</form>
