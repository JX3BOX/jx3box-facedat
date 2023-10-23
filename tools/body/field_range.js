const path = require("path");
const {
  TABLE_DEFAULT_ROW_MODE,
  readFile,
  parseTable,
  writeJSON,
} = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require("@jx3box/jx3box-build-common/logger");

let baseLogger = null;

const readTables = async () => {
  const logger = baseLogger.job('readTables');


  const bodyTypeFilePath = path.resolve(__dirname, "../../assets/data/index.json");
  const bodyTypes = Object.values(JSON.parse(await readFile(bodyTypeFilePath, "utf-8"))["bodyMap"]).map(i => i["value"]);

  let ret = {};
  for (let bodyType of bodyTypes) {
    logger.info(`读取 ${bodyType} 的体型字段`);

    const bodyParamFilePath = path.join(__dirname, `../../raw/std/public/bodyreshaping/${bodyType}/bodyparam.tab`);
    const bodyParam = await parseTable(await readFile(bodyParamFilePath), {
      useDefaultRow: TABLE_DEFAULT_ROW_MODE.NO,
      newline: "\n",
      keepColumns: ["ID", "Name", "Min", "Max"]
    });

    const boneParamFilePath = path.join(__dirname, `../../raw/std/public/bodyreshaping/${bodyType}/boneparam.tab`);
    const boneParam = await parseTable(await readFile(boneParamFilePath), {
      useDefaultRow: TABLE_DEFAULT_ROW_MODE.NO,
      newline: "\n",
      keepColumns: ["ReshapeID"]
    });
    const bodyParamFilter = boneParam.reduce((acc, cur) => {
      acc.add(~~cur.ReshapeID);
      return acc;
    }, new Set());

    ret[bodyType] = {
      fields: bodyParam,
      filter: bodyParamFilter
    };
  }

  return ret;
}

const buildFieldsForward = async (tables) => {
  const logger = baseLogger.job('buildFieldsForward');
  let ret = {};

  for (let bodyType of Object.keys(tables)) {
    logger.info(`构建 ${bodyType} 的正向索引`);

    const fields = tables[bodyType].fields;
    const filter = tables[bodyType].filter;

    const forward = fields.reduce((acc, cur) => {
      acc = {
        ...acc,
        [cur.ID]: {
          name: cur.Name,
          min: ~~cur.Min,
          max: ~~cur.Max,
          use_for_body_type: filter.has(~~cur.ID)
        }
      }
      return acc;
    }, {});

    ret[bodyType] = forward;
  }

  return ret;
};

const buildFieldsReverse = async (tables) => {
  const logger = baseLogger.job('buildFieldsReverse');
  let ret = {};

  for (let bodyType of Object.keys(tables)) {
    logger.info(`构建 ${bodyType} 的反向索引`);

    const fields = tables[bodyType].fields;
    const filter = tables[bodyType].filter;

    const forward = fields.reduce((acc, cur) => {
      acc = {
        ...acc,
        [cur.Name]: {
          id: ~~cur.ID,
          min: ~~cur.Min,
          max: ~~cur.Max,
          use_for_body_type: filter.has(~~cur.ID)
        }
      }
      return acc;
    }, {});

    ret[bodyType] = forward;
  }

  return ret;
};



const main = async () => {
  baseLogger = initLogger("jx3box-facedat/body/range");
  const logger = baseLogger;

  try {

    const tables = await readTables();

    const fwd = await buildFieldsForward(tables);
    logger.info("输出正向索引数据");
    const fwdFilePath = path.join(__dirname, `../../assets/data/body/body_fields_forward.json`);
    await writeJSON(fwdFilePath, fwd);

    const rev = await buildFieldsReverse(tables);
    logger.info("输出反向索引数据");
    const revFilePath = path.join(__dirname, `../../assets/data/body/body_fields_reverse.json`);
    await writeJSON(revFilePath, rev);

    logger.end();

  } catch (e) {
    logger.fail(e);
  }

  await logger.end();
};

main();
