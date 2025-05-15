import { t, HttpContext } from '../../../framework';

export const GET_config = {
  response: t.object({ message: t.string() }),
};

export async function GET(ctx: HttpContext) {
  return Response.json({ message: 'Hello from HTTP demo!' });
}
