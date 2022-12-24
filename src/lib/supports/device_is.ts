export const generateDeviceId = () => {
	let result = '';
	const characters = '10';
	const charactersLength = characters.length;
	for (let i = 0; i < 64; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return parseInt(result, 2).toString(16).toUpperCase();
};

/**
 * Membuat device ID dari npm (Nomor Induk Mahasiswa).
 * Ini berfungsi untuk mengkonversi nomor npm ke dalam bentuk device ID dalam
 * biner dan heksadesimal.
 * 
 * @param npm - NPM yang akan dikonversi.
 * @returns device ID dalam bentuk heksadesimal.
 */
export const createDeviceIdFromNpm = (npm: string) => {
	const [tahun, prodi, urutan] = npm.split('.', 3);

	// 12.34.5678
	// 12345678
	npm = npm.replace(/\./g, '');
	// 12345678 to biner
	const binary = parseInt(npm, 16).toString(2);
	let targetBinary =
		parseInt(tahun, 10).toString(2) +
		binary +
		parseInt(prodi, 10).toString(2) +
		parseInt(urutan, 10).toString(2) +
		binary;

	targetBinary = targetBinary.substring(0, 64);
	return parseInt(targetBinary, 2).toString(16).toUpperCase();
};
