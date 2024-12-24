import { z } from "zod";

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  NOTION_TOKEN: z.string(),
  NOTION_DATABASE_ID: z.string(),
  MAX_REQUESTS_PER_MINUTE: z.number().default(30),
});

// Validate environment variables
export const config = envSchema.parse({
  TELEGRAM_BOT_TOKEN:
    process.env.TELEGRAM_BOT_TOKEN ||
    "7771217233:AAF4_Ohu_fCeAkL_9oAA4SPCkIFqnlzTcgk",
  NOTION_TOKEN:
    process.env.NOTION_TOKEN ||
    "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",
  NOTION_DATABASE_ID:
    process.env.NOTION_DATABASE_ID || "165ec1c8d9128162b77cce6fb7000184",
  MAX_REQUESTS_PER_MINUTE: 30,
});
