import { MikomSupports } from '@binsarjr/apiamikomone';
import type { IBio } from '@binsarjr/apiamikomone/lib/typings/Response';
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
export const encryptGuestData = (mahasiswa: IBio, password: string) => {
	password = getRawPassword(password);
	const rawSignature = { password, date: Date.now() };
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
	} = JSON.parse(encrypted);
	const { password } = JSON.parse(
		MikomSupports.Encryption.decrypt(encObject.signature, privateKey)
	);
	encObject.password = encPassword(password);
	return encObject;
};
