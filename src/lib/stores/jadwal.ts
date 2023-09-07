import type { IJadwalKuliah } from '$Amikom/typings/Response';

import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

type JadwalKuliah = IJadwalKuliah & {
	ZoomURL: string;
};

export const jadwal = persisted<JadwalKuliah[]>('jadwal', []);
export const jadwalHariIni = writable<JadwalKuliah[]>([]);
export const jadwalMatkulAktif = writable<JadwalKuliah | undefined>(undefined);

export const getIdFromJadwal = (jadwal: JadwalKuliah) =>
	`${jadwal.IdHari}${jadwal.IdJam}${jadwal.IdKuliah}`;
