import { z } from 'zod';
import { HttpContext } from '../../../../packages/core';

// In-memory store for todos
const todos = new Map();

export const config = {
  body: z.object({
    title: z.string().min(1).max(100),
    completed: z.boolean().optional().default(false),
  }),
  response: z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    createdAt: z.string(),
  }),
};

export async function POST(ctx: HttpContext) {
  const body = await ctx.json();
  const id = crypto.randomUUID();
  const todo = {
    id,
    ...body,
    createdAt: new Date().toISOString(),
  };
  
  todos.set(id, todo);
  
  return new Response(JSON.stringify(todo), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET(ctx: HttpContext) {
  return new Response(JSON.stringify(Array.from(todos.values())), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 