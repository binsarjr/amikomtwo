import type { PageServerLoad } from ".svelte-kit/types/src/routes/auth/$types"
import { MikomOneDevice, MikomSupports } from "@binsarjr/apiamikomone"
import { redirect } from "@sveltejs/kit"


export const load: PageServerLoad = async ({ cookies }) => {
    const accessToken = cookies.get('access_token')
    const apiKey = cookies.get('api_key')
    const nim = cookies.get('nim') as string
    const password = cookies.get('password') as string
    if (!accessToken) {
        try {
            const response = await MikomOneDevice.Auth(nim, MikomSupports.Encryption.decrypt(password), nim)
            const expires = new Date()
            expires.setSeconds(expires.getSeconds() + parseInt(response.expires_in.toString()))
            

            cookies.set('access_token', response.access_token, { path: '/', expires })
            cookies.set('api_key', response.api_key, { path: '/', expires })

        } catch (error) {
            throw redirect(302, '/auth')
        }
    }
}