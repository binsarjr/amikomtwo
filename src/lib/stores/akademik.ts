import type { ITranskripNilai } from "@binsarjr/apiamikomone/lib/typings/Response";
import { writable } from "svelte-local-storage-store";

export const transkripNilai = writable<ITranskripNilai | null>('transkripnilai', null)