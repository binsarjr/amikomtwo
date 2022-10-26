import type { PageServerLoad } from ".svelte-kit/types/src/routes/auth/$types";
import { redirect } from "@sveltejs/kit";


export const load: PageServerLoad = async ({
    cookies
}) => {
    cookies.delete('logged', { path: '/' })
    cookies.delete('nim', { path: '/' })
    cookies.delete('password', { path: '/' })
    cookies.delete('access_token', { path: '/' })
    cookies.delete('api_key', { path: '/' })
    throw redirect(302, '/auth')
}