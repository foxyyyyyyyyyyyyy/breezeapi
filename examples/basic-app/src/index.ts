import { createApp, docs } from '../../../framework';


(async () => {
  const app = await createApp();

  // Register documentation endpoints for all protocols using the new plugin system
  app.registerPlugin(docs({ http: true, tcp: true, ws: true, trpc: true }));

  app.start();
})();