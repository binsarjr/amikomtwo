
import { applyAction } from '$app/forms';
import { goto } from '$app/navigation';
import toast from 'svelte-french-toast';
export const myenhance = (done?: Function) => ({ form, data, action, cancel }: any) => {
    const id = toast.loading('Sedang Diproses. Mohon menunggu');
    return async ({ result, update }: any) => {
        if (result.type === 'invalid') toast.error(result.data?.error, { id });
        else if (result.type === 'success') {
            toast.success(result.data?.success, { id });
            // if succes and have location key,that mean server want redirect
            if (result.data?.location) {
                await applyAction(result);
                return goto(result.data.location);
            }
        }

        if (done) update(() => {
            done()
        })
        await applyAction(result);

    };
}