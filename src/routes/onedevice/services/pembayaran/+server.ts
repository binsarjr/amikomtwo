import type { RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../Amikom';

export const GET: RequestHandler = async ({ url }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const bio = await MikomOneDevice.Payment.TicketHistory(access_token, apikey);
	return new Response(JSON.stringify(bio));
};
