<script lang="ts">
	import { Button, Heading, P } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
		<Heading class="mb-4">Welcome to ModWeaver</Heading>
		<p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
			The home of <a href="https://spiderheck.com" class="underline">Spiderheck</a> mods
		</p>
		<Button size="xl" href="/mods">Explore</Button>
	</div>
</section>
