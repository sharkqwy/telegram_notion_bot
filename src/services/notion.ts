import { Client } from "@notionhq/client";
import { config } from "../config";
import { NotionEntry } from "../types";

// Initialize the Notion client
const notion = new Client({
  auth: config.NOTION_TOKEN,
});

export async function createNotionEntry(entry: NotionEntry) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: config.NOTION_DATABASE_ID },
      properties: {
        // ... existing code ...
        年龄: {
          type: "number",
          number: entry.年龄 ?? null,
        },
        身高: {
          type: "number",
          number: entry.身高 ?? null,
        },
        体重: {
          type: "number",
          number: entry.体重 ?? null,
        },
        可陪伴天数: {
          type: "number",
          number: entry.可陪伴天数 ?? null,
        },
        预期生活费用: {
          type: "number",
          number: entry.预期生活费用 ?? null,
        },
        介绍费: {
          type: "number",
          number: entry.介绍费 ?? null,
        },
        // ... existing code ...
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to create Notion entry:", error);
    throw error;
  }
}
