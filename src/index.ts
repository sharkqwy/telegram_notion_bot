import { Telegraf } from "telegraf";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { createNotionEntry } from "./services/notion";
import { parseMessage } from "./services/parser";

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.MAX_REQUESTS_PER_MINUTE,
});

// Command handlers
bot.command("start", (ctx) => {
  ctx.reply("Bot initialized and ready to capture messages for Notion!");
});

bot.command("help", (ctx) => {
  ctx.reply(
    "Available commands:\n" +
      "/start - Initialize the bot\n" +
      "/help - Show this help message\n" +
      "/status - Check connection status"
  );
});

bot.command("status", async (ctx) => {
  try {
    await createNotionEntry({
      content: "Status check",
      attachments: [],
    });
    ctx.reply("✅ Connected to Notion successfully!");
  } catch (error) {
    ctx.reply(
      "❌ Failed to connect to Notion. Please check the configuration."
    );
    console.error("Status check failed:", error);
  }
});

// Message handler
bot.on("message", async (ctx) => {
  try {
    const message = ctx.message;
    const attachments: string[] = [];
    let content = "";

    if ("text" in message) {
      content = message.text;
    }

    if ("photo" in message) {
      const photo = message.photo[message.photo.length - 1];
      const fileLink = await ctx.telegram.getFileLink(photo.file_id);
      attachments.push(fileLink.href);
    }

    const entry = parseMessage(content, attachments);
    await createNotionEntry(entry);

    ctx.reply("✅ Message successfully saved to Notion!");
  } catch (error) {
    ctx.reply("❌ Failed to save message to Notion. Please try again.");
    console.error("Message processing failed:", error);
  }
});

// Start the bot
bot
  .launch()
  .then(() => console.log("Bot is running!"))
  .catch((error) => console.error("Failed to start bot:", error));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
