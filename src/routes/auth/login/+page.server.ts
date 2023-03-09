import { fail } from '@sveltejs/kit';
import { authAttempt, encPassword } from '../../../lib/supports/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const nim = formData.get('nim') as string;
		const password = formData.get('password') as string;
		try {
			const response = await authAttempt(nim, password);

			return {
				location: '/onedevice',
				success: 'Login Berhasil!',
				response,
				nim,
				password: encPassword(password)
			};
		} catch (e) {
			return fail(422, { message: 'NIM dan Password Tidak Valid!' });
		}
	}
};
