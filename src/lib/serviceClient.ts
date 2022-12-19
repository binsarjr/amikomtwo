import type { IBio, IJadwalKuliah, InitKHS, IPresence } from "@binsarjr/apiamikomone/lib/typings/Response";
import toast from "svelte-french-toast";
import { get } from "svelte/store";
import { initKhs } from "./stores/initKhs";
import { jadwal } from "./stores/jadwal";
import { mahasiswa } from "./stores/mahasiswa";
import { authUser, preferences } from "./stores/preferences";

export const serviceClient = {
    refresh: async () => {
        const formdata = new FormData();
        formdata.set('nim', get(preferences).nim);
        formdata.set('password', get(preferences).password);
        try {

            const r = await fetch('/onedevice/services/refresh', {
                method: 'POST',
                body: formdata
            });
            const response = await r.json();
            authUser.update(() => ({
                accessToken: response.access_token,
                apiKey: response.api_key
            }))
        } catch (error) {
            toast.error("Gagal Login.")
            authUser.update(() => null)
        }
    },
    bio: async () => {
        const r = await fetch(
            `/onedevice/services/bio?access_token=${encodeURIComponent(
                get(authUser)!.accessToken
            )}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}`
        );
        const resp: IBio = await r.json()
        mahasiswa.update(() => resp)
    }, initkhs: async () => {
        const r = await fetch(
            `/onedevice/services/initkhs?access_token=${encodeURIComponent(
                get(authUser)!.accessToken
            )}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}`
        );
        const resp: InitKHS = await r.json()
        initKhs.update(() => resp)
    },
    jadwal: async (hari: number) => {
        const r = await fetch(
            `/onedevice/services/jadwal?access_token=${encodeURIComponent(
                get(authUser)!.accessToken
            )}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}&hari=${hari}`
        );
        const resp: IJadwalKuliah[] = await r.json()
        jadwal.update(() => resp)
    },
    historiPresensi: async (semester: number, tahunAkademik: string) => {
        const r = await fetch(
            `/onedevice/services/histori-presensi?access_token=${encodeURIComponent(
                get(authUser)!.accessToken
            )}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}&semester=${semester}&tahun_akademik=${tahunAkademik}`
        );
        const resp: IPresence[] = await r.json()
        return resp
    }
}