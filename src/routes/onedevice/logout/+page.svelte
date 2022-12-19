<script>
	import { browser } from '$app/environment';
	import { authUser } from '$lib/stores/preferences';

	$: if (browser) {
		$authUser = null;
	}
</script>
