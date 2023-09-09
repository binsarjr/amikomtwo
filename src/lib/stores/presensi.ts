import type { IPresence } from '$Amikom/typings/Response';
import { persisted } from 'svelte-local-storage-store';

export const historiPresensi = persisted<{ [i: string]: IPresence[] }>('histori-presensi', {});
