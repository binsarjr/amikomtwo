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
	const onClick = (indexSource: number) => {
		if (!active) return;
		if (activeSources.includes($usersGuest[indexSource])) {
			activeSources = activeSources.filter((source) => source != $usersGuest[indexSource]);
		} else {
			activeSources[activeSources.length] = $usersGuest[indexSource];
		}
	};
</script>

<List>
	{#each $usersGuest as guest, i}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class:cursor-pointer={active}
			class:opacity-50={!activeSources.includes(guest)}
			on:click={() => onClick(i)}
		>
			<!-- <ListItem header="Tamu {i + 1}" subtitle={'12.34.567' + i} title={'NAMA ' + i} /> -->
			<ListItem header="Tamu {i + 1}" subtitle={guest.nim} title={guest.nama} />
		</div>
	{/each}
</List>
