import type { IPresence } from "@binsarjr/apiamikomone/lib/typings/Response";
import { writable } from "svelte-local-storage-store";

export const historiPresensi = writable<IPresence[]>('histori-presensi', [])