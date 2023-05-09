import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response';

import { writable } from 'svelte-local-storage-store';
import {writable as persist} from 'svelte/store'

export const jadwal = writable<IJadwalKuliah[]>('jadwal', []);
export const jadwalHariIni = persist<IJadwalKuliah[]>([]);
export const jadwalMatkulAktif = persist<IJadwalKuliah|undefined>(undefined)