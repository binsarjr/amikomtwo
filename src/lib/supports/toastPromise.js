import toast from "svelte-french-toast";

export const toastPromise = (promise, msgs, opts = undefined) => toast.promise(promise(), {
    ...{
        error: "Gagal Mendapatkan Data",
        loading: "Sedang Mengambil semua data",
        success: "Data berhasil didapatkan",
    }, ...msgs
}, {
    ...{
        position: 'top-right'
    },
    ...opts
})