import type { IBio } from '$Amikom/typings/Response';
import type { RequestHandler } from '@sveltejs/kit';
import { encryptGuestData } from '../../../lib/supports/userguest';

export const GET: RequestHandler = async ({ setHeaders, url }) => {
	const password = url.searchParams.get('password') as string;
	const mahasiswa = JSON.parse(
		decodeURIComponent(url.searchParams.get('mahasiswa') as string).toString()
	) as IBio;
	const filename = `amikomtwo-signature-${mahasiswa.Mhs.Npm}`;
	setHeaders({
		'Content-Disposition': 'attachment; filename=' + filename + '.signature.txt'
	});

	const encrypted = encryptGuestData(mahasiswa, password);
	return new Response(encrypted);
};
