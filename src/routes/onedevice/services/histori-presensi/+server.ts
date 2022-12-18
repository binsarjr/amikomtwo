import { MikomOneDevice } from "@binsarjr/apiamikomone";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    const access_token = url.searchParams.get('access_token')?.toString() || ''
    const apikey = url.searchParams.get('api_key')?.toString() || ''
    const semester = parseInt(url.searchParams.get('semester')?.toString() || '')
    const tahunAkademik = url.searchParams.get('tahun_akademik')?.toString() || ''



    const response = await MikomOneDevice.Presence.All(access_token, apikey, semester, tahunAkademik)
    return new Response(JSON.stringify(response))
}