import { getMainContent } from '$Amikom';
import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 60 * 60
	}
};

export const load: PageServerLoad = async ({ params }) => {
	return {
		content: getMainContent(`https://daak.amikom.ac.id/page/${params.page}`)
	};
};
