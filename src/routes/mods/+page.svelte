<script lang="ts">
	import { goto } from '$app/navigation';
	import { getProjectSlugs } from '@/lib/ApiClient';
	import { defaultUser, user } from '@/stores/session';
	import { Button, Card, Heading, Spinner } from 'flowbite-svelte';
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

<div class="flex flex-row justify-between">
	<Heading>Mods</Heading>
	{#if $user !== defaultUser}
		<Button color="green" href="/mods/create">Create</Button>
	{/if}
</div>

{#if isLoading}
	<!-- Render placeholder cards until content has loaded -->
	<div class="flex flex-col w-100 items-center">
		<div class="animate-pulse flex flex-wrap justify-between w-full mt-2">
			{#each Array(10) as _}
				<div class="md:w-1/2 xs:w-full p-2">
					<!-- Mod Card Placeholder -->
					<Card class="!max-w-none">
						<div class="flex">
							<div class="h-32 aspect-square rounded-lg mr-4 bg-gray-300 dark:bg-gray-700" />
							<div class="w-full">
								<div class="h-5 bg-gray-200 rounded-full dark:bg-gray-700 mb-4" />
								<div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-5/6 mb-2" />
								<div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-6/6 mb-2" />
								<div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-5/6 mb-2" />
								<div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-2/6" />
							</div>
						</div>
						<div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mt-4" />
						<span class="sr-only">Loading...</span>
					</Card>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="flex flex-wrap justify-between w-full mt-2">
		{#each project_slugs as slug}
			<div class="md:w-1/2 xs:w-full p-2">
				<Card class="!max-w-none">
					<div class="flex">
						<!-- TODO: Add project icons -->
						<img
							src="https://picsum.photos/id/1039/256"
							alt="Project icon for {slug}"
							class="h-32 aspect-square rounded-lg mr-4"
						/>
						<div class="w-full">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{slug}
							</h5>
							<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dignissim ipsum metus, ac rhoncus turpis
								egestas gravida.
							</p>
						</div>
					</div>
					<Button color="light" class="mt-4" on:click={async () => await goto(`/mods/${slug}`)}>Visit</Button>
				</Card>
			</div>
		{/each}
	</div>
{/if}
