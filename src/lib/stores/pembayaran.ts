import { writable } from "svelte-local-storage-store";

export const listBank = writable<string[]>('listbank',[])