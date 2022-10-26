import { MikomLegacy, MikomOneDevice } from "@binsarjr/apiamikomone";
import type { Cookies } from "@sveltejs/kit";

export const getHistoriPresensiServerLoad = async (cookies: Cookies, semester: number, tahunAkademik: string) => {
    const accessToken = cookies.get('access_token') as string
    const apiKey = cookies.get('api_key') as string
    const histori = await Promise.any([
        MikomOneDevice.Presence.All(accessToken, apiKey, semester, tahunAkademik),
        MikomLegacy.Presence.All(accessToken, semester, tahunAkademik)
    ])
    return histori
}