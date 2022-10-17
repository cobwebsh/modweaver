<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/Supabase';
	import { Heading, Label, Input, Button } from 'flowbite-svelte';

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

<Heading>Login</Heading>

<form on:submit|preventDefault={login}>
	<Label for="email">Email address:</Label>
	<Input type="email" id="email" bind:value={email} required />

	<Label for="email">Password:</Label>
	<Input type="password" id="password" bind:value={password} required />

	<Button type="submit">Log in</Button>
	<span>or</span>
	<Button color="alternative" on:click={createAccount}>Create account</Button>
</form>

{#if status}
	<div>Status:</div>
	<pre>{status}</pre>
{/if}
