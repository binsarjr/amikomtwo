module.exports = {
 	apps: [
		{
			name: 'amikomtwo',
			script: 'build/index.js',
			instances: '1',
			exec_mode: 'fork',
			env: {
				API_BASEURL: 'https://api.bakoelkarcis.com',
				ORIGIN: 'http://104.168.76.102:8003',
				PORT: 8003,
				// HOST: '127.0.0.1'
			}
		}
	]
};
