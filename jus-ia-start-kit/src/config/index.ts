export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
  llm: {
    provider: (process.env.LLM_PROVIDER || "openrouter") as
      | "openrouter"
      | "openai"
      | "anthropic",
    apiKey: process.env.LLM_API_KEY || process.env.OPENROUTER_API_KEY || "",
    model: process.env.LLM_MODEL || "google/gemini-2.5-flash",
    baseUrl: process.env.LLM_BASE_URL || "https://openrouter.ai/api/v1",
  },
  analyticsId: process.env.ANALYTICS_ID || "",
  sentryDsn: process.env.SENTRY_DSN || "",
} as const;
