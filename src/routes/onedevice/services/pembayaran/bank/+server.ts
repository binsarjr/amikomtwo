import { MikomOneDevice } from '@binsarjr/apiamikomone';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const resp = await MikomOneDevice.Payment.Bank(access_token);
	return json(resp)
};
