import type { IHistory } from '@binsarjr/apiamikomone/lib/typings/Response'
import { writable } from 'svelte-local-storage-store'

export const listBank = writable<string[]>('listbank', []);
export const historiPembayaran = writable<IHistory[]>('histori_pembayaran', []);
