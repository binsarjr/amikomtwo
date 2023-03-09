import { MikomOneDevice } from '@binsarjr/apiamikomone';
import { error, type Actions } from '@sveltejs/kit';
import { createDeviceIdFromNpm, generateDeviceId } from '../../../lib/supports/device_is';

export const actions: Actions = {
	verify: async ({ request }) => {
		const formData = await request.formData();
		const otp = formData.get('otp') as string;
		const nim = formData.get('nim') as string;
		const device_id = createDeviceIdFromNpm(nim);

		try {
			await MikomOneDevice.Device.Verify(nim, otp, device_id);
			return {
				location: 'login',
				success: 'OTP VAlid.'
			};
		} catch (_) {
			return error(422, { message: 'OTP Tidak valid.' });
		}
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
		} catch (_) {
			return error(422, {
				message: 'NIM & Tanggal Lahir anda tidak valid.\nGagal Mengirimkan OTP'
			});
		}
	}
};
