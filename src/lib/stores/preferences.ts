import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'

export const isIos = persisted('isIos', false);

export const preferences = persisted('preferences', {
	nim: '',
	password: '',
	tanggalLahir: '',
	deviceId: '',
	otp: ''
});

export const authUser = persisted<{
	accessToken: string;
	apiKey: string;
} | null>('authuser', null);

export const pageLoader = writable(true);
