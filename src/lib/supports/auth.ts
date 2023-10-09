import { MikomOneDevice, MikomSupports } from '../../Amikom'
import { privateKey } from '../config.server'
import { createDeviceIdFromNpm } from './device_is'

/**
 * Mendapatkan password raw dari parameter input.
 * Fungsi ini menggunakan regular expression untuk memvalidasi password.
 * Jika password tidak valid, akan melakukan dekripsi password dengan
 * menggunakan kunci private.
 *
 * @param password - password untuk diekstrak.
 * @returns password raw.
 */
export const getRawPassword = (password: string) => {
	try {
		const validPassword = /^[\w\d]{5}$/i.test(password)
		if (!validPassword)
			// maybe encrypted
			password = MikomSupports.Encryption.decrypt(password, privateKey)
		// eslint-disable-next-line no-empty
	} catch (ex) { }
	return password
}

export const encPassword = (password: string) =>
	MikomSupports.Encryption.encrypt(password, privateKey)

export const authAttempt = async (nim: string, password: string, device_id?: string) => {
	password = getRawPassword(password)

	return MikomOneDevice.Auth(nim, password, device_id || createDeviceIdFromNpm(nim))
}
