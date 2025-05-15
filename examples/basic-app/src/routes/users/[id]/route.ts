import { t, HttpContext } from '../../../../../../framework';

export const GET_config = {
  params: t.object({ id: t.string() }),
  querys: t.object({ name: t.string() }),
  response: t.object({
    id: t.string(),
    name: t.string(),
    theme: t.string().optional(),
    ctx: t.any().optional(),
  }),
};

export async function GET(ctx: HttpContext) {
  // Access params: ctx.params.id
  // Access query: ctx.querys.name
  return Response.json({ id: ctx.params.id, name: ctx.querys?.name, theme: 'dark' });
}