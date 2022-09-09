<script lang="ts">
import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.project.name}</title>
</svelte:head>

<h2>{data.project.name}</h2>
<h3>by {data.project.author}</h3>

<p>{data.project.description}</p>

{data.project.versions.length} versions:
<div class="version-list">
	{#each data.project.versions.sort().reverse() as version}
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
