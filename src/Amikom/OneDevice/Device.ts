import { requestAmikomOne } from '$Amikom/Supports/request'
import { ContentType } from '../typings/Headers'
import type { ResponseResult } from '../typings/Response'

/**
 * OneDevice hanya bisa satu deviceId
 * Flow: `Device.Otp => Device.Verify => Auth`
 * Gunakan: `Device.Reset``
 * Untuk meng whapus deviceId
 */
export default {
	/**
	 * Meminta OTP untuk dilanjutkan ke verify(Mendaftarkan deviceId)
	 */
	Otp: (npm: string, tglLahir: string): Promise<ResponseResult> =>
		requestAmikomOne
			.post('https://ds.amikom.ac.id/api/amikomone/device/otp', {
				headers: {
					'content-type': ContentType.FormEncoded,
					'user-agent': 'okhttp/5.0.0-alpha.2',
				},
				form: {
					npm,
					tgl_lahir: tglLahir,
					virtual_host: "request_otp"
				}
			})
			.json(),
	/**
	 * Memverifikasi OTP dan mendaftar deviceId digunakan untuk request Autentikasi
	 */
	Verify: (npm: string, otp: string, deviceId: string): Promise<ResponseResult> =>
		requestAmikomOne
			.post('https://ds.amikom.ac.id/api/amikomone/device/register', {
				headers: {
					'content-type': ContentType.FormEncoded,
					'user-agent': 'okhttp/5.0.0-alpha.2',
				},
				form: {
					npm,
					otp,
					device_id: deviceId
				}
			})
			.json(),
	/**
	 * Menghapus deviceId yang sudah diverifikasi/daftarkan
	 */
	Reset: (npm: string, deviceId: string): Promise<ResponseResult> =>
		requestAmikomOne
			.post('https://ds.amikom.ac.id/api/amikomone/device/reset', {
				searchParams: {
					npm,
					device_id: deviceId
				}
			})
			.json()
}
