import { randomBetween, sleep } from '$lib/supports/utils'
import { MikomOneDevice } from '@binsarjr/apiamikomone'
import { PresenceStatus } from '@binsarjr/apiamikomone/lib/typings/Enum/Presence'
import { json, type RequestHandler } from '@sveltejs/kit'
import { authAttempt } from '../../../../lib/supports/auth'

export const POST: RequestHandler = async ({ request }) => {
	const formdata = await request.formData();

	const allPassword = formdata.getAll('password');
	const code = formdata.get('code')?.toString() || '';
	const results = await Promise.all(
		formdata.getAll('nim').map(async (value, i) => {
			const nim = value.toString();
			const password = allPassword[i].toString();

			let accessToken = '';
			try {
				const { access_token } = await authAttempt(nim, password);
				accessToken = access_token;
			} catch (error) {
				return {
					success: false,
					message: `${nim} Gagal Login, coba minta sign yang baru`
				};
			}

			await sleep(randomBetween(100, 1000))

			const response = await MikomOneDevice.Presence.Code(accessToken, code);
			return {
				success: response.status === PresenceStatus.Success,
				message: `${nim} ${response.message}`
			};
		})
	);
	return json(results);
};
