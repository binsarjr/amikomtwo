import { toast } from '@zerodevx/svelte-toast'

export const success = (m:string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': '#22c55e',
			'--toastColor': 'white',
			'--toastBarBackground': 'none'
		}
	});

export const warning = (m:string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': '#eab308',
			'--toastColor': 'white',
			'--toastBarBackground': 'none'
		}
	});

export const failure = (m:string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': '#ef4444',
			'--toastColor': 'white',
			'--toastBarBackground': 'none'
		}
	});
