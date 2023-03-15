import { etag } from 'etag';

export function etagMiddleware() {
  return {
    async handle({ request, resolve }) {
      const response = await resolve(request);

      // Menentukan nilai ETag dari body respons
      const body = await response.body;
      const etagValue = etag(body);

      // Menambahkan header ETag ke dalam respons
      response.headers.set('ETag', etagValue);

      return response;
    },
  };
}