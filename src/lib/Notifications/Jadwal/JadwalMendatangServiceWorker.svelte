<script lang="ts">
	import { page } from '$app/stores'
	import { jadwal } from '../../stores/jadwal';
	import { browser } from '$app/environment';
	import Worker from './jadwal-mendatang?worker';

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
					tag: 'jadwal-mendatang',
					requireInteraction: true,
                   
				});
		});
		jadwalWorker.postMessage($jadwal);
	}
</script>
