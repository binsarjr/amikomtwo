import { fail, redirect, type Actions } from '@sveltejs/kit';
import { RequestError } from 'got';
import { MikomOneDevice } from '../../../Amikom';
import { createDeviceIdFromNpm } from '../../../lib/supports/device_is';

export const actions: Actions = {
	verify: async ({ request }) => {
		const formData = await request.formData();
		const otp = formData.get('otp') as string;
		const nim = formData.get('nim') as string;
		const device_id = createDeviceIdFromNpm(nim);

		try {
			await MikomOneDevice.Device.Verify(nim, otp, device_id);
			// return {
			// 	location: 'login',
			// 	success: 'OTP VAlid.'
			// };
		} catch (err) {
			if (err instanceof RequestError) {
				if (err.name == 'TimeoutError') {
					return fail(422, { message: 'Server Timeout' });
				}
			}
			return fail(422, { message: 'OTP Tidak valid.' });
		}
		throw redirect(303, '/auth/login');
	},
	resend: async ({ request }) => {
		const formData = await request.formData();
		const tanggalLahir = formData.get('tanggal_lahir') as string;
		const nim = formData.get('nim') as string;
		try {
			await MikomOneDevice.Device.Otp(nim, tanggalLahir);
			return {
				success: 'OTP Telah Dikirimkan.'
			};
		} catch (err) {
			if (err instanceof RequestError) {
				if (err.name == 'TimeoutError') {
					return fail(422, { message: 'Server Timeout' });
				}
			}
			return fail(422, {
				message: 'NIM & Tanggal Lahir anda tidak valid.\nGagal Mengirimkan OTP'
			});
		}
	}
};
