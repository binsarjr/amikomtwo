<script lang="ts">
	import type { Pengumuman } from '$Amikom/typings/Response';
	import { Page } from 'konsta/svelte';
	export let pengumuman: Pengumuman;
	let show = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cursor-pointer" on:click={() => (show = !show)}>
	<img src="data:image/png;base64,{pengumuman.gambar}" alt="" />
</div>

{#if show}
	<div style="word-wrap: break-word;">
		<h2 class="text-lg font-semibold">{pengumuman.title}</h2>
		{@html pengumuman.pengumuman}
	</div>
{/if}
