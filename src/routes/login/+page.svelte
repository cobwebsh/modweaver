<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '@/api/Supabase';

	let isLoading = false;
	let status: string;

	let email: string;
	let password: string;

	async function createAccount() {
		isLoading = true;
		let { error } = await supabase.auth.signUp({ email, password });
		if (error) {
			console.error(error);
		} else {
			// If we successfully signed up, redirect to the user's page
			await goto('/me');
		}
		isLoading = false;
	}

	async function login() {
		isLoading = true;
		let { error } = await supabase.auth.signIn({ email, password });
		if (error) {
			console.error(error);
		} else {
			// If we successfully logged in, redirect to the user's page
			await goto('/me');
		}
		isLoading = false;
	}
</script>

<h2>Login</h2>

<form on:submit|preventDefault={login}>
	<label for="email">Email address:</label>
	<input type="email" id="email" bind:value={email} />

	<label for="email">Password:</label>
	<input type="password" id="password" bind:value={password} />

	<button on:click={createAccount}>Create account</button>
	<button type="submit">Log in</button>

	<div>{status}</div>
</form>
