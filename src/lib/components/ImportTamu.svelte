<script lang="ts">
	import { usersGuest, type UserGuest } from '$lib/stores/userguest';
	import { Block, Button } from 'konsta/svelte';
	import toast from 'svelte-french-toast';
	let files: FileList;

	const onChange = () => {

		const id = toast.loading("Memverifikasi")
		for (const file of files) {
			file.text().then(async (rawcontent) => {
				const formdata = new FormData();

				formdata.set('guest', rawcontent);
				const r = await fetch('/import/verify', {
					method: 'POST',
					body: formdata
				});
				if (r.status == 200) {
					const user: UserGuest = await r.json();

					toast.success('User ('+user.nim+') berhasil diimport');

					$usersGuest = $usersGuest.filter((guest) => guest.nim != user.nim);
					$usersGuest[$usersGuest.length] = user;
				} else {
					toast.error('Import Gagal');
				}
			});
		}
		toast.success("Verifikasi selesai", {id})
	};
</script>

<Block insetIos>
	<input
		type="file"
		bind:files
		on:change={onChange}
		id="tamuimport"
		name="import"
		class="hidden"
		multiple
	/>

	<Button
		largeIos
		onClick={function () {
			document.getElementById('tamuimport')?.click();
		}}>Impor Tamu Baru</Button
	>
</Block>
