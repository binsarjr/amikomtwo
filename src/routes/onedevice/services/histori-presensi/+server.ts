import type { RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../Amikom';

import { makeObjectCache } from '../../../../lib/supports/utils';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const semester = parseInt(url.searchParams.get('semester')?.toString() || '');
	const tahunAkademik = url.searchParams.get('tahun_akademik')?.toString() || '';

	const response = await MikomOneDevice.Presence.All(access_token, apikey, semester, tahunAkademik);

	setHeaders(
		makeObjectCache({
			data: response,
			maxAge: 60 * 60 * 24
		})
	);
	return new Response(JSON.stringify(response));
};
