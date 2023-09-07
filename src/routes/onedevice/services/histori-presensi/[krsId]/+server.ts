/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RequestHandler } from '@sveltejs/kit';
import moment from 'moment';
import { MikomOneDevice } from '../../../../../Amikom';
import { makeObjectCache } from '../../../../../lib/supports/utils';

// import crypto from 'crypto'

export const GET: RequestHandler = async ({ url, params, setHeaders }) => {
	const krsId = parseInt(params.krsId || '');
	const access_token = url.searchParams.get('access_token')?.toString() || '';
	const apikey = url.searchParams.get('api_key')?.toString() || '';

	let response = await MikomOneDevice.Presence.Detail(access_token, apikey, krsId);
	response = response
		.map((d) => {
			// @ts-ignore
			d.TanggalMoment = moment(d.Tanggal);
			return d;
		})
		// @ts-ignore
		.sort((a, b) => b.TanggalMoment.unix() - a.TanggalMoment.unix());

	let lastModified: undefined | Date = undefined;
	if (response.length) {
		const data = response[response.length - 1];
		lastModified = new Date(`${data.Tanggal} ${data.Jam}`);
	}
	setHeaders(
		makeObjectCache({
			data: response,
			lastModified,
			maxAge: 60 * 60 * 24
		})
	);
	return new Response(JSON.stringify(response));
};
