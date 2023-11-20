import { dev } from '$app/environment'
import got from 'got/dist/source'
import { UserAgent } from '../typings/Headers'

export const requestAmikomOne = got.extend({
	headers: {
		'user-agent': UserAgent,
		'X-Originating-IP': '127.0.0.1',
		'X-Forwarded-For': '127.0.0.1',
		'X-Remote-IP': '127.0.0.1',
		'X-Remote-Addr': '127.0.0.1',
		'X-Client-IP': '127.0.0.1',
		'X-Host': '127.0.0.1',
		'X-Forwared-Host': '127.0.0.1',
	},
	timeout: dev
		? {}
		: {
				request: 9_800
		  }
});
