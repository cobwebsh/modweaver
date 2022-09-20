<script lang="ts">
	import { getProjectSlugsAndNames } from '@/lib/ApiClient';
	import { defaultProjectDependency, type ProjectDependency } from '@/models/ProjectDependency';
	import semver from 'semver/index';
	import { onMount } from 'svelte';

	export let id: string;
	export let disabled: boolean;
	/** The slug of the project we are handling dependencies for */
	export let slug: string;
	export let dependencies: ProjectDependency[];
	export let invalidMessage = '';

	let allProjects: Record<string, string>[] = [];

	function getAllProjectsForDependencyRow(currentDepSlug: string): Record<string, string>[] {
		/*
			This one's a bit weird, let me explain.
			We want each dropdown to be able to show a list of mods.
			We want this list of mods to not include any that have already been set as a dependency (because setting
				something as a dependency more than once makes no sense)
			But we need to include the currently selected mod because otherwise the dropdown won't be able to show it.
			One last thing is that we don't want to allow the mod to depend on itself (because that also makes no sense)
		*/
		// TODO: We also (probably) don't want dependency loops, but I haven't thought about a solution for that yet

		const filteredProjects = Array.from(allProjects).filter(
			(proj) => dependencies.find((req) => req.dependency_slug !== proj.slug) && proj.slug !== slug
		);
		const currentDependency = allProjects.find((p) => p.slug === currentDepSlug);
		if (currentDependency) {
			return [...filteredProjects, currentDependency];
		} else {
			return filteredProjects;
		}
	}

	onMount(async () => {
		allProjects = await getProjectSlugsAndNames();
	});

	// we set the array to itself to update the page (see https://svelte.dev/tutorial/updating-arrays-and-objects)
	function addSlot() {
		// use Object.create to copy the default instead of passing the default in
		dependencies.push(Object.create(defaultProjectDependency));
		dependencies = dependencies;
	}
	function removeSlot(index: number) {
		dependencies.splice(index, 1);
		dependencies = dependencies;
	}

	function validateSemver(e: Event) {
		const value = (e.target as HTMLInputElement).value;

		if (!semver.validRange(value)) {
			(e.target as HTMLInputElement).setCustomValidity('Invalid semver range.');
			invalidMessage = 'Invalid semver range.';
		} else {
			// TODO: Does this cancel the validation fail?
			(e.target as HTMLInputElement).setCustomValidity('');
			invalidMessage = '';
		}
	}
</script>

<button on:click={addSlot} {disabled}>Add</button>

{#if dependencies.length > 0}
	{#each dependencies as dep, i (dep.dependency_slug)}
		<table {id}>
			<thead>
				<td>Project</td>
				<td>Version</td>
			</thead>
			<tbody>
				<tr>
					<td>
						<select bind:value={dep.dependency_slug} {disabled} class="w-100">
							<!-- Only list projects that aren't already in required so you can't require the same project more than once -->
							{#each getAllProjectsForDependencyRow(dep.dependency_slug) as { slug, name } (slug)}
								<option value={slug}>{name}</option>
							{/each}
						</select>
					</td>
					<td>
						<input
							type="text"
							bind:value={dep.version_range}
							pattern={semver.valid(dep.version_range)}
							on:input={validateSemver}
							{disabled}
						/>
					</td>
					<td>
						<button on:click={() => removeSlot(i)} {disabled}>&cross;</button>
					</td>
				</tr>
			</tbody>
		</table>{/each}
{:else}
	<tr class="center">No dependencies</tr>
{/if}

<style>
	td {
		width: 100%;
	}

	.w-100 {
		width: 100%;
	}

	.center {
		display: flex;
		justify-content: center;
	}
</style>
