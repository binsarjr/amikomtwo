import { MikomOneDevice, MikomSupports } from "@binsarjr/apiamikomone";
import { invalid } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData()
        const nim = formData.get('nim') as string
        const password = formData.get('password') as string
        try {
            const response = await MikomOneDevice.Auth(nim, password, nim)
            const expires = new Date()
            expires.setSeconds(expires.getSeconds() + parseInt(response.expires_in.toString()))

            const expiresSixMonth = new Date()
            expiresSixMonth.setMonth(expiresSixMonth.getMonth() + 6)

            cookies.set('logged', '1', { path: '/', expires: expiresSixMonth })
            cookies.set('nim', nim, { path: '/', expires: expiresSixMonth })
            cookies.set('password', MikomSupports.Encryption.encrypt(password), { path: '/', expires: expiresSixMonth })
            cookies.set('access_token', response.access_token, { path: '/', expires })
            cookies.set('api_key', response.api_key, { path: '/', expires })
            return {
                location: '/onedevice',
                success: "Login Berhasil!"
            }
        } catch (error) {
            return invalid(422, { error: "NIM dan Password Tidak Valid!" })
        }
    }
}