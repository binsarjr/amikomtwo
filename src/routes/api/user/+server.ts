import { MikomLegacy, MikomOneDevice } from "@binsarjr/apiamikomone";
import { json, type Action } from "@sveltejs/kit";

export const GET: Action = async ({ cookies }) => {
    const accessToken = cookies.get('access_token') as string
    const apiKey = cookies.get('api_key') as string
    try {
        const bio = await Promise.any([MikomOneDevice.Mahasiswa.Bio(accessToken, apiKey), MikomLegacy.Mahasiswa.Bio(accessToken)])
        return json(bio)
    } catch (error) {
        return json({ message: "Anda belum login" }, { status: 401 })
    }
}