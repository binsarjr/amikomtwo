import { json } from '@sveltejs/kit';
import { decryptGuestData } from '../../../lib/supports/userguest';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formdata = await request.formData();
		let encrypted = formdata.get('guest') as string;

		return json(decryptGuestData(encrypted));
	} catch (error) {
		return json(
			{ status: 'failed' },
			{
				status: 409
			}
		);
	}
};
