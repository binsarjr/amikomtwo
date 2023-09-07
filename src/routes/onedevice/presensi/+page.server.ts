import { PresenceStatus } from '$Amikom/typings/Enum/Presence';
import { fail } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../Amikom';
import type { Actions } from './$types';

export const actions: Actions = {
	qrcode: async ({ request }) => {
		const formdata = await request.formData();
		const accessToken = formdata.get('access_token')?.toString() || '';
		const qrresult = formdata.get('qrcode') as string;
		const [_, response] = await Promise.all([
			new Promise((resolve) => setTimeout(resolve, 1000)), // minimal proses harus 1 detik,
			MikomOneDevice.Presence.Qrcode(accessToken, qrresult)
		]);
		if (response.status === PresenceStatus.Success) {
			return {
				success: response.message
			};
		} else {
			return fail(409, { message: response.message });
		}
	},
	manual: async ({ request }) => {
		const formdata = await request.formData();
		const accessToken = formdata.get('access_token')?.toString() || '';
		const code = formdata.get('code') as string;
		const response = await MikomOneDevice.Presence.Code(accessToken, code);
		if (response.status === PresenceStatus.Success) {
			return {
				success: response.message
			};
		} else {
			return fail(409, { message: response.message });
		}
	}
};
