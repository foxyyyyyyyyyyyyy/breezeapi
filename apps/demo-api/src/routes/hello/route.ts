import { z } from 'zod';
import { HttpContext } from '../../../../../packages/core';

export const config = {
  querys: z.object({
    name: z.string().optional(),
  }),
};

export async function GET(ctx: HttpContext) {
  const name = ctx.querys?.name || 'World';
  return Response.json({ message: `Hello ${name}` });
} 