import { requestAmikomOne } from "$Amikom/Supports/request"
import type { PageResponse, Pengumuman } from "../typings/Response"

export default async (bearerToken: string) => {
    const response = await requestAmikomOne
        .get(`https://ds.amikom.ac.id/api/amikomone/api/pengumuman`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        })
        .json<PageResponse<Pengumuman>>()
    return response
}