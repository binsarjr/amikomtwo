import { SECRET_GUEST_KEY } from '$env/static/private'

// Cara bikin secret key
// crypto.randomBytes(24).toString('base64')
export const privateKey = Buffer.from(SECRET_GUEST_KEY, 'base64')