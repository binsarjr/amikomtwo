<script lang="ts">
	import { page } from '$app/stores'
	import { jadwal } from './../../stores/jadwal';
	import { browser } from '$app/environment';
	import Worker from './jadwal-berlangsung?worker';
	import { findJadwalBerlangsung } from '../../supports/utils';

	import Push from 'push.js';

	let jadwalWorker: Worker;
    let alreadyNotified=false
	$: if (browser && $jadwal?.length) {
		if (jadwalWorker) {
			jadwalWorker.terminate();
		}
		jadwalWorker = new Worker();
        jadwalWorker.addEventListener('message', (event) => {
			if (!alreadyNotified) {

                const url = $page.url
                url.pathname='/onedevice/presensi'
				Push.create(event.data.title, {
                    link: url.toString(),
					icon: '/favicon.png',
					body: event.data.body,
					tag: 'jadwal',
					silent: true,
					requireInteraction: true,
                    // @ts-ignore
                    onClose: () => {
                        alreadyNotified=false
                    },
                    onClick: () => {
                        alreadyNotified=false
                    }
				});
                alreadyNotified=true
			}
		});
		jadwalWorker.postMessage($jadwal);
	}
</script>
