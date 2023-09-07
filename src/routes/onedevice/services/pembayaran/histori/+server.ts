import { json, type RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../../Amikom';

export const GET: RequestHandler = async ({ url }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const resp = await MikomOneDevice.Payment.History(access_token, apikey);
	return json(resp);
};
