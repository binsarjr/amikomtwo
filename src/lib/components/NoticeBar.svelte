<script>
	import { Page, Navbar, NavbarBackLink, Sheet, Block, Button, Toolbar, Link } from 'konsta/svelte';
	let sheetOpened = true;
</script>

<Sheet class="pb-safe" opened={sheetOpened} onBackdropClick={() => (sheetOpened = false)}>
	<Toolbar top>
		<div class="left" />
		<div class="right"><Link toolbar onClick={() => (sheetOpened = false)}>Done</Link></div>
	</Toolbar>
	<Block class="max-h-[60dvh] overflow-auto">
		<img src="/limit.png" alt="" class="mx-auto" />
		<div>
			<p>
				Untuk semua pengguna dihimbau untuk tidak melakukan spam ketika keadaan server amikom sedang
				down. Hal itu menimbulkan besarnya trafik pada platform gratis yang saya sediakan untuk
				menyediakan amikomtwo ini. ketika amikom error amikomtwo juga tentunya tidak akan berfungsi
				dengan baik karena amikomtwo juga melakukan koneksi ke server amikom
			</p>
			<p>
				Saya meminta pengertiannya bersama ya temen temen, karena jika masih melebihi batas dan
				terus melonjak.akun saya akan diberhentikan oleh platform yang saya gunakan untuk membangun
				amikomtwo ini.
			</p>
			<p>
				Kenapa tidak mencoba kerja sama dengan amikom untuk server? sudah pernah saya lakukan namun
				hasilnya nihil. Jadi saya tetap menggunakan platform gratisan.
			</p>
			<p>Jika masih melonjak. Amiomtwo akan saya berhentikan sementara.</p>
			<p>Terima kasih</p>
		</div>
		<div class="mt-4">
			<Button onClick={() => (sheetOpened = false)}>Tutup</Button>
			<small> (Pesan ini akan terus saya tampilkan untuk beberapa hari kedepan)</small>
		</div>
	</Block>
</Sheet>

<style>
	p {
		@apply mb-4;
	}
</style>
