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

	let files: FileList | null | undefined;

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
		if (
			profile?.avatar_url?.indexOf('http') != -1 &&
			profile?.avatar_url?.indexOf(':') != -1 &&
			profile?.avatar_url?.indexOf('//') != -1
		) {
		} else {
			var err = 'Invalid avatar url!';
			console.error(err);
			alert(err);
			window.location.reload();
			return;
		}
		if (
			profile?.website_url?.indexOf('http') != -1 &&
			profile?.website_url?.indexOf(':') != -1 &&
			profile?.website_url?.indexOf('//') != -1
		) {
		} else {
			var err = 'Invalid website url!';
			console.error(err);
			alert(err);
			window.location.reload();
			return;
		}
		let url = await await supabase.storage
			.from('avatars')
			.getPublicUrl(profile.id + '.' + (await changeAvatar(files))).publicURL;
		if (url != null) {
			profile.avatar_url = url;
		} else {
			console.error('URL was null! Please try again');
		}
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
	async function changeAvatar(file: FileList | null | undefined): Promise<string | undefined> {
		const validExts = ['png', 'jpg', 'gif'];
		if (file != null && file != undefined) {
			for (var i = 0; file.length > i; i++) {
				let f = file.item(i);
				if (f != null) {
					const fileExt = f.name.split('.')[f.name.split('.').length - 1];
					console.log(f.name + ' : ' + f.name.split('.').length);
					if (validExts.includes(fileExt)) {
                        let name = profile.id + "." + fileExt;
                        console.log("hfgfdrh : " + name)
						/*let { error } = await supabase.storage.from('avatars').remove([name]);
                        let error_remove = error;
                        if (error_remove) {
                            console.error(error_remove)
                        }
						({error} = (await supabase.storage.from('avatars').upload(name, f)));
                        let error_upload = error;
                        if (error_upload) {
                            console.error(error_upload)
                        }*/
                        await supabase.storage.from('avatars').update(name, f, {
                            upsert: true
                        })
					} else {
						// TODO: replace with own error models
						var error = 'Invalid image extension: ' + fileExt;
						console.error(error);
						alert(error);
					}
					if (i == file.length) {
						console.log(fileExt + ' : fileExt');
						return fileExt;
					} else {
                        console.log("Beep : " + i + " : " + file.length)
                    }
				}
			}
		}
        return "png";
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
		{#if profile.avatar_url && profile.avatar_url?.indexOf('http') != -1}
			<img class="avatar" alt="Your avatar" src={profile.avatar_url} />
		{:else}
			<div class="blank avatar">No avatar</div>
		{/if}
		<label for="avatar">Avatar</label>
		<input type="file" id="avatar" bind:files />
		

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
