import { error, redirect, type Actions } from '@sveltejs/kit';
import { MikomOneDevice } from '@binsarjr/apiamikomone';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const nim = formData.get('nim') as string;
		const tanggalLahir = formData.get('tanggal_lahir') as string;
		try {
			await MikomOneDevice.Device.Otp(nim, tanggalLahir);
			return {
				location: '/auth/otp',
				success: 'Data telah tervalidasi. Selanjutnya Meminta OTP'
			};
		} catch (_) {
			return error(422, { message: 'Cek NIM & Tanggal Lahir mu kembali' });
		}
	}
};
