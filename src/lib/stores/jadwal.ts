import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response';
import { writable } from 'svelte-local-storage-store';

export const jadwal = writable<IJadwalKuliah[]>('jadwal', []);
export const jadwalMingguan = writable<{
    [i: number] : IJadwalKuliah[]
}>('jadwal_mingguan',{})