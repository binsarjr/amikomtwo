import type { InitKHS } from "@binsarjr/apiamikomone/lib/typings/Response";
import { writable } from "svelte-local-storage-store";

export const initKhs = writable<InitKHS | null>('initkhs', null)