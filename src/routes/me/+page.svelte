<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '@/api/Supabase';
	import { authGuard } from '@/guards';
	import { user } from '@/stores/session';

	authGuard();

	async function logout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			alert(`${error.status}: ${error.message}`);
		}

		await goto('/');
	}
</script>

{#if $user}
	<div>Logged in as: {$user.email}</div>

	<button on:click={logout}>Log out</button>
{/if}
