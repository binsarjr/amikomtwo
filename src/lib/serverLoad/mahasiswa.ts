import { MikomOneDevice } from "@binsarjr/apiamikomone";
import type { IBio, IJadwalKuliah } from "@binsarjr/apiamikomone/lib/typings/Response";
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
            mahasiswa = await MikomOneDevice.Mahasiswa.Bio(accessToken, apiKey)

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
    let jadwal: IJadwalKuliah[] | null = null
    if (cookies.get('jadwal')) {
        jadwal = JSON.parse(cookies.get('jadwal') as string)
        // Antisipasi ketika user logout dan login kembali dengan user yang berbeda
        if (cookies.get('nim') !== mahasiswa.Mhs.Npm) jadwal = null
    }
    if (jadwal == null) {
        jadwal = await MikomOneDevice.Mahasiswa.JadwalKuliah(accessToken, apiKey, idHari)
        let expires = new Date()
        expires.setHours(expires.getHours() + 1)
        cookies.set('jadwal', JSON.stringify(jadwal), {
            path: '/',
            expires
        })
    }
    return jadwal
}