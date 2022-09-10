<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/Supabase';

	let isLoading = false;
	let status: string;

	let email: string;
	let password: string;

	async function createAccount() {
		isLoading = true;

		let { user, error } = await supabase.auth.signUp({ email, password });
		if (error) throw error;

		if (user) {
			// If we successfully signed up, let them know they need to accept through email
			status = 'Please confirm your email by clicking the link we sent to you.';
		}

		isLoading = false;
	}

	async function login() {
		isLoading = true;

		let { error } = await supabase.auth.signIn({ email, password });
		if (error) {
			status = error.message;
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
	<input type="email" id="email" bind:value={email} required />

	<label for="email">Password:</label>
	<input type="password" id="password" bind:value={password} required />

	<button type="submit">Log in</button>
	<span>or</span>
	<button on:click|preventDefault={createAccount}>Create account</button>
</form>

{#if status}
	<div>Status:</div>
	<pre>{status}</pre>
{/if}
