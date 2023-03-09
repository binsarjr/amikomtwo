import type { IJadwalKuliah } from '@binsarjr/apiamikomone/lib/typings/Response'

import { writable } from 'svelte-local-storage-store'

export const jadwal = writable<IJadwalKuliah[]>('jadwal', []);