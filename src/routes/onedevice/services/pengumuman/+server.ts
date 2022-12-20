import Pengumuman from '@binsarjr/apiamikomone/lib/OneDevice/Pengumuman';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';

	const response = await Pengumuman(access_token);
	return json(response)
};
