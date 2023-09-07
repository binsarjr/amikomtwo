import { dev } from '$app/environment';
import got from 'got/dist/source';
import { UserAgent } from '../typings/Headers';

export const requestAmikomOne = got.extend({
	headers: {
		'user-agent': UserAgent
	},
	timeout: dev
		? {}
		: {
				request: 9_800
		  }
});
