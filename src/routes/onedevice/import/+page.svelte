<script lang="ts">
	import { usersGuest, type UserGuest } from '$lib/stores/userguest';
	import {
		Block,
		BlockTitle,
		Button,
		List,
		ListItem,
		Navbar,
		NavbarBackLink,
		Page
	} from 'konsta/svelte';
	import toast from 'svelte-french-toast';
	import { mahasiswa } from '../../../lib/stores/mahasiswa';
	let files: FileList;

	const onChange = () => {
		files[0].text().then(async (rawcontent) => {
			const formdata = new FormData();

			formdata.set('guest', rawcontent);
			const r = await fetch('/onedevice/import/verify', {
				method: 'POST',
				body: formdata
			});
			if (r.status == 200) {
				const user: UserGuest = await r.json();

				if (user.nim == $mahasiswa!.Mhs.Npm) {
					toast.error('Tidak bisa mengimport diri sendiri');
				} else {
					toast.success('User berhasil diimport');
					$usersGuest = $usersGuest.filter((guest) => guest.nim != user.nim);
					$usersGuest[$usersGuest.length] = user;
				}
			} else {
				toast.error('Import Gagal');
			}
		});
	};

	// const listFitur = (user: UserGuest) => {
	// 	if (!user.fitur) return '';
	// 	return Object.keys(user.fitur)
	// 		.map((key) => {
	// 			console.log(user.fitur, key);
	// 			// @ts-ignore
	// 			if (user.fitur[key]) return key;
	// 		})
	// 		.filter(Boolean)
	// 		.join(', ');
	// };
</script>

<Page>
	<Navbar title="Amikom TWO">
		<NavbarBackLink slot="left" text="Back" href="/onedevice/profile" component="a" />
	</Navbar>
	<BlockTitle>List Tamu</BlockTitle>
	<Block insetIos>
		<input
			type="file"
			bind:files
			on:change={onChange}
			id="tamuimport"
			name="import"
			class="hidden"
		/>

		<Button
			largeIos
			onClick={function () {
				document.getElementById('tamuimport')?.click();
			}}>Impor Tamu Baru</Button
		>
	</Block>
	<List>
		{#each $usersGuest as guest, i}
			<ListItem header="Tamu {i + 1}" subtitle={guest.nim} title={guest.nama} />
			<!-- <ListItem
				header="Tamu {i + 1}"
				subtitle={guest.nim}
				title={guest.nama}
				footer="Fitur: {listFitur(guest)}"
			/> -->
		{/each}
	</List>
</Page>
