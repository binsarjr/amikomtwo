import type { RequestHandler } from "@sveltejs/kit";
import { authAttempt } from "../../../../lib/supports/auth";

export const POST: RequestHandler = async ({ request }) => {
    const formdata = await request.formData()
    const nim = formdata.get('nim')?.toString() || ''
    const password = formdata.get('password')?.toString() || ''
    const response = await authAttempt(nim, password)
    return new Response(JSON.stringify(response))
}