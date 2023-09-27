<script lang="ts">
	import { networkStatus } from '$lib/components/PWA/store';
	import { createEventDispatcher } from 'svelte';

	export let isOnline = false;
	$: isOnline = $networkStatus == 'online';
	$: isOffline = $networkStatus == 'offline' || $networkStatus == 'no connectivity';

	const dispatch = createEventDispatcher();
	$: if (isOffline) dispatch('offline');

	function handleConnection() {
		if (navigator.onLine) {
			$networkStatus = 'online';

			isReachable(getServerUrl())
				.then(function (online) {
					if (online) {
						// handle online status
						$networkStatus = 'online';
					} else {
						$networkStatus = 'no connectivity';
					}
				})
				.catch(() => {
					$networkStatus = 'no connectivity';
				});
		} else {
			// handle offline status
			$networkStatus = 'offline';
		}
	}

	function isReachable(url: string) {
		/**
		 * Note: fetch() still "succeeds" for 404s on subdirectories,
		 * which is ok when only testing for domain reachability.
		 *
		 * Example:
		 *   https://google.com/noexist does not throw
		 *   https://noexist.com/noexist does throw
		 */
		return fetch(url, { method: 'HEAD', mode: 'no-cors' })
			.then(function (resp) {
				return resp && (resp.ok || resp.type === 'opaque');
			})
			.catch(function (err) {
				console.warn('[conn test failure]:', err);
			});
	}

	function getServerUrl() {
		return window.location.origin;
	}

	$networkStatus = navigator.onLine ? 'online' : 'offline';
	window.addEventListener('online', handleConnection);
	window.addEventListener('offline', handleConnection);
</script>

{#if isOffline}
	<slot />
{/if}
