import { createApp } from '../../packages/core';

(async () => {
  const app = await createApp();
  app.start();
})();