import { MikomOneDevice } from '@binsarjr/apiamikomone'
import { json, type RequestHandler } from '@sveltejs/kit'

import crypto from 'crypto'
export const GET: RequestHandler = async ({ url ,setHeaders}) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const resp = await MikomOneDevice.Mahasiswa.KtmDigital(access_token, apikey);
	const etag = crypto.createHash('md5').update(JSON.stringify(resp)).digest('hex')
	setHeaders({
		'ETag': etag,
		// satu bulan
		'cache-control': 'public,max-age=3600'
	})
	return json(resp);
};
