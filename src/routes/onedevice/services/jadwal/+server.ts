import type { RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../Amikom';
import { makeObjectCache } from '../../../../lib/supports/utils';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const hari = url.searchParams.get('hari')?.toString() || undefined;
	const resp = await MikomOneDevice.Mahasiswa.JadwalKuliah(
		access_token,
		apikey,
		typeof hari == 'undefined' ? undefined : parseInt(hari)
	);
	setHeaders(
		makeObjectCache({
			maxAge: 60 * 60 * 24 * 7,
			data: resp
		})
	);
	return new Response(JSON.stringify(resp));
};
