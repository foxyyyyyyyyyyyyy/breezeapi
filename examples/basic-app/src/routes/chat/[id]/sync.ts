import { syncLayer, t } from '../../../../../../framework';

// Example: Advanced syncLayer usage for chat room
export default syncLayer({
  key: ctx => ctx.params.id,
  schema: t.object({
    messages: t.array(t.object({
      user: t.string(),
      text: t.string(),
      ts: t.number(),
    })),
  }),
  initial: () => ({ messages: [] }),
  ttl: 10 * 60 * 1000, // 10 minutes
  onUpdate: (key, state, ctx) => {
    console.log('Chat updated:', key, state);
  },
  onClose: (key, state) => {
    console.log('Chat closed:', key, state);
    // Optionally persist or cleanup
  },
  persist: async (key, state) => {
    // Save to DB or disk
    // await db.saveChat(key, state.messages);
  },
  load: async (key) => {
    // Load from DB or disk
    // return { messages: await db.loadChat(key) };
    return { messages: [] };
  },
}); 