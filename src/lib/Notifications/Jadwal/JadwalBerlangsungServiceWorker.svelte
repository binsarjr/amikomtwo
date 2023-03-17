<script lang="ts">
	import { page } from '$app/stores'
	import { jadwal } from './../../stores/jadwal';
	import { browser } from '$app/environment';
	import Worker from './jadwal-berlangsung?worker';
	import { findJadwalBerlangsung } from '../../supports/utils';

	import Push from 'push.js';

	let jadwalWorker: Worker;
	$: if (browser && $jadwal?.length) {
		if (jadwalWorker) {
			jadwalWorker.terminate();
		}
		jadwalWorker = new Worker();
        jadwalWorker.addEventListener('message', (event) => {
				Push.create(event.data.title, {
					icon: '/favicon.png',
					body: event.data.body,
					tag: 'jadwal',
					silent: true,
					requireInteraction: true,
                   
				});
		});
		jadwalWorker.postMessage($jadwal);
	}
</script>
