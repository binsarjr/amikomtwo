<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { List, ListItem } from 'konsta/svelte';
	import { usersGuest, type UserGuest } from '../../stores/userguest';
	export let active = false;
	export let activeSources: UserGuest[] = [];
	export let except: UserGuest[] = [];

	$: if ($usersGuest) {
		activeSources = $usersGuest;
	}

	$: activeSources = activeSources.filter((source) => !except.includes(source));
	afterNavigate(() => {
		activeSources = activeSources.filter((source) => !except.includes(source));
	});

	let checkboxs: boolean[] = [];
	const onClick = (indexSource: number) => {
		if (!active) return;
		checkboxs[indexSource] = !checkboxs[indexSource];
		if (activeSources.includes($usersGuest[indexSource])) {
			activeSources = activeSources.filter((source) => source != $usersGuest[indexSource]);
		} else {
			activeSources[activeSources.length] = $usersGuest[indexSource];
		}
	};
</script>

{#if active}<List insetIos>
		{#each $usersGuest as guest, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class:cursor-pointer={active}
				class:opacity-50={!activeSources.includes(guest)}
				on:click={() => onClick(i)}
				class="flex-grow"
				title="Ketuk 2 kali untuk menghapus"
			>
				<ListItem header="Tamu {i + 1}" subtitle={guest.nim} title={guest.nama}>
					<span
						slot="after"
						class="bg-red-500 px-2 py rounded text-white text-sm font-semibold"
						on:dblclick={() => {
							$usersGuest = $usersGuest.filter((d) => d != guest);
						}}>Ketuk 2x Untuk Hapus</span
					>
				</ListItem>
			</div>
		{/each}
	</List>
{:else}
	<List>
		{#each $usersGuest as guest, i}
			<ListItem header="Tamu {i + 1}" subtitle={guest.nim} title={guest.nama} />
		{/each}
	</List>
{/if}
