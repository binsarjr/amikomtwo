import { MikomLegacy } from '@binsarjr/apiamikomone'
import type { RequestEvent } from '@sveltejs/kit/types/private'

export const post = async (event: RequestEvent) => {
	const npm = event.url.searchParams.get('npm') || '';
	const data = Buffer.from(event.url.searchParams.get('data') || '', 'base64').toString();
	const response = await MikomLegacy.Presence.QrCode(npm, data);

	return {
		body: {
			status: response.status == 'success',
			message: response.message
		}
	};
};
