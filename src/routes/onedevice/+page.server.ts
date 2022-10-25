import { getJadwalMahasiswaServerLoad, getMahasiswaServerLoad } from "$lib/serverLoad/mahasiswa"
import { MikomOneDevice } from "@binsarjr/apiamikomone"
import type { IBio } from "@binsarjr/apiamikomone/lib/typings/Response"
import type { PageServerLoad } from "./$types"


export const load: PageServerLoad = async ({ parent, cookies }) => {
    await parent()
    let mahasiswa = await getMahasiswaServerLoad(cookies) as IBio
    let jadwal = await getJadwalMahasiswaServerLoad(cookies, mahasiswa)
    return {
        mahasiswa, jadwal
    }
}