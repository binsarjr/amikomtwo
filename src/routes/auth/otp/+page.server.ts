import { ServerTimeout, ServerTimeoutError } from '$lib/error'
import { MikomOneDevice } from '@binsarjr/apiamikomone'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { createDeviceIdFromNpm } from '../../../lib/supports/device_is'

export const actions: Actions = {
	verify: async ({ request }) => {
		const formData = await request.formData()
		const otp = formData.get('otp') as string
		const nim = formData.get('nim') as string
		const device_id = createDeviceIdFromNpm(nim)

		try {
			await Promise.race([
				MikomOneDevice.Device.Verify(nim, otp, device_id),
				ServerTimeout()
			])
			// return {
			// 	location: 'login',
			// 	success: 'OTP VAlid.'
			// };
		} catch (err) {
			if (err instanceof ServerTimeoutError) {
				return fail(422, { message: 'Server Timeout' })
			}
			return fail(422, { message: 'OTP Tidak valid.' })
		}
		throw redirect(303, '/auth/login')
	},
	resend: async ({ request }) => {
		const formData = await request.formData()
		const tanggalLahir = formData.get('tanggal_lahir') as string
		const nim = formData.get('nim') as string
		try {
			await Promise.race([
				MikomOneDevice.Device.Otp(nim, tanggalLahir),
				ServerTimeout()
			])
			return {
				success: 'OTP Telah Dikirimkan.'
			}
		} catch (err) {
			if (err instanceof ServerTimeoutError) {
				return fail(422, { message: 'Server Timeout' })
			}
			return fail(422, {
				message: 'NIM & Tanggal Lahir anda tidak valid.\nGagal Mengirimkan OTP'
			})
		}
	}
}
