import { config } from "./config/index.js";
import { buildApp } from "./app.js";

const app = await buildApp();

try {
  const address = await app.listen({ port: config.port, host: config.host });
  app.log.info(`Jus IA Start Kit running at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
