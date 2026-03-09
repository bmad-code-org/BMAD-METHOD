import type { IncomingMessage, ServerResponse } from "node:http";
import { buildApp } from "../src/app.js";

let appReady: ReturnType<typeof buildApp> | null = null;

function getApp() {
  if (!appReady) {
    appReady = buildApp().then(async (app) => {
      await app.ready();
      return app;
    });
  }
  return appReady;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await getApp();
  app.server.emit("request", req, res);
}
