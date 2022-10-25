import { MikomOneDevice } from "@binsarjr/apiamikomone";
import { invalid, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    verify: async ({ request }) => {
        const formData = await request.formData()
        const otp = formData.get('otp') as string
        const nim = formData.get('nim') as string
        try {
            await MikomOneDevice.Device.Verify(nim, otp, nim)
            return {
                location: 'login',
                success: "OTP VAlid."
            }
        } catch (_) {
            return invalid(422, { error: "OTP Tidak valid." })
        }
    }, resend: async ({ request }) => {
        const formData = await request.formData()
        const tanggalLahir = formData.get('tanggal_lahir') as string
        const nim = formData.get('nim') as string
        try {
            await MikomOneDevice.Device.Otp(nim, tanggalLahir)
            return {
                success: "OTP Telah Dikirimkan."
            }
        } catch (_) {
            return invalid(422, { error: "NIM & Tanggal Lahir anda tidak valid.\nGagal Mengirimkan OTP" })
        }
    },
}