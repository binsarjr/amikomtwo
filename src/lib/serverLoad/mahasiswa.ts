import { MikomLegacy, MikomOneDevice } from "@binsarjr/apiamikomone";
import type { IBio } from "@binsarjr/apiamikomone/lib/typings/Response";
import type { Cookies } from "@sveltejs/kit";

export const getMahasiswaServerLoad = async (cookies: Cookies) => {
    let mahasiswa: IBio | null = null
    if (cookies.get('mahasiswa')) {
        mahasiswa = JSON.parse(cookies.get('mahasiswa') as string)
        // Antisipasi ketika user logout dan login kembali dengan user yang berbeda
        if (cookies.get('nim') !== mahasiswa?.Mhs.Npm) mahasiswa = null
    }
    if (!mahasiswa) {
        const accessToken = cookies.get('access_token') as string
        const apiKey = cookies.get('api_key') as string
        try {
            mahasiswa = await Promise.any([MikomOneDevice.Mahasiswa.Bio(accessToken, apiKey), MikomLegacy.Mahasiswa.Bio(accessToken)])

            let expires = new Date()
            expires.setDate(expires.getDate() + 1)
            cookies.set('mahasiswa', JSON.stringify(mahasiswa), {
                path: '/',
                expires
            })
        } catch (error) {
            console.log("Mahasiswa tidak ditemukan")
            console.log(error)
            console.log("Mahasiswa tidak ditemukan")
            return null
        }


    }

    return mahasiswa
}

export const getJadwalMahasiswaServerLoad = async (cookies: Cookies, mahasiswa: IBio) => {
    const accessToken = cookies.get('access_token') as string
    const apiKey = cookies.get('api_key') as string
    const idHari = new Date().getDay()
    const jadwal = await Promise.any([MikomOneDevice.Mahasiswa.JadwalKuliah(accessToken, apiKey,idHari),
    MikomLegacy.Mahasiswa.JadwalKuliah(accessToken, mahasiswa.PeriodeAkademik.Semester, mahasiswa.PeriodeAkademik.TahunAkademik,idHari)])
    return jadwal
}