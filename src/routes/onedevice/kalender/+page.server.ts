import { getMainContent } from '$lib/supports/utils';
import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 60 * 60 * 24
	}
};

export const load: PageServerLoad = async () => {
	return {
		content: await getMainContent('https://daak.amikom.ac.id/page/kalender-akademik')
	};
};
