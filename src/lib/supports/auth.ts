import { MikomOneDevice, MikomSupports } from '@binsarjr/apiamikomone';
import { privateKey } from '../config';
import { createDeviceIdFromNpm } from './device_is';

export const getRawPassword = (password: string) => {
	try {
		const validPassword = /^[\w\d]{5}$/i.test(password);
		if (!validPassword)
			// maybe encrypted
			password = MikomSupports.Encryption.decrypt(password, privateKey);
	} catch (ex) {}
	return password;
};

export const encPassword = (password: string) =>
	MikomSupports.Encryption.encrypt(password, privateKey);

export const authAttempt = async (nim: string, password: string) => {
	password = getRawPassword(password);

	return MikomOneDevice.Auth(nim, password, createDeviceIdFromNpm(nim));
};
