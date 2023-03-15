import { MikomOneDevice } from '@binsarjr/apiamikomone'
import { json, type RequestHandler } from '@sveltejs/kit'
import CryptoJs from 'crypto'

export const GET: RequestHandler = async ({ url, setHeaders, cookies }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || ''
	const apikey = url.searchParams.get('api_key')?.toString() || ''
	const response = await MikomOneDevice.Akademik.HasilStudi(access_token, apikey)

	const etag = CryptoJs.createHash('md5').update(JSON.stringify(response)).digest('hex')
	setHeaders({
		'ETag': etag,
		// satu bulan
		'cache-control': 'public,max-age=3600'
		// 'cache-control': 'public,max-age=2592000'
	})

	return json(response)
}
