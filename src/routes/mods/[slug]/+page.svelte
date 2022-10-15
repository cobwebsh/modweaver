<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getAuthorProfileByProjectSlug,
		getProject,
		getProjectDependencies,
		getProjectVersions,
	} from '@/lib/ApiClient';
	import type { Profile } from '@/models/Profile';
	import { defaultProject, type Project } from '@/models/Project';
	import type { ProjectDependency } from '@/models/ProjectDependency';
	import type { ProjectVersion } from '@/models/ProjectVersion';
	import { user } from '@/stores/session';
	import { onMount } from 'svelte';

	let isLoading = true;
	let project: Project = defaultProject;
	let author: Profile = { username: 'Unknown' };
	let versions: ProjectVersion[] = [];
	let dependencies: { [version_id: string]: ProjectDependency[] } = {};

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
				.then(async (vers) => {
					versions = vers;
					await Promise.all(
						//@ts-ignore We know version.id can never be null because we're pulling it straight from the DB
						versions.map(async (version) => (dependencies[version.id] = await getProjectDependencies(version.id)))
					);
				})
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

	{#if $user.id === author.id}
		<a href={`/mods/${project.slug}/upload`}><button>+ Create Version</button></a>
	{/if}
	{versions.length} versions:
	<div class="version-list">
		{#each versions.sort().reverse() as version}
			<div class="version-card">
				<div>
					Version {version.version}
					{#if !version.is_approved} (Unapproved) {/if}
				</div>

				{#if dependencies[version.id ?? '']}
					<div>
						Requires:
						<ul class="requirements-list">
							{#each dependencies[version.id ?? ''] as dep}
								<!-- TODO: Get the proper name and summary for each dependency -->
								<li>
									<a href="/mods/{dep.dependency_slug}">{dep.dependency_slug}</a>@{dep.version_range}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				<div class="toolbar">
					<a href={version.download_url}>Download</a>
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
