import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({cookies,url}) => {
    if(cookies.get('logged') && !url.pathname.startsWith('/onedevice')) throw redirect(302, '/onedevice')
}