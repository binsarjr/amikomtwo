import got from 'got/dist/source';
import { ContentType, UserAgent } from '../typings/Headers';
import { ResponseAuthLegacy } from '../typings/Response';

export default (npm: string, password: string): Promise<ResponseAuthLegacy> =>
	got
		.post('http://mhsmobile.amikom.ac.id/login', {
			headers: {
				'user-agent': UserAgent,
				'content-type': ContentType.FormEncoded
			},
			form: {
				username: npm,
				keyword: password
			}
		})
		.json();
