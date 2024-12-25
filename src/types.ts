export interface NotionEntry {
  // Required fields
  content: string;
  attachments: string[];

  // Location fields
  地区?: string[];

  // Numeric fields
  年龄?: number;
  身高?: number;
  体重?: number;
  可陪伴天数?: number;
  预期生活费用?: number;
  介绍费?: number;

  // Text fields
  罩杯?: string;
  雪生工作?: string;
}

export interface ParsedMessage {
  text: string;
  images: string[];
}
