import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";
import nunjucks from "nunjucks";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "./config/index.js";
import { homeRoutes } from "./routes/home.js";
import { flowRoutes } from "./routes/flow.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.nodeEnv === "production" ? "info" : "debug",
      transport:
        config.nodeEnv === "development"
          ? { target: "pino-pretty", options: { translateTime: "HH:MM:ss" } }
          : undefined,
    },
  });

  // Parse form body (application/x-www-form-urlencoded)
  await app.register(fastifyFormbody);

  // Serve static assets (local dev only — Vercel serves from public/)
  await app.register(fastifyStatic, {
    root: join(__dirname, "public"),
    prefix: "/",
  });

  // Nunjucks template engine
  nunjucks.configure(join(__dirname, "templates"), {
    autoescape: true,
    noCache: config.nodeEnv === "development",
  });

  await app.register(fastifyView, {
    engine: { nunjucks },
    templates: join(__dirname, "templates"),
    options: {
      onConfigure: (_env: nunjucks.Environment) => {
        // Add any custom filters here
      },
    },
  });

  // Register routes
  await app.register(homeRoutes);
  await app.register(flowRoutes);

  return app;
}
