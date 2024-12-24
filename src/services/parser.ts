import { NotionEntry } from "../types";

export function parseMessage(text: string, images: string[]): NotionEntry {
  const entry: NotionEntry = {
    content: text,
    images,
  };

  // Parse location (地区)
  const locationMatch = text.match(/地区[：:]\s*([^\n]+)/);
  if (locationMatch) {
    entry.地区 = locationMatch[1].trim().split(/\s+/);
  }

  // Parse age (年龄)
  const ageMatch = text.match(/年龄[：:]\s*(\d+)/);
  if (ageMatch) {
    entry.年龄 = parseInt(ageMatch[1]);
  }

  // Parse height (身高)
  const heightMatch = text.match(/身高[：:]\s*(\d+)/);
  if (heightMatch) {
    entry.身高 = parseInt(heightMatch[1]);
  }

  // Parse weight (体重)
  const weightMatch = text.match(/体重[：:]\s*(\d+)/);
  if (weightMatch) {
    entry.体重 = parseInt(weightMatch[1]);
  }

  // Parse cup size (罩杯)
  const cupMatch = text.match(/罩杯[：:]\s*([A-Ea-e])/);
  if (cupMatch) {
    entry.罩杯 = cupMatch[1].toUpperCase();
  }

  // Parse work (雪生工作)
  const workMatch = text.match(/工作[：:]\s*([^\n]+)/);
  if (workMatch) {
    entry.雪生工作 = workMatch[1].trim();
  }

  // Parse available days (可陪伴天数)
  const daysMatch = text.match(/可陪伴天数[：:]\s*(\d+)/);
  if (daysMatch) {
    entry.可陪伴天数 = parseInt(daysMatch[1]);
  }

  // Parse expected cost (预期生活费用)
  const costMatch = text.match(/(预期生活费用|接受到手多少)[：:]\s*(\d+)/);
  if (costMatch) {
    entry.预期生活费用 = parseInt(costMatch[2]);
  }

  // Parse introduction fee (介绍费)
  const feeMatch = text.match(/介绍费[：:]\s*(\d+)/);
  if (feeMatch) {
    entry.介绍费 = parseInt(feeMatch[1]);
  }

  return entry;
}
