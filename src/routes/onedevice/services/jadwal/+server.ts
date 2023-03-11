import { MikomOneDevice } from '@binsarjr/apiamikomone'
import type { RequestHandler } from '@sveltejs/kit'



export const GET: RequestHandler = async ({ url,setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const hari = url.searchParams.get('hari')?.toString() || undefined;
	const resp = await MikomOneDevice.Mahasiswa.JadwalKuliah(
		access_token,
		apikey,
		typeof hari == 'undefined' ? undefined : parseInt(hari)
	);
	// const etag = crypto.createHash('md5').update(JSON.stringify(resp)).digest('hex')
	// setHeaders({
	// 	'ETag': etag,
	// 	// satu bulan
	// 	'cache-control': 'public,max-age=2592000'
	// })
	return new Response(JSON.stringify(resp));
};
