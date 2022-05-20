<script lang="ts">
	// @ts-ignore
	import InternetConnection from 'svelte-internet-connection';
</script>

<InternetConnection let:online>
	<section>
		{#if online}
			<section class="font-bold px-4 py-1 text-center" id="online">
				<p class="text-md text-slate-100">Yeay, kamu online! Selamat datang</p>
			</section>
		{:else}
			<section class="font-bold px-4 py-1 text-center" id="offline">
				<p class="text-md text-slate-100">
					Saat ini kamu sedang offline. Aplikasi hanya bisa digunakan ketika online
				</p>
			</section>
		{/if}
	</section>
</InternetConnection>

<style lang="scss">
	section {
		position: fixed;
		z-index: 9999999999999999;
		top: 0;
		left: 0;
		right: 0;
		min-height: 2rem;

		display: flex;
		justify-content: center;
		align-items: center;

		@keyframes onlineTimeout {
			from {
				top: 0;
			}
			to {
				top: -100px;
			}
		}
		#online {
			background-color: #55a630;
			animation-name: onlineTimeout;
			animation-delay: 1.5s;
			animation-duration: 1s;
			animation-fill-mode: forwards;
		}

		#offline {
			top: 0;
			background-color: #bc4749;
		}
	}
</style>
