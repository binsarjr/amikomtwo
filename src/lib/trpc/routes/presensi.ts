import { authAttempt } from '$lib/supports/auth'
import { sleep } from '$lib/supports/utils'
import { t } from '$lib/trpc/t'
import { MikomOneDevice } from '@binsarjr/apiamikomone'
import { PresenceStatus } from '@binsarjr/apiamikomone/lib/typings/Enum/Presence'
import { z } from 'zod'

export const presensi = t.router({
	code: t.procedure
		.input(
			z.object({
				code: z.string(),
				accounts: z
					.object({
						nim: z.string(),
						password: z.string()
					})
					.array()
			})
		)
		.query(async ({ input }) => {
			const responses: { success: boolean, message: string }[] = []
			for (const { nim, password } of input.accounts) {
				let accessToken = ''
				try {
					const { access_token } = await authAttempt(nim, password)
					accessToken = access_token
				} catch (error) {
					responses.push({
						success: false,
						message: `${nim} Gagal Login, coba minta sign yang baru`
					})
					continue
				}

				const response = await MikomOneDevice.Presence.Code(accessToken, input.code)
				responses.push({
					success: response.status === PresenceStatus.Success,
					message: `${nim} ${response.message}`
				})
				await sleep(200)
			}
			return responses

		}),
	qrcode: t.procedure
		.input(
			z.object({
				data: z.string(),
				accounts: z
					.object({
						nim: z.string(),
						password: z.string()
					})
					.array()
			})
		)
		.query(async ({ input }) => {
			const responses: { success: boolean, message: string }[] = []
			for (const { nim, password } of input.accounts) {
				let accessToken = ''
				try {
					const { access_token } = await authAttempt(nim, password)
					accessToken = access_token
				} catch (error) {
					responses.push({
						success: false,
						message: `${nim} Gagal Login, coba minta sign yang baru`
					})
					continue
				}

				const response = await MikomOneDevice.Presence.Qrcode(accessToken, input.data)
				responses.push({
					success: response.status === PresenceStatus.Success,
					message: `${nim} ${response.message}`
				})
				await sleep(200)
			}
			return responses

		})
})
