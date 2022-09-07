<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Mods</title>
</svelte:head>

<h2>Mods</h2>

{data.project_ids.length} mods:
<ul>
	{#each data.project_ids as id}
		<li><a href="/mods/{id}">{id}</a></li>
	{/each}
</ul>
