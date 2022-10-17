<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/Supabase';
	import { authGuard } from '@/guards';
	import { calculateSHA256 as computeSHA256, isValidURL } from '@/lib/Helpers';
	import type { Profile } from '@/models/Profile';
	import { user } from '@/stores/session';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	authGuard();

	let isLoading = true;

	let profile: Profile;

	let avatarFileList: FileList;

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

	async function saveProfileChanges() {
		isLoading = true;

		// only check avatar url if we haven't attempted to upload one
		if (!isValidURL(profile.avatar_url as string) && avatarFileList.length === 0) {
			const err = new Error('Invalid avatar url!');
			alert(err);
			throw err;
		}

		if (!isValidURL(profile.website_url as string)) {
			const err = new Error('Invalid website url!');
			alert(err);
			throw err;
		}

		const avatarFile = avatarFileList.item(0);
		if (!avatarFile) throw new Error('No avatar file selected.');

		const hash = await updateAvatar(avatarFile);

		const publicUrlResponse = supabase.storage.from('avatars').getPublicUrl(hash);
		if (publicUrlResponse.data) {
			profile.avatar_url = publicUrlResponse.data.publicURL;
		} else {
			alert('Failed to upload avatar. Please try again later.');
			throw publicUrlResponse.error?.message;
		}

		const { error } = await supabase
			.from('profiles')
			.update({
				username: profile.username,
				website_url: profile.website_url,
				avatar_url: profile.avatar_url,
			})
			.eq('id', profile?.id);

		if (error) throw error;

		isLoading = false;
	}

	async function updateAvatar(file: File): Promise<string> {
		const validExts = ['png', 'apng', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'heic'];

		const fileExt = file.name.split('.').pop();
		if (!fileExt) return Promise.reject(new Error('File does not have an extension'));

		if (!validExts.includes(fileExt.toLocaleLowerCase()))
			return Promise.reject(new Error('Invalid image extension: ' + fileExt));

		//! crypto.subtle is only available on the browser. For Node, just import 'crypto'
		const hash = await computeSHA256(await file.arrayBuffer());
		await supabase.storage.from('avatars').upload(hash, file, {
			upsert: true,
		});

		return hash;
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

		{#if profile.avatar_url?.startsWith('http')}
			<img class="avatar" alt="Your avatar" src={profile.avatar_url} />
		{:else}
			<div class="blank avatar">No avatar</div>
		{/if}
		<label for="avatar">Avatar</label>
		<input type="file" id="avatar" bind:files={avatarFileList} />

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
		object-fit: cover;
	}

	.blank.avatar {
		display: flex;
		align-items: center;
		justify-content: center;

		border: 0.05rem solid black;
	}
</style>
