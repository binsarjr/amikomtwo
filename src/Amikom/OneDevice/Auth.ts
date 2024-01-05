import { requestAmikomOne } from '$Amikom/Supports/request';
import { ContentType } from '../typings/Headers';
import type { ResponseAuth } from '../typings/Response';

/**
 * Authenticate OneDevice hanya bisa satu deviceId
 * Pastikan device id sudah terdaftar
 * Flow: `Device.Otp => Device.Verify => Auth`
 * Gunakan: `Device.Reset``
 * Untuk meng whapus deviceId
 */
export default (npm: string, password: string, deviceId: string): Promise<ResponseAuth> =>
	requestAmikomOne
		.post('https://ds.amikom.ac.id/api/amikomone/auth', {
			headers: {
				'content-type': ContentType.FormEncoded,
				// 'user-agent': UserAgent,
				'user-agent': 'okhttp/5.0.0-alpha.2'
			},
			form: { user_id: npm, password, device_id: deviceId }
		})
		.json();
