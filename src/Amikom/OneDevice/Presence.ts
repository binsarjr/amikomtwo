import { requestAmikomOne } from '$Amikom/Supports/request';
import moment from 'moment';
import Encryption from '../Supports/Encryption';
import Tokenizer from '../Supports/Tokenizer';
import { PresenceMessage, PresenceStatus } from '../typings/Enum/Presence';
import { ContentType } from '../typings/Headers';
import type { IPresence, IPresenceDetail, ResponsePresence } from '../typings/Response';

const makeRawSignature = function (nim: string, kode: string) {
	moment.locale('id');
	const format = `${nim.charAt(0)}${nim.charAt(4)}${nim.charAt(6)}${nim.charAt(8)}`;
	const format2 = moment().format('DD');
	const str = parseInt(format2) * parseInt(format);
	const str2 = str + format;

	let i2 = 0;
	const length = str2.length;
	if (length > 0) {
		let i3 = 0;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const i4 = i2 + 1;
			i3 += parseInt(str2.charAt(i2));
			if (i4 >= length) {
				break;
			}
			i2 = i4;
		}
		i2 = i3;
	}

	return `${kode};${nim};${str}-${i2}`;
};

export default {
	/**
	 * Presensi qrcode
	 * Untuk gambar silakan diolah sendiri untuk mendapatkn result qrcodenya
	 */
	Qrcode: async (
		bearerToken: string,
		data: string,
		location = 'Amikom'
	): Promise<ResponsePresence> => {
		try {
			await requestAmikomOne
				.post('https://ds.amikom.ac.id/api/amikomone/presensi_mobile/validate_qr_code', {
					headers: {
						Authorization: `Bearer ${bearerToken}`,
						'content-type': ContentType.Json
					},
					json: {
						data: `${data};${Tokenizer(bearerToken).npm}`,
						location
					}
				})
				.json();
			return {
				status: PresenceStatus.Success,
				message: PresenceMessage.Success
			};
		} catch (e: any) {
			const statusCode = Number((e as any).response!.statusCode);
			if (!statusCode.toString().startsWith('4')) throw new Error(e);
			return statusCode == 422
				? {
						status: PresenceStatus.ResourceAlreadyExists,
						message: PresenceMessage.ResourceAlreadyExists
				  }
				: {
						status: PresenceStatus.Failed,
						message: PresenceMessage.Failed
				  };
		}
	},
	/**
	 * Presensi kode 5 digit
	 */
	Code: async (
		bearerToken: string,
		code: string,
		location = 'Amikom'
	): Promise<ResponsePresence> => {
		try {
			await requestAmikomOne
				.post('https://ds.amikom.ac.id/api/amikomone/presensi_mobile/validate_ticket', {
					headers: {
						Authorization: `Bearer ${bearerToken}`,
						'content-type': ContentType.Json
					},
					json: {
						data: Encryption.encrypt(makeRawSignature(Tokenizer(bearerToken).npm || '', code)),
						location
					}
				})
				.json();
			return {
				status: PresenceStatus.Success,
				message: PresenceMessage.Success
			};
		} catch (e: any) {
			const statusCode = Number((e as any).response!.statusCode);
			if (!statusCode.toString().startsWith('4')) throw new Error(e);
			return statusCode == 422
				? {
						status: PresenceStatus.ResourceAlreadyExists,
						message: PresenceMessage.ResourceAlreadyExists
				  }
				: {
						status: PresenceStatus.Failed,
						message: PresenceMessage.Failed
				  };
		}
	},
	/**
	 * Rekap Presensi
	 */
	All: (
		bearerToken: string,
		xApiKey: string,
		semester: number,
		tahunAkademik: string
	): Promise<IPresence[]> =>
		requestAmikomOne
			.post('https://ds.amikom.ac.id/api/amikomone/academic/presensi/rekap', {
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					'X-Api-Key': xApiKey,
					'content-type': ContentType.FormEncoded
				},
				form: {
					semester,
					tahun_akademik: tahunAkademik
				}
			})
			.json(),
	/**
	 * Detail Presensi (keterangan waktu presensi berdasarkan krs/matkul)
	 */
	Detail: (bearerToken: string, xApiKey: string, krsId: number): Promise<IPresenceDetail[]> =>
		requestAmikomOne
			.post('https://ds.amikom.ac.id/api/amikomone/academic/presensi/kuliah', {
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					'X-Api-Key': xApiKey,
					'content-type': ContentType.FormEncoded
				},
				form: {
					krs_id: krsId
				}
			})
			.json()
};
