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

    console.log("Received message:", JSON.stringify(message, null, 2));

    // Handle text content
    if ("text" in message) {
      content = message.text;
    }

    // Handle photos
    if ("photo" in message) {
      // Get the highest resolution photo
      for (const photo of message.photo) {
        try {
          const fileLink = await ctx.telegram.getFileLink(photo.file_id);
          attachments.push(fileLink.href);
          console.log("Added photo:", fileLink.href);
        } catch (photoError) {
          console.error("Failed to get photo link:", photoError);
        }
      }
    }

    // Handle caption if present
    if ("caption" in message && message.caption) {
      content = message.caption;
    }

    console.log("Parsed content:", content);
    console.log("Parsed attachments:", attachments);

    const entry = parseMessage(content, attachments);
    console.log("Parsed entry:", JSON.stringify(entry, null, 2));

    await createNotionEntry(entry);
    ctx.reply("✅ Message successfully saved to Notion!");
  } catch (error) {
    console.error("Message processing failed:", error);
    if (error instanceof Error) {
      ctx.reply(`❌ Failed to save message to Notion: ${error.message}`);
    } else {
      ctx.reply("❌ Failed to save message to Notion. Please try again.");
    }
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
