import { json, type RequestHandler } from '@sveltejs/kit';
import { MikomOneDevice } from '../../../../Amikom';
import { makeObjectCache } from '../../../../lib/supports/utils';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const access_token = url.searchParams.get('access_token')?.toString() || '';

	const response = await MikomOneDevice.Pengumuman(access_token);

	setHeaders(
		makeObjectCache({
			data: response,
			maxAge: 60 * 60
		})
	);
	return json(response.results);
};
