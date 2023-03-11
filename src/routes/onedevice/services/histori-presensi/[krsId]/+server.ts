import { MikomOneDevice } from '@binsarjr/apiamikomone'
import type { RequestHandler } from '@sveltejs/kit'

import crypto from 'crypto'

export const GET: RequestHandler = async ({ url, params,setHeaders }) => {
	const krsId = parseInt(params.krsId || '');
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';

	const response = await MikomOneDevice.Presence.Detail(access_token, apikey, krsId);
	const etag = crypto.createHash('md5').update(JSON.stringify(response)).digest('hex')
	setHeaders({
		'ETag': etag,
		// satu bulan
		'cache-control': 'public,max-age=2592000'
	})
	return new Response(JSON.stringify(response));
};
