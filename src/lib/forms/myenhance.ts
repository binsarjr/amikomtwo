/* eslint-disable @typescript-eslint/ban-types */
import { applyAction } from '$app/forms'
import { goto } from '$app/navigation'
import { id } from '$lib/forms/store'
import toast from 'svelte-french-toast'
import { get } from 'svelte/store'
export const myenhance =
	<Data = any>({
		done,
		success,
		loadingMsg = 'Sedang Diproses. Mohon menunggu'
	}: Partial<{ done: Function; success: (data: Data) => void; loadingMsg: string }> = {}) =>
		({ form, data, action, cancel }: any) => {
			if (get(id) != '') {
				toast.error("Tolong jangan spam :)")
				return
			}
			id.set(toast.loading(loadingMsg))
			return async ({ result, update }: any) => {
				const _id = get(id)
				if (result.type === 'failure') {
					toast.error(result.data?.message, { id: _id, })
					id.set('')
				}
				else if (result.type === 'success') {
					toast.success(result.data?.success, { id: _id })
					id.set('')
					if (success) success(result.data)
					// if succes and have location key,that mean server want redirect
					if (result.data?.location) {
						if (done)
							update(() => {
								done()
							})
						await applyAction(result)

						id.set('')
						return goto(result.data.location)
					}
				} else {
					if (done)
						update(() => {
							done()
						})
					await applyAction(result)
					id.set('')
					toast.remove()
				}
			}
		}
