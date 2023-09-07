/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck: just  no
import forge from 'node-forge';

export const KEY: unknown = Buffer.from('knsHASZkE6wQtSAZNJgI3pJ7BwEmZBOs', 'base64');

export default {
	hexToString: function (hex: string) {
		hex = hex.toString();
		let str = '';

		for (let n = 0; n < hex.length; n += 2) {
			str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
		}
		return str;
	},
	encrypt: function (plain_text: string, key?: any) {
		if (!key) key = KEY;
		const cipher = forge.cipher.createCipher('3DES-ECB', key);
		cipher.start({
			iv: ''
		});
		// @ts-ignore
		cipher.update(forge.util.createBuffer(plain_text, 'utf-8'));
		cipher.finish();

		const encrypted = cipher.output;

		return forge.util.encode64(encrypted.getBytes());
	},
	decrypt: function (encrypted_text: string, key?: any) {
		if (!key) key = KEY;
		const decipher = forge.cipher.createDecipher('3DES-ECB', key);
		encrypted_text = forge.util.decode64(encrypted_text);
		decipher.start({
			iv: ''
		});
		// @ts-ignore
		decipher.update(forge.util.createBuffer(encrypted_text, 'utf-8'));
		decipher.finish();

		const decrypted = decipher.output;

		return this.hexToString(decrypted.toHex());
	}
};
