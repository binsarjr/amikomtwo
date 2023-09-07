import type { RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../Amikom';

import { makeObjectCache } from '../../../../lib/supports/utils';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';
	const bio = await MikomOneDevice.Mahasiswa.Bio(access_token, apikey);

	setHeaders(
		makeObjectCache({
			data: bio,
			// tujuh hari
			maxAge: 60 * 60 * 24 * 7
		})
	);

	return new Response(JSON.stringify(bio));
};
