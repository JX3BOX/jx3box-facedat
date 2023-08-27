import { serializer as luadata } from "luadata";
import * as KData from "./KData";

const bodyFieldsForward = require("../assets/data/body/body_fields_forward.json");
const bodyFieldsReverse = require("../assets/data/body/body_fields_reverse.json");
const bodyTypes = require("../assets/data/index.json").bodyMap;

export function load(data) {
  const bodyType = bodyTypes[data.get("nRoleType")].value;
  const tBody = data.get("tBody");

  // 将映射中存在的 index 转换为 key，其他原样保留
  tBody.forEach((value, key) => {
    if (bodyFieldsForward[bodyType][key]) {
      tBody.set(bodyFieldsForward[bodyType][key]["name"], value);
      tBody.delete(key);
    }
  });

  // tBody 此时已经可以转 object
  data.set("tBody", Object.fromEntries(tBody));

  // 将剩下的也转 object
  return Object.fromEntries(data);
}

export function dump(bodyObj) {
  const bodyType = bodyTypes[bodyObj.nRoleType].value;

  // 将 tBody 转为 Map，映射中存在的 key 转换为 index，其他原样保留
  const tBody = new Map();
  for (const [key, value] of Object.entries(bodyObj.tBody)) {
    if (bodyFieldsReverse[bodyType][key]) {
      // 不存在的字段必须存在且为 0
      if (bodyFieldsReverse[bodyType][key]["use_for_body_type"])
        tBody.set(~~bodyFieldsReverse[bodyType][key]["id"], value);
      else
        tBody.set(~~bodyFieldsReverse[bodyType][key]["id"], 0);
    }
    else
      tBody.set(key, value);
  }

  // 剩下的转为 Map，准备序列化
  bodyObj["tBody"] = tBody;
  const dataMap = new Map(Object.entries(bodyObj));

  const payload = luadata.serialize(dataMap);
  return KData.dump("return " + payload);
}
