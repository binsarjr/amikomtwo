import { getMahasiswaServerLoad } from "$lib/serverLoad/mahasiswa"
import { MikomLegacy, MikomOneDevice } from "@binsarjr/apiamikomone"
import type { IBio } from "@binsarjr/apiamikomone/lib/typings/Response"
import type { PageServerLoad } from "./$types"


export const load: PageServerLoad = async ({ parent, cookies }) => {
    await parent()
    let mahasiswa = await getMahasiswaServerLoad(cookies)

    return {
        mahasiswa: mahasiswa as IBio // yakin karena user sudah dicek valid atau tidak di parent page load(/onedevice/+layout.server.ts)
    }
}