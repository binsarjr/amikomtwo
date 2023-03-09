import { MikomOneDevice } from '@binsarjr/apiamikomone';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, params }) => {
	const krsId = parseInt(params.krsId || '');
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';

	const response = await MikomOneDevice.Presence.Detail(access_token, apikey, krsId);
	return new Response(JSON.stringify(response));
};
