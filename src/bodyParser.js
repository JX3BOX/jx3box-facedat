const luadata = require("luadata").serializer;
const kdata = require("./kdata.js");
const iconv = require("iconv-lite");
const bodyFieldsForward = require("../assets/data/body/body_fields_forward.json");
const bodyFieldsReverse = require("../assets/data/body/body_fields_reverse.json");

const bodyTypes = require("../assets/data/index.json").bodyMap;

function load(rawData) {
  let payload = iconv.decode(kdata.load(rawData), "gbk");
  if (payload.startsWith("return ")) payload = payload.slice(7);
  const dataMap = luadata.unserialize(payload);

  const bodyType = bodyTypes[dataMap.get("nRoleType")].value;
  const tBody = dataMap.get("tBody");

  // 将映射中存在的 index 转换为 key，其他原样保留
  tBody.forEach((value, key, map) => {
    if (bodyFieldsForward[bodyType][key]) {
      tBody.set(bodyFieldsForward[bodyType][key]["Name"], value);
      tBody.delete(key);
    }
  });

  // tBody 此时已经可以转 object
  dataMap.set("tBody", Object.fromEntries(tBody));

  // 将剩下的也转 object
  return Object.fromEntries(dataMap);
}

function dump(bodyObj) {
  const bodyType = bodyTypes[bodyObj.nRoleType].value;

  // 将 tBody 转为 Map，映射中存在的 key 转换为 index，其他原样保留
  const tBody = new Map();
  for (const [key, value] of Object.entries(bodyObj.tBody)) {
    if (bodyFieldsReverse[bodyType][key]) {
      tBody.set(~~bodyFieldsReverse[bodyType][key]["ID"], value);
    } else {
      tBody.set(key, value);
    }
  }

  // 剩下的转为 Map，准备序列化
  bodyObj["tBody"] = tBody;
  const dataMap = new Map(Object.entries(bodyObj));

  const payload = luadata.serialize(dataMap);
  return kdata.dump(iconv.encode("return " + payload, "gbk"));
}

module.exports = {
  load,
  dump,
};
