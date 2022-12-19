<script lang="ts">
	import { List, ListItem } from 'konsta/svelte';
	import { usersGuest, type UserGuest } from '../../stores/userguest';
	// export let sources: UserGuest[] = [];
	export let active = false;
	export let activeSources: UserGuest[] = [];

	$: if ($usersGuest) {
		activeSources = $usersGuest;
	}

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
			<ListItem header="Tamu {i + 1}" subtitle={guest.nim} title={guest.nama} />
		</div>
	{/each}
</List>
