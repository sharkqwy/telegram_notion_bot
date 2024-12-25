import { Client } from "@notionhq/client";
import { config } from "../config";
import { NotionEntry } from "../types";

// Initialize the Notion client
const notion = new Client({
  auth: config.NOTION_TOKEN,
});

export async function createNotionEntry(entry: NotionEntry) {
  try {
    console.log("Creating Notion entry:", JSON.stringify(entry, null, 2));

    const properties: Record<string, any> = {
      地区: {
        type: "multi_select",
        multi_select: entry.地区?.map((tag) => ({ name: tag })) || [],
      },
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
      罩杯: {
        type: "rich_text",
        rich_text: [{ text: { content: entry.罩杯 || "" } }],
      },
      雪生工作: {
        type: "rich_text",
        rich_text: [{ text: { content: entry.雪生工作 || "" } }],
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
    };

    // Add content and images
    if (entry.content || entry.attachments.length > 0) {
      let fullContent = entry.content || "";

      // Add image links at the end of content
      if (entry.attachments.length > 0) {
        fullContent += "\n\nImages:\n" + entry.attachments.join("\n");
      }

      properties.content = {
        type: "rich_text",
        rich_text: [
          {
            text: {
              content: fullContent.slice(0, 2000), // Notion has a 2000 char limit
            },
          },
        ],
      };
    }

    console.log("Notion properties:", JSON.stringify(properties, null, 2));

    const response = await notion.pages.create({
      parent: { database_id: config.NOTION_DATABASE_ID },
      properties,
    });

    console.log("Notion response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("Failed to create Notion entry:", error);
    if (error instanceof Error) {
      throw new Error(`Notion API error: ${error.message}`);
    }
    throw error;
  }
}
