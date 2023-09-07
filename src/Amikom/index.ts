import { dev } from '$app/environment';
import got from 'got';
import MikomLegacy from './Legacy';
import MikomMaster from './Master';
import MikomOneDevice from './OneDevice';
import MikomSupports from './Supports';
import MikomValidation from './Supports/Validations';

import Cheerio from 'cheerio';

export const getMainContent = async (link: string) => {
	const body = await got
		.get(link, {
			timeout: dev
				? {}
				: {
						request: 9_800
				  }
		})
		.text();
	const $ = Cheerio.load(body);
	$(`.main-content a`).each((_, element) => {
		$(element).attr('target', '_blank');
	});

	return $('.main-content').html();
};

export { MikomLegacy, MikomMaster, MikomOneDevice, MikomSupports, MikomValidation };
