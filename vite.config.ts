import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
	define: {
		'process.env.NODE_ENV': '"production"',
	},
	plugins: [
		sveltekit(),
		Icons({
			// experimental
			autoInstall: true
		})
	]
}

export default config
