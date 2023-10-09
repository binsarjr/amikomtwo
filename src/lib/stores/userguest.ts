import { persisted } from 'svelte-local-storage-store'
export interface UserGuest {
	nim: string;
	nama: string;
	signature: string;
	fitur: {
		presensi: boolean;
	};
	password?: string;
	device_id?: string;
}
export const usersGuest = persisted<UserGuest[]>('usersguest', []);

export const usersGuestStatus = persisted<{
	[key: string | number]: {
		[key: string]: boolean;
	};
}>('usersGuestStatus', {});
