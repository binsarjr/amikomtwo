import { writable } from "svelte-local-storage-store";

export let activeTab = writable<'home' | 'presensi' | 'profile'>('activeTab', 'home');