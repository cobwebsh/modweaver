import { user } from '@/stores/session';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

/** Clientside. Use this guard to ensure users are logged in before loading the page */
export const authGuard = () => {
	const loggedIn = Boolean(get(user));

	if (loggedIn) {
		return {};
	} else {
		throw redirect(307, '/login');
	}
};
