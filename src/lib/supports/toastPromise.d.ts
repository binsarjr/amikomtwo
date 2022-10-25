import { type Renderable, type DefaultToastOptions } from 'svelte-french-toast/core/types';

export const toastPromise: <T>(promise: () => Promise<T>, msgs: {
    loading: Renderable;
    success: Renderable;
    error: Renderable;
}, opts?: DefaultToastOptions | undefined) => Promise<T>;