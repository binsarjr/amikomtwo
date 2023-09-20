import { fail } from '@sveltejs/kit'
import { RequestError } from 'got'
import { authAttempt, encPassword } from '../../../lib/supports/auth'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const nim = formData.get('nim') as string
		const password = formData.get('password') as string
		try {
			const response = await authAttempt(nim, password)

			return {
				location: '/onedevice',
				success: 'Login Berhasil!',
				response,
				nim,
				password: encPassword(password)
			}
		} catch (e) {
			let message = 'NIM dan Password Tidak Valid!'
			if (e instanceof RequestError) {
				if (e.name == 'TimeoutError') {
					return fail(422, { message: 'Server Timeout' })
				}
				try {
					const resp = JSON.parse(e.response?.body as string) as { message: string }
					message = resp.message
				} catch (e) {
					console.log('kesalahan server')
				}
			}
			return fail(422, { message })
		}
		// throw redirect(303, '/onedevice');
	}
}
