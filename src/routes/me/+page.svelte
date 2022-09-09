<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '@/api/Supabase';
	import { authGuard } from '@/guards';
	import type { Profile } from '@/models/Profile';
	import { user } from '@/stores/session';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	authGuard();

	let isLoading = true;

	let profile: Profile;
	onMount(async () => {
		// force cast to Profile because we can be certain that it will exist
		profile = (await supabase
			.from('profiles')
			.select()
			.eq('id', get(user)?.id)
			.single()
			.then(({ data, error, status }) => {
				if (error && status !== 406) throw error;
				if (data) return data as Profile;
			})) as Profile;

		isLoading = false;
	});

	async function logout() {
		isLoading = true;

		const { error } = await supabase.auth.signOut();

		if (error) console.error(error);

		await goto('/');

		isLoading = false;
	}

	async function saveProfileChanges() {
		isLoading = true;

		const { error } = await supabase
			.from('profiles')
			.update({
				username: profile?.username,
				website_url: profile?.website_url,
				avatar_url: profile?.avatar_url,
			})
			.eq('id', profile?.id);

		if (error) console.error(error);
		else alert('Successfully updated profile!');

		isLoading = false;
	}
</script>

{#if isLoading}
	<div>Loading...</div>
{:else if $user}
	<h2>Me</h2>

	<form class="profile-edit" on:submit|preventDefault={saveProfileChanges}>
		<label for="username">Username</label>
		<input id="username" type="text" bind:value={profile.username} />

		<label for="email">Email address</label>
		<input id="email" type="email" bind:value={$user.email} disabled />

		<label for="website">Website</label>
		<input id="website" type="text" bind:value={profile.website_url} />

		<!-- TODO: Add avatar uploading -->
		{#if profile.avatar_url}
			<img class="avatar" alt="Your avatar" src={profile.avatar_url} />
		{:else}
			<div class="blank avatar">No avatar</div>
		{/if}
		<label for="avatar">Avatar URL</label>
		<input id="avatarUrl" type="text" bind:value={profile.avatar_url} />

		<button type="submit">Save</button>
	</form>

	<button on:click={logout}>Log out</button>
{/if}

<style>
	.profile-edit {
		display: flex;
		flex-direction: column;
		width: 12rem;
	}

	.avatar {
		aspect-ratio: 1;
		border-radius: 999rem;
		margin: 1rem;
	}

	.blank.avatar {
		display: flex;
		align-items: center;
		justify-content: center;

		border: 0.05rem solid black;
	}
</style>
