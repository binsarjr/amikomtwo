import { t } from "$lib/trpc/t"
import { z } from "zod"

export const pembayaranRouter = t.router({
    payment: t.procedure.input(z.object({
        npm: z.string(),
        token: z.string(),
        bank: z.string()
    })).query(async ({ ctx, input: { bank, npm, token } }) => {
        const { results } = await ctx.request.get('api/amikomone/payment', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            searchParams: {
                bank, npm
            }
        }).json<{
            results: {
                va: string
                jenis_kwj: string
                nama_kwj: string
                nominal: number
                tipe: 'open' | 'close'
                alias_nominal: string
                is_active: boolean
                status: string
                warna: string
            }[]
        }>()
        return results
    }),
    tagihan: t.procedure.input(z.object({
        npm: z.string(),
        token: z.string(),

    })).query(async ({ ctx, input: { npm, token } }) => {
        const { results } = await ctx.request.get(`api/amikomone/payment/${npm}/tagihan`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).json<{
            results: {
                nama_kwj: string
                semester: string
                tagihan: number,
                tha: string
                va: string
            }[]
        }>()
        return results
    })
})