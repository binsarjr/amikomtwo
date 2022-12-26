/**
 * Membuat sebuah fungsi yang dapat membuat pemanggilnya tertunda selama waktu
 * yang telah ditentukan.
 *
 * @param ms - waktu dalam miliseconds untuk berapa lama fungsi ini akan
 * menunggu.
 * @returns Promise yang akan dipanggil setelah waktu selesai.
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mengembalikan sebuah bilangan acak yang berada diantara nilai minimum dan
 * maksimum.
 *
 * @param min - Nilai minimum.
 * @param max - Nilai maksimum.
 * @returns Bilangan acak antara min dan max.
 */
export const randomBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);
