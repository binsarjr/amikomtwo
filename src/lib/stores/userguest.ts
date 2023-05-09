import { writable } from 'svelte-local-storage-store';
export interface UserGuest {
	nim: string;
	nama: string;
	signature: string;
	fitur: {
		presensi: boolean;
	};
	password?: string;
}
export let usersGuest = writable<UserGuest[]>('usersguest', []);


export let usersGuestStatus = writable<{
	[key: string|number]: {
		[key: string]: boolean
	}
}>('usersGuestStatus',{})