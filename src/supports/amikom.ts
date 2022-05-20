export const QrCodePrecense = async (npm: string, data: string) => {
	const response = await fetch('http://202.91.9.14:6000/api/presensi_mobile/validate_qr_code', {
		method: 'post',
		headers: {
			'user-agent': '@m!k0mXv=#neMob!le',
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			data: `${data};${npm}`
		})
	});
	if (response.status == 200) {
		return {
			status: true,
			message: 'Presensi berhasil'
		};
	} else if (response.status == 422) {
		return {
			status: false,
			message: 'Anda sudah melakukan presensi'
		};
	} else {
		return {
			status: false,
			message: 'Gagal presensi'
		};
	}
};
