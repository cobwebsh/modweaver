<script lang="ts">
	import "../app.postcss";
    import { supabase } from '$lib/Supabase';
    import { defaultUser, user } from '@/stores/session';

    user.set(supabase.auth.user() ?? defaultUser);

    supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user ?? defaultUser);
	});
</script>

<nav>
	<h1 class="logo">ModWeaver</h1>
	<a href="/">Home</a>
	<a href="/mods">Mods</a>
	{#if $user !== defaultUser}
		<a href="/me">Me</a>
	{:else}
		<a href="/login">Login</a>
	{/if}
</nav>
<main>
	<slot />
</main>

<style scoped>
	nav {
		display: flex;
		align-items: center;
	}

	nav > .logo {
		margin: 0.5rem;
	}

	nav > a {
		margin: 0 0.5rem;
	}
</style>
