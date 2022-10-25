import { MikomLegacy, MikomOneDevice } from "@binsarjr/apiamikomone"
import type { IBio } from "@binsarjr/apiamikomone/lib/typings/Response"
import type { PageServerLoad } from "./$types"


export const load: PageServerLoad = async ({ parent, cookies }) => {
    await parent()
    let mahasiswa: IBio | null = null
    if (cookies.get('mahasiswa')) {
        mahasiswa = JSON.parse(cookies.get('mahasiswa') as string)
    } else {
        const accessToken = cookies.get('access_token') as string
        const apiKey = cookies.get('api_key') as string

        mahasiswa = await Promise.any([MikomOneDevice.Mahasiswa.Bio(accessToken, apiKey), MikomLegacy.Mahasiswa.Bio(accessToken)])

        let expires = new Date()
        expires.setDate(expires.getDate() + 1)
        cookies.set('mahasiswa', JSON.stringify(mahasiswa), {
            path: '/',
            expires
        })
    }
    console.log(mahasiswa)

    return {
        mahasiswa: mahasiswa as IBio
    }
}