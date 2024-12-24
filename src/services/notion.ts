import { Client } from "@notionhq/client";
import { NotionEntry } from "../types";
import { config } from "../config";

const notion = new Client({ auth: config.NOTION_TOKEN });

export async function createNotionEntry(entry: NotionEntry) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: config.NOTION_DATABASE_ID },
      properties: {
        地区: {
          type: "multi_select",
          multi_select: entry.地区?.map((tag) => ({ name: tag })) || [],
        },
        年龄: {
          type: "number",
          number: entry.年龄,
        },
        身高: {
          type: "number",
          number: entry.身高,
        },
        体重: {
          type: "number",
          number: entry.体重,
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
          number: entry.可陪伴天数,
        },
        预期生活费用: {
          type: "number",
          number: entry.预期生活费用,
        },
        介绍费: {
          type: "number",
          number: entry.介绍费,
        },
        content: {
          type: "rich_text",
          rich_text: [{ text: { content: entry.content } }],
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to create Notion entry:", error);
    throw error;
  }
}
