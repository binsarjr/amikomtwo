import type { IHasilSemester, ITranskripNilai } from "@binsarjr/apiamikomone/lib/typings/Response";
import { writable } from "svelte-local-storage-store";

export const transkripNilai = writable<ITranskripNilai | null>('transkripnilai', null)
export const hasilStudiSemester = writable<IHasilSemester | null>('hasil-studi-semester', null)