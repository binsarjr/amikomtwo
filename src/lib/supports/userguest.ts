import type { IBio } from '$Amikom/typings/Response';
import { MikomSupports } from '../../Amikom';
import { privateKey } from '../config.server';
import type { UserGuest } from '../stores/userguest';
import { encPassword, getRawPassword } from './auth';

/**
 * Fungsi ini digunakan untuk mengenkripsi data mahasiswa yang disertai dengan
 * password.
 * Data mahasiswa yang dienkripsi berisi NPM, nama, dan fitur presensi.
 * Untuk mengenkripsi data tersebut, private key digunakan untuk mengenkripsi
 * data tersebut dan data dibalikkan sebelum dikembalikan.
 *
 * @param mahasiswa - data mahasiswa berisi NPM dan nama
 * @param password - password untuk mendapatkan rawPassword
 * @returns data mahasiswa yang telah dienkripsi
 */
export const encryptGuestData = (mahasiswa: IBio, password: string, device_id: string) => {
	password = getRawPassword(password);
	const rawSignature = { password, device_id, date: Date.now() };
	const signature = MikomSupports.Encryption.encrypt(JSON.stringify(rawSignature), privateKey);

	const exportdata: UserGuest = {
		nim: mahasiswa.Mhs.Npm,
		signature,
		nama: mahasiswa.Mhs.Nama,
		fitur: {
			// no used yet
			presensi: true
		}
	};

	let encrypted = JSON.stringify(exportdata);
	encrypted = encrypted.split('').reverse().join('');
	return encrypted;
};

/**
 * Fungsi untuk mendekripsi data tamu.
 * Fungsi ini menggunakan string yang diacak, memecahnya, kemudian
 * menggabungkannya kembali.
 * Kemudian, data didekripsi menggunakan kunci privat.
 * Dan akhirnya password dienkripsi lagi dengan enkripsi password.
 *
 * @param encrypted - string yang telah dienkripsi.
 * @returns objek data tamu dengan password yang telah dienkripsi.
 */
export const decryptGuestData = (encrypted: string) => {
	encrypted = encrypted.split('').reverse().join('');
	const encObject: UserGuest & {
		password: string;
		device_id: string;
	} = JSON.parse(encrypted);
	const { password, device_id } = JSON.parse(
		MikomSupports.Encryption.decrypt(encObject.signature, privateKey)
	);
	encObject.password = encPassword(password);
	if (device_id) encObject.device_id = device_id;
	return encObject;
};
