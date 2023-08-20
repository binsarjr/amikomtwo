import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import got from 'got';

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	const request = got.extend({
		prefixUrl: 'https://ds.amikom.ac.id',
		headers: {
			'user-agent': '@m!k0mXv=#neMob!le'
		}
	});
	return {
		request
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
