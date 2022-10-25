import { MikomOneDevice } from "@binsarjr/apiamikomone"
import { PresenceStatus } from "@binsarjr/apiamikomone/lib/typings/Enum/Presence"
import { invalid } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"


export const load: PageServerLoad = async ({ parent }) => {
    await parent()
}


export const actions: Actions = {
    qrcode: async ({ request, cookies }) => {
        const accessToken = cookies.get('access_token') as string
        const qrresult = (await request.formData()).get('qrcode') as string
        const [_, response] = await Promise.all([
            new Promise((resolve) => setTimeout(resolve, 3000)), // minimal proses harus 1 detik,
            MikomOneDevice.Presence.Qrcode(accessToken, qrresult)
        ])
        if (response.status === PresenceStatus.Success) {
            return {
                success: response.message
            }
        } else {
            return invalid(409, { error: response.message })
        }
    },
    manual: async ({ request, cookies }) => {
        const accessToken = cookies.get('access_token') as string
        const code = (await request.formData()).get('code') as string
        const response = await MikomOneDevice.Presence.Code(accessToken, code)
        if (response.status === PresenceStatus.Success) {
            return {
                success: response.message
            }
        } else {
            return invalid(409, { error: response.message })
        }
    },
}