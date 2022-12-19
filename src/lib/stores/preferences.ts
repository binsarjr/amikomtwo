import { writable } from 'svelte-local-storage-store';

export let preferences = writable('preferences', {
	nim: '',
	password: '',
	tanggalLahir: '',
	otp: ''
});

export let authUser = writable<{
	accessToken: string;
	apiKey: string;
} | null>('authuser', null);
