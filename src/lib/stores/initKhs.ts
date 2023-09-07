import type { InitKHS } from '$Amikom/typings/Response';
import { persisted } from 'svelte-local-storage-store';

export const initKhs = persisted<InitKHS | null>('initkhs', null);
