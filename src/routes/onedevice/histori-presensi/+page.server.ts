import { getMahasiswaServerLoad } from "$lib/serverLoad/mahasiswa";
import { getHistoriPresensiServerLoad } from "$lib/serverLoad/presensi";
import type { PageServerLoad } from ".svelte-kit/types/src/routes/auth/$types";
import type { IBio } from "@binsarjr/apiamikomone/lib/typings/Response";

export const load: PageServerLoad = async ({ parent, cookies }) => {
    await parent()
    const mahasiswa = await getMahasiswaServerLoad(cookies) as IBio
    const histori = await getHistoriPresensiServerLoad(cookies, mahasiswa.PeriodeAkademik.Semester, mahasiswa?.PeriodeAkademik.TahunAkademik)
    return { histori,mahasiswa }
}