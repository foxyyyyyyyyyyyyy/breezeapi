import { t, HttpContext } from '../../../../../framework';
import { sendToChannel } from '../../../../../packages/discord';

export const GET_config = {
  querys: t.object({ name: t.string() }),
  response: t.string(),
};

export async function GET(ctx: HttpContext) {
  const name = ctx.querys?.name || "No name";
  await sendToChannel('1364724391392579695', `New registration: ${name}`);
  return Response.json({ name });
}