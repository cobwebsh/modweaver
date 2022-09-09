<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '@/api/Supabase';
	import type { Profile } from '@/models/Profile';

	let isLoading = false;
	let status: string;

	let email: string;
	let password: string;

	async function createAccount() {
		isLoading = true;

		let { user, error } = await supabase.auth.signUp({ email, password });
		if (error) console.error(error);

		if (user) {
			// Create and insert a new profile for the user
			// For now, set the username to the first part of the email (can be changed later)
			const newProfile: Profile = {
				id: user?.id,
				username: email.split('@').at(0),
			};
			const { error } = await supabase.from('profiles').upsert(newProfile, { returning: 'minimal' });
			if (error) {
				status = error.message;
			} else {
				// If we successfully signed up, redirect to the user's page
				await goto('/me');
			}
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

	<button on:click={createAccount}>Create account</button>
	<button type="submit">Log in</button>

	<pre>{status}</pre>
</form>
