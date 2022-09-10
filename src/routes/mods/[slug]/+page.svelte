<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getAuthorProfileByProjectSlug, getProject, getProjectVersions } from '@/lib/ApiClient';
	import type { Profile } from '@/models/Profile';
	import { defaultProject, type Project } from '@/models/Project';
	import type { ProjectVersion } from '@/models/ProjectVersion';
	import { onMount } from 'svelte';

	let isLoading = true;
	let project: Project = defaultProject;
	let author: Profile = { username: 'Unknown' };
	let versions: ProjectVersion[] = [];

	onMount(async () => {
		await Promise.all([
			getProject($page.params.slug)
				.then((proj) => (project = proj))
				.catch(async (err) => {
					console.error(err);
					await goto('/');
				}),
			getAuthorProfileByProjectSlug($page.params.slug)
				.then((profile) => (author = profile))
				.catch((err) => console.error(err)),
			getProjectVersions($page.params.slug)
				.then((vers) => (versions = vers))
				.catch((err) => console.error(err)),
		]);

		isLoading = false;
	});
</script>

<svelte:head>
	<title>{project?.name ?? ''}</title>
</svelte:head>

{#if isLoading}
	<div>Loading...</div>
{:else}
	<h2>{project.name}</h2>
	<h3>by <a href={author.website_url}>{author.username}</a></h3>

	<p>{project.description ?? 'No description given.'}</p>

	{versions.length} versions:
	<div class="version-list">
		{#each versions.sort().reverse() as version}
			<div class="version-card">
				<div>Version {version.version}</div>
				<div>
					Requirements:
					<ul class="requirements-list">
						{#each version.requires as requirement}
							{#if requirement.is_in_api}
								<li>
									<a href="/mods/{requirement.id}">{requirement.id}</a>@{requirement.version}
								</li>
							{:else}
								<li>
									<p>{requirement.id}@{requirement.version}</p>
								</li>
							{/if}
						{/each}
					</ul>
				</div>
				<div class="toolbar">
					<a href={version.url}>Download</a>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.version-list {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		width: 24rem;
	}

	.version-card {
		display: flex;
		flex-direction: column;
		margin: 0.5rem;
		padding: 1rem;
		border-radius: 1rem;
		border: 0.1rem solid black;
	}

	.version-card > .toolbar {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
</style>
