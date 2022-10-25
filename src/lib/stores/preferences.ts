import { writable } from "svelte-local-storage-store";

export let preferences = writable('preferences', {
    nim: '',
    tanggalLahir: '',
    otp: ''
})