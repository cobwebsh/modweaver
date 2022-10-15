<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DependencyList from '@/components/DependencyList.svelte';
	import { authGuard } from '@/guards';
	import { getProject } from '@/lib/ApiClient';
	import { supabase } from '@/lib/Supabase';
	import { defaultProject, type Project } from '@/models/Project';
	import type { ProjectDependency } from '@/models/ProjectDependency';
	import type { ProjectVersion } from '@/models/ProjectVersion';
	import semver from 'semver/index';
	import { onMount } from 'svelte';

	let isLoading = true;

	authGuard();

	let semanticVersion = '';
	let dependencies: ProjectDependency[] = [];
	let files: FileList | undefined;

	/** An error message passed up from the DependencyList component */
	let dependenciesError: string;

	const project_slug = $page.params.slug;
	let project: Project = defaultProject;

	onMount(async () => {
		project = await getProject(project_slug);

		isLoading = false;
	});

	async function createVersion() {
		isLoading = true;

		const errs = getFormErrors();
		if (errs.length > 0) {
			// there were errors, show them to the user
			errs.forEach((err) => console.error(err));
			isLoading = false;
			return;
		}

		// at this point we know `files.item(0)` exists (we called getFormErrors), so we can assert to TS that it exists
		// @ts-ignore
		const file: File = files.item(0);

		// TODO: Move this chunk into an API call (and rewrite it). Ideally this should be done as a transaction.
		const fileName = `${project_slug}-${semanticVersion}.dll`;
		const filePath = `${project_slug}/${fileName}`;

		// TODO: Check for existing version before uploading (or show user an error when existing file detected)
		const uploadResponse = await supabase.storage.from('mods').upload(filePath, file);
		if (uploadResponse.error) throw uploadResponse.error;
		if (uploadResponse.data) {
			const publicUrlResponse = supabase.storage.from('mods').getPublicUrl(filePath);
			if (publicUrlResponse.error) throw publicUrlResponse.error;
			if (publicUrlResponse.publicURL) {
				const newVersion: ProjectVersion = {
					project_slug,
					download_url: publicUrlResponse.publicURL,
					version: semanticVersion,
				};
				const versionResponse = await supabase.from<ProjectVersion>('versions').insert(newVersion).single();
				if (versionResponse.error) throw versionResponse.error;
				if (versionResponse.data?.id) {
					dependencies = sanitizeDependencies(dependencies, versionResponse.data.id);

					const dependenciesResponse = await supabase.from<ProjectVersion>('dependencies').insert(dependencies);
					if (dependenciesResponse.error) throw dependenciesResponse.error;
					if (dependenciesResponse.data) {
						await goto(`/mods/${project_slug}`);
					}
				}
			}
		}

		isLoading = false;
	}

	/**
	 * Cleans up the dependencies array and verifies that objects have the correct parameters
	 * @param dependencies The array to clean
	 * @param version_id The project version that these dependencies belong to
	 */
	function sanitizeDependencies(dependencies: ProjectDependency[], version_id: string): ProjectDependency[] {
		// remove blank dependencies (if any)
		dependencies = dependencies.filter((dep) => dep.dependency_slug && dep.version_range);

		// ensure that dependencies have the correct properties (this is technically JS, after all)
		dependencies = dependencies.map((dep) => {
			return {
				dependency_slug: dep.dependency_slug,
				version_id,
				version_range: dep.version_range,
			};
		});

		return dependencies;
	}

	/** Performs form validation */
	function getFormErrors(): string[] {
		const errors: string[] = [];

		if (!semver.valid(semanticVersion)) {
			errors.push(
				`Version number ${semanticVersion} is invalid. Check https://docs.npmjs.com/about-semantic-versioning for guidance.`
			);
		}

		if (dependenciesError) {
			errors.push(dependenciesError);
		}

		const file = files?.item(0);

		if (!files || !file) {
			errors.push('You must upload a file.');
			// we return early here because none of the other errors will apply if this one fails
			return errors;
		}

		if (files.length > 1) {
			// TODO: If necessary, we could zip up files on the client before sending them over
			errors.push('You may only upload 1 file.');
		}

		// This is not a good enough check to see if a file is a mod, but it catches stuff like images/videos/documents
		// if (file.type !== 'application/x-msdownload') {
		// 	errors.push(`${file.name} (${file.type}) does not look like a mod.`);
		// }

		return errors;
	}

	function updateSemverValidity(e: Event) {
		const isValid = Boolean(semver.valid((e.target as HTMLInputElement).value));
		if (isValid) {
			(e.target as HTMLInputElement).setCustomValidity('');
		} else {
			(e.target as HTMLInputElement).setCustomValidity('Invalid semver.');
		}
	}
</script>

<svelte:head>
	<title>Upload new version</title>
</svelte:head>

<h2>Upload new version of {project.name}</h2>

<div class="form">
	<label for="file">Version file:</label>
	<input id="file" type="file" bind:files accept=".dll" />

	<label for="version">
		Version Number (must be a valid <a href="https://docs.npmjs.com/about-semantic-versioning" target="_blank">
			semver
		</a>):
	</label>
	<input
		id="version"
		type="text"
		bind:value={semanticVersion}
		placeholder="e.g. 1.2.5 or 0.0.2-alpha etc."
		on:input={updateSemverValidity}
		disabled={isLoading}
	/>

	<label for="dependency-list">Dependencies:</label>
	<DependencyList
		id="dependency-list"
		slug={project_slug}
		bind:dependencies
		bind:invalidMessage={dependenciesError}
		disabled={isLoading}
	/>

	<button on:click={async () => createVersion()} disabled={isLoading}>Upload</button>
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;

		width: 24rem;
	}

	.form > label {
		margin-top: 0.5rem;
		margin-bottom: 0.25rem;
	}
</style>
