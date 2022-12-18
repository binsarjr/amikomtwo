import { MikomOneDevice, MikomSupports } from "@binsarjr/apiamikomone";
import { error } from "@sveltejs/kit";
import { privateKey } from "../../../lib/config";
import { authAttempt, encPassword } from "../../../lib/supports/auth";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData()
        const nim = formData.get('nim') as string
        const password = formData.get('password') as string
        try {
            const response = await authAttempt(nim,password)

            return {
                location: '/onedevice',
                success: "Login Berhasil!",
                response,
                password: encPassword(password)
            }
        } catch (e) {
            throw error(422, { message: "NIM dan Password Tidak Valid!" })
        }
    }
}