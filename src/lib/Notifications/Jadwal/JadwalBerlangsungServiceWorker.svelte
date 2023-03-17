<script lang="ts">
	import { jadwal } from './../../stores/jadwal';
	import { browser } from '$app/environment';
	import Worker from './jadwal-berlangsung?worker';
	import { findJadwalBerlangsung } from '../../supports/utils';

	import Push from 'push.js';

	let jadwalWorker: Worker;
	$: if (browser && $jadwal.length) {
		if (jadwalWorker) {
			jadwalWorker.terminate();
		}
		jadwalWorker = new Worker();
		jadwalWorker.postMessage($jadwal);
        jadwalWorker.addEventListener('message', (event) => {
			if (event.data.id !== JSON.stringify(findJadwalBerlangsung($jadwal))) {
				Push.create(event.data.title, {
					icon: '/favicon.png',
					body: event.data.body,
					tag: 'jadwal',
					silent: true,
					requireInteraction: true
				});
			}
		});
	}
</script>
