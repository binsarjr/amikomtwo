import { json, type RequestHandler } from '@sveltejs/kit';
import { authAttempt } from '../../../../lib/supports/auth';

export const POST: RequestHandler = async ({ request }) => {
	const formdata = await request.formData();
	const nim = formdata.get('nim')?.toString() || '';
	const password = formdata.get('password')?.toString() || '';
	try {
		const response = await authAttempt(nim, password);
		return new Response(JSON.stringify(response));
	} catch (error: any) {
		const code = error.response?.statusCode as number;
		if ((code || '').toString().startsWith('4')) {
			return json(JSON.parse(error.response.body), {
				status: code
			});
		}
		throw error;
	}
};
