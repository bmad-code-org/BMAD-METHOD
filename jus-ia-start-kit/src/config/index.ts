export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
  llm: {
    provider: process.env.LLM_PROVIDER || "openai",
    apiKey: process.env.LLM_API_KEY || "",
    model: process.env.LLM_MODEL || "gpt-4o-mini",
  },
  analyticsId: process.env.ANALYTICS_ID || "",
  sentryDsn: process.env.SENTRY_DSN || "",
} as const;
