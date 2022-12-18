import type { IBio } from "@binsarjr/apiamikomone/lib/typings/Response";
import type { RequestHandler } from "@sveltejs/kit";
import  { encryptGuestData } from "../../../lib/supports/userguest";

export const GET: RequestHandler = async ({ setHeaders, url, cookies }) => {
    let password = url.searchParams.get('password') as string
    const mahasiswa = JSON.parse(decodeURIComponent(url.searchParams.get('mahasiswa') as string).toString()) as IBio
    let filename = `amikomtwo-signature-${mahasiswa.Mhs.Npm}`
    setHeaders({
        "Content-Disposition": "attachment; filename=" + filename + ".sign",
    })


    let encrypted = encryptGuestData(mahasiswa, password)
    return new Response(encrypted)
}