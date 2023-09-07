import type { IBio } from '$Amikom/typings/Response';
import { persisted } from 'svelte-local-storage-store';

export const mahasiswa = persisted<IBio | null>('mahasiswa', null);
