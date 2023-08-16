import type { IHistory } from '@binsarjr/apiamikomone/lib/typings/Response'
import { persisted } from 'svelte-local-storage-store'

export const listBank = persisted<string[]>('listbank', []);
export const historiPembayaran = persisted<IHistory[]>('histori_pembayaran', []);
