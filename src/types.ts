export interface NotionEntry {
  地区?: string[];
  年龄?: number;
  身高?: number;
  体重?: number;
  罩杯?: string;
  雪生工作?: string;
  可陪伴天数?: number;
  预期生活费用?: number;
  介绍费?: number;
  content: string;
  images?: string[];
}

export interface ParsedMessage {
  text: string;
  images: string[];
}
