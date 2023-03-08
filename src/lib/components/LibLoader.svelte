<script lang="ts">
	import { browser } from '$app/environment';

	export let url: string;
</script>

{#if browser}
	<script  on:load on:error src={url}></script>
{/if}