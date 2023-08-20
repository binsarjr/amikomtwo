import { getMainContent } from '$lib/supports/utils';
import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 60 * 60
	}
};

export const load: PageServerLoad = async ({ params }) => {
	return {
		content: await getMainContent(`https://daak.amikom.ac.id/page/${params.page}`)
	};
};
