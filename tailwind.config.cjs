// import konstaConfig config
const konstaConfig = require('konsta/config');

// wrap config with konstaConfig config
module.exports = konstaConfig({
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class', // 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: '#8733d6'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
});
