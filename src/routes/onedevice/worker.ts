setInterval(() => {
	const now = new Date();
	if (now.getHours() == 7 && now.getMinutes() == 0 && now.getSeconds() == 0) {
		postMessage('');
	}
}, 1000);
