import { MikomOneDevice } from '@binsarjr/apiamikomone';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const hari = url.searchParams.get('hari')?.toString() || undefined;
	const bio = await MikomOneDevice.Mahasiswa.JadwalKuliah(
		access_token,
		apikey,
		typeof hari == 'undefined' ? undefined : parseInt(hari)
	);
	return new Response(JSON.stringify(bio));
};
