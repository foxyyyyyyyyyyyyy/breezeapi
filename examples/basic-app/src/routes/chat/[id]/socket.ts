import { syncLayer, t } from '../../../../../../framework';

const chatSync = syncLayer({
  key: ctx => ctx.params.id,
  schema: t.object({
    messages: t.array(t.object({
      user: t.string(),
      text: t.string(),
      ts: t.number(),
    })),
  }),
  initial: () => ({ messages: [] }),
  ttl: 5 * 60 * 1000, // 5 minutes
});

export function open(ctx) {
  chatSync.join(ctx, (state) => {
    ctx.send(JSON.stringify({ type: 'init', data: state }));
  });
}

export function message(ctx, msg) {
  let parsed;
  try {
    parsed = JSON.parse(msg);
  } catch {
    ctx.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
    return;
  }
  if (!parsed.user || !parsed.text) {
    ctx.send(JSON.stringify({ type: 'error', error: 'Missing user or text' }));
    return;
  }
  chatSync.update(ctx, (state) => ({
    messages: [
      ...state.messages,
      { user: parsed.user, text: parsed.text, ts: Date.now() },
    ],
  }));
}

export function close(ctx) {
  chatSync.leave(ctx);
} 