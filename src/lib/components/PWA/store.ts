import { writable } from "svelte/store"

export const networkStatus = writable<'' | 'online' | 'offline' | 'no connectivity'>('')