import moment from "moment"
import { persisted } from "svelte-local-storage-store"
import { get } from "svelte/store"

type SinkronisasiData = Partial<{
    initial: string
    ktm: string
    bio: string
    jadwal: string
    transkrip: string
    pengumuman: string
}>

export const sinkronisasi = persisted<SinkronisasiData>('sinkronisasi', {})


export const getMostRecentlyUpdatedSyncronize = () => {
    const data = get(sinkronisasi)

    let mostRecentlyUpdated: string | null = null
    Object.keys(data).map(key => {
        // @ts-ignore: will no error
        const date = moment(data[key])
        if (!mostRecentlyUpdated || date.isAfter(mostRecentlyUpdated)) {
            mostRecentlyUpdated = date ? date.format() : null
        }
    })
    return mostRecentlyUpdated
}