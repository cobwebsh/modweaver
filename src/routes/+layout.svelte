<script lang="ts">
	import '../app.postcss';
	import { supabase } from '$lib/Supabase';
	import { defaultUser, user } from '@/stores/session';
	import { Button, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	user.set(supabase.auth.user() ?? defaultUser);

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user ?? defaultUser);
	});

	async function logout() {
		const { error } = await supabase.auth.signOut();

		if (error) throw error;

		await goto('/');
	}
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ModWeaver</span>
	</NavBrand>
	<NavUl>
		<NavLi href="/mods">Mods</NavLi>
		{#if $user !== defaultUser}
			<NavLi href="/me">Me</NavLi>
			<NavLi href="#" on:click={logout}>Logout</NavLi>
		{:else}
			<NavLi href="/login">Login</NavLi>
		{/if}
	</NavUl>
</Navbar>

<main class="w-full px-4 mx-auto flex-auto max-w-5xl min-w-0 pt-6 lg:px-8 lg:pt-8 pb:12 xl:pb-24 lg:pb-16">
	<slot />
</main>
