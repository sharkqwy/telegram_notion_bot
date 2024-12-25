import { NotionEntry } from "../types";

const FIELD_PATTERNS = {
  地区: /(地区|所在地（具体到区）)[：:]\s*([^\n]+)/,
  省份: /省份[：:]\s*([^\n]+)/,
  城市: /城市[：:]\s*([^\n]+)/,
  年龄: /年龄[：:]\s*(\d+)/,
  身高: /身高[：:]\s*(\d+)/,
  体重: /体重[：:]\s*([\d.]+)\s*(斤|kg)/i,
  罩杯: /罩杯[：:]\s*([A-Ea-e])/,
  工作: /(工作还是雪生|雪生\/工作)[：:]\s*([^\n]+)/,
  可陪伴天数: /可陪伴天数[：:]\s*(?:月最少)?(\d+)(?:-\d+)?[天\s]*/,
  费用: /(预期生活费用|生活费|接受到手多少)[：:]\s*([\d.]+)\s*([kw万])?/i,
  介绍费: /介绍费[：:\s]*([\d.]+)/,
} as const;

function extractField(text: string, pattern: RegExp): string[] | null {
  const match = text.match(pattern);
  return match ? match.slice(1) : null;
}

function parseNumber(value: string, unit?: string): number {
  const num = parseFloat(value);
  if (unit) {
    switch (unit.toLowerCase()) {
      case "w":
      case "万":
        return num * 10000;
      case "k":
        return num * 1000;
      default:
        return num;
    }
  }
  return num;
}

function parseWeight(value: string, unit: string): number {
  const num = parseFloat(value);
  return unit.toLowerCase() === "kg" ? num : num / 2; // Convert 斤 to kg
}

export function parseMessage(text: string, attachments: string[]): NotionEntry {
  const entry: NotionEntry = {
    content: text,
    attachments,
  };

  // Extract location from different formats
  const locationMatch = extractField(text, FIELD_PATTERNS.地区);
  if (locationMatch) {
    entry.地区 = locationMatch[1].trim().split(/\s+/).filter(Boolean);
  } else {
    const province = extractField(text, FIELD_PATTERNS.省份);
    const city = extractField(text, FIELD_PATTERNS.城市);
    if (province && city) {
      entry.地区 = [province[0], city[0]].map((s) => s.trim());
    }
  }

  // Extract numeric fields
  const ageMatch = extractField(text, FIELD_PATTERNS.年龄);
  if (ageMatch) {
    entry.年龄 = parseInt(ageMatch[0]);
  }

  const heightMatch = extractField(text, FIELD_PATTERNS.身高);
  if (heightMatch) {
    entry.身高 = parseInt(heightMatch[0]);
  }

  const weightMatch = extractField(text, FIELD_PATTERNS.体重);
  if (weightMatch) {
    entry.体重 = parseWeight(weightMatch[0], weightMatch[1]);
  }

  // Extract cup size
  const cupMatch = extractField(text, FIELD_PATTERNS.罩杯);
  if (cupMatch && cupMatch[0]) {
    entry.罩杯 = cupMatch[0].toUpperCase();
  }

  // Extract work status
  const workMatch = extractField(text, FIELD_PATTERNS.工作);
  if (workMatch) {
    entry.雪生工作 = workMatch[1].trim();
  }

  // Extract days
  const daysMatch = extractField(text, FIELD_PATTERNS.可陪伴天数);
  if (daysMatch) {
    entry.可陪伴天数 = parseInt(daysMatch[0]);
  }

  // Extract costs
  const costMatch = extractField(text, FIELD_PATTERNS.费用);
  if (costMatch) {
    entry.预期生活费用 = parseNumber(costMatch[1], costMatch[2]);
  }

  const feeMatch = extractField(text, FIELD_PATTERNS.介绍费);
  if (feeMatch) {
    entry.介绍费 = parseInt(feeMatch[0]);
  }

  return entry;
}
