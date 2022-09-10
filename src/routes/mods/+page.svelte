<script lang="ts">
	import { goto } from '$app/navigation';
	import { getProjectSlugs } from '@/lib/ApiClient';
	import { user, defaultUser } from '@/stores/session';
	import { onMount } from 'svelte';

	let isLoading = true;
	let project_slugs: string[];

	onMount(async () => {
		project_slugs = await getProjectSlugs();

		isLoading = false;
	});
</script>

<svelte:head>
	<title>Mods</title>
</svelte:head>

<h2>Mods</h2>

{#if isLoading}
	<div>Loading...</div>
{:else}
	{#if $user !== defaultUser}
		<button on:click={async () => await goto('/mods/create')}>+ Create Project</button>
	{/if}
	<div>
		{project_slugs.length} mods:
		<ul>
			{#each project_slugs as slug}
				<li><a href="/mods/{slug}">{slug}</a></li>
			{/each}
		</ul>
	</div>
{/if}
