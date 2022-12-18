import type { IBio, IJadwalKuliah, IPresence } from "@binsarjr/apiamikomone/lib/typings/Response";
import { get } from "svelte/store";
import { jadwal } from "./stores/jadwal";
import { mahasiswa } from "./stores/mahasiswa";
import { authUser, preferences } from "./stores/preferences";

export const serviceClient = {
    refresh: async () => {
        const formdata = new FormData();
        formdata.set('nim', get(preferences).nim);
        formdata.set('password', get(preferences).password);
        const r = await fetch('/onedevice/services/refresh', {
            method: 'POST',
            body: formdata
        });
        const response = await r.json();
        authUser.update(() => {
            return {
                accessToken: response.access_token,
                apiKey: response.api_key
            };
        })
    },
    bio: async () => {
        const r = await fetch(
            `/onedevice/services/bio?access_token=${encodeURIComponent(
                get(authUser)!.accessToken
            )}&api_key=${encodeURIComponent(get(authUser)!.apiKey)}`
        );
        const resp: IBio = await r.json()
        mahasiswa.update(() => resp)
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