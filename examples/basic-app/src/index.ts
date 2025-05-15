import { createApp, docs } from '../../../framework';

// Config can be provided via Breeze.json in the project root
const app = createApp();

// Register documentation endpoints for all protocols using the new plugin system
app.registerPlugin(docs({ http: true, tcp: true, ws: true, trpc: true }));

app.start(); 