import { describe, expect, it } from "vitest";
import { parseMessage } from "./parser";
import { NotionEntry } from "../types";

describe("parseMessage", () => {
  it("should parse location formats correctly", () => {
    const cases = [
      {
        text: "所在地（具体到区）：四川 成都 成华区",
        expected: ["四川", "成都", "成华区"],
      },
      {
        text: "地区: 四川 成都",
        expected: ["四川", "成都"],
      },
      {
        text: "省份：四川\n城市：德阳",
        expected: ["四川", "德阳"],
      },
    ];

    cases.forEach((testCase) => {
      const result = parseMessage(testCase.text, []);
      expect(result.地区).toEqual(testCase.expected);
    });
  });

  it("should parse numeric values with units correctly", () => {
    const cases = [
      {
        text: "生活费：1w",
        expected: 10000,
      },
      {
        text: "预期生活费用: 2.5w",
        expected: 25000,
      },
      {
        text: "接受到手多少：4k",
        expected: 4000,
      },
    ];

    cases.forEach((testCase) => {
      const result = parseMessage(testCase.text, []);
      expect(result.预期生活费用).toEqual(testCase.expected);
    });
  });

  it("should parse weight with different units correctly", () => {
    const cases = [
      {
        text: "体重：88斤",
        expected: 44, // 88/2 kg
      },
      {
        text: "体重：50kg",
        expected: 50,
      },
    ];

    cases.forEach((testCase) => {
      const result = parseMessage(testCase.text, []);
      expect(result.体重).toEqual(testCase.expected);
    });
  });

  it("should parse day ranges correctly", () => {
    const cases = [
      {
        text: "可陪伴天数：月最少8天",
        expected: 8,
      },
      {
        text: "可陪伴天数: 3-5天",
        expected: 3,
      },
      {
        text: "可陪伴天数：10天",
        expected: 10,
      },
    ];

    cases.forEach((testCase) => {
      const result = parseMessage(testCase.text, []);
      expect(result.可陪伴天数).toEqual(testCase.expected);
    });
  });

  it("should parse sample 1 correctly", () => {
    const text = `所在地（具体到区）：四川 成都 成华区
年龄：19  
身高：160  
体重：88斤  
罩杯：B  
工作还是雪生：雪生  
雷点（不能接受）：不能内  
是否chu女:否  
例假日期：一般789三天  
能否接受SM：🉑轻微  
能否接受体检后无套：🉑 可无套  
能否接受口：🉑 可口  
可否同居：否  
可陪伴天数：月最少8天  
可否其他城市：🉑  
可否飞往外省：🉑  
生活费：1w  
自我加分项：很乖巧很听话 声音很甜  
介绍费7888  
亚 修改  
  
LG8151`;

    const attachments = [
      "blob:https://web.telegram.org/78925cd0-a1ac-4c87-b3ca-60c331ac0bc7",
      "blob:https://web.telegram.org/54cc3dfa-ce28-48cd-a2b9-0ff9eaa922dd",
      "blob:https://web.telegram.org/a6c53380-f40c-4db8-9fb7-d9a5affd67fd",
    ];

    const result = parseMessage(text, attachments);

    const expected: Partial<NotionEntry> = {
      地区: ["四川", "成都", "成华区"],
      年龄: 19,
      身高: 160,
      体重: 44, // 88/2 kg
      罩杯: "B",
      雪生工作: "雪生",
      可陪伴天数: 8,
      预期生活费用: 10000,
      介绍费: 7888,
      attachments,
    };

    Object.entries(expected).forEach(([key, value]) => {
      expect(result[key as keyof NotionEntry]).toEqual(value);
    });
  });

  it("should parse sample 2 correctly", () => {
    const text = `妹妹昵称: 夏天   
地区: 四川 成都   
年龄: 23   
身高: 165   
体重: 78斤   
罩杯:   
雪生/工作: 工作   
纹身抽烟:   
雷点: 变态   
是否chu女: 不是   
能否接受SM: 不接受   
金主体检后无套: 不接受   
能否接受口: 否   
可同居: 可   
可过夜: 可   
可陪伴天数: 3-5天   
可否飞往外省: 可飞   
预期生活费用: 2.5w   
姨妈期: 一般都是月中，不太准   
支付给妹子费用次数: 2   
自我加分项: 不黏人   
介绍费: 6888   
投稿助理: xx  
3950`;

    const attachments = [
      "blob:https://web.telegram.org/487c0c01-8d93-47d1-8904-2058dd46a4f9",
      "blob:https://web.telegram.org/3bfa7648-64d5-46af-a745-34057b472ef2",
      "blob:https://web.telegram.org/a49631ab-d441-46a0-a6f1-a6216fcf8e85",
    ];

    const result = parseMessage(text, attachments);

    const expected: Partial<NotionEntry> = {
      地区: ["四川", "成都"],
      年龄: 23,
      身高: 165,
      体重: 39, // 78/2 kg
      雪生工作: "工作",
      可陪伴天数: 3,
      预期生活费用: 25000,
      介绍费: 6888,
      attachments,
    };

    Object.entries(expected).forEach(([key, value]) => {
      expect(result[key as keyof NotionEntry]).toEqual(value);
    });
  });

  it("should parse sample 3 correctly", () => {
    const text = `昵称：xkR  
省份：四川  
城市：德阳  
年龄：19  
身高：162  
体重：50kg  
罩杯：c  
星座：双鱼  
雷点（不能接受）：不接受亲嘴  
是否chu女:不是  
能否接受SM：不太能  
能否接受无套：🉑  
能否接受口：🉑  
可同居：不行  
可过夜：🉑  
可陪伴天数：10天  
可否其他城市：🉑  
可否飞往外省：🉑  
可否chu国：（哪一些国家）不可以  
姨妈期：不准确  
接受到手多少：4k  
妹子费用支付方式：（几次付款）2次  
自我加分项：好看  
要求：  
介绍费：7888xkR`;

    const attachments = [
      "blob:https://web.telegram.org/720fac11-b119-4ede-aa8c-18c7849f859b",
      "blob:https://web.telegram.org/836d7f8b-09d9-4520-9177-96eac7afdcc5",
      "blob:https://web.telegram.org/72361817-922c-4630-9c82-57b24607ade1",
      "blob:https://web.telegram.org/3e19ac78-efc6-48a8-90ae-b3b288bd82da",
    ];

    const result = parseMessage(text, attachments);

    const expected: Partial<NotionEntry> = {
      地区: ["四川", "德阳"],
      年龄: 19,
      身高: 162,
      体重: 50,
      罩杯: "C",
      可陪伴天数: 10,
      预期生活费用: 4000,
      介绍费: 7888,
      attachments,
    };

    Object.entries(expected).forEach(([key, value]) => {
      expect(result[key as keyof NotionEntry]).toEqual(value);
    });
  });
});
