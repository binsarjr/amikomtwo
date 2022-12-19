import { MikomSupports } from '@binsarjr/apiamikomone';
import type { IBio } from '@binsarjr/apiamikomone/lib/typings/Response';
import { privateKey } from '../config';
import type { UserGuest } from '../stores/userguest';
import { encPassword, getRawPassword } from './auth';

export const encryptGuestData = (mahasiswa: IBio, password: string) => {
	password = getRawPassword(password);
	let rawSignature = { password, date: Date.now() };
	let signature = MikomSupports.Encryption.encrypt(JSON.stringify(rawSignature), privateKey);

	let exportdata: UserGuest = {
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

export const decryptGuestData = (encrypted: string) => {
	encrypted = encrypted.split('').reverse().join('');
	let encObject: UserGuest & {
		password: string;
	} = JSON.parse(encrypted);
	const { password } = JSON.parse(
		MikomSupports.Encryption.decrypt(encObject.signature, privateKey)
	);
	encObject.password = encPassword(password);
	return encObject;
};
