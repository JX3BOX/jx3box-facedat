const path = require("path");
const {
  TABLE_DEFAULT_ROW_MODE,
  readFile,
  parseTable,
  writeCsv,
  exists,
  writeJSON,
} = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require("@jx3box/jx3box-build-common/logger");

let baseLogger = null;

const readTables = async () => {
  const logger = baseLogger.job("readTables");
  let ret = {};

  for (let bodyType of ["m2", "f2", "m1", "f1"]) {
    logger.info(`读取 ${bodyType} 的体型字段`);

    const bodyParamFilePath = path.join(
      __dirname,
      `../raw/body/${bodyType}/bodyparam.tab`
    );
    const bodyParam = await parseTable(await readFile(bodyParamFilePath), {
      useDefaultRow: TABLE_DEFAULT_ROW_MODE.NO,
      keepColumns: ["ID", "Name", "NameCH", "Min", "Max"],
    });

    const boneParamFilePath = path.join(
      __dirname,
      `../raw/body/${bodyType}/boneparam.tab`
    );
    const boneParam = await parseTable(await readFile(boneParamFilePath), {
      useDefaultRow: TABLE_DEFAULT_ROW_MODE.NO,
      keepColumns: ["ReshapeID"],
    });
    const bodyParamFilter = boneParam.reduce((acc, cur) => {
      acc.add(~~cur.ReshapeID);
      return acc;
    }, new Set());

    ret[bodyType] = {
      fields: bodyParam,
      filter: bodyParamFilter,
    };
  }

  return ret;
};

const buildFieldsForward = async (tables) => {
  const logger = baseLogger.job("buildFieldsForward");
  let ret = {};

  for (let bodyType of Object.keys(tables)) {
    logger.info(`构建 ${bodyType} 的正向索引`);

    const fields = tables[bodyType].fields;
    const filter = tables[bodyType].filter;

    const forward = fields.reduce((acc, cur) => {
      const { ID, ...otherFields } = cur;
      acc = {
        ...acc,
        [ID]: {
          ...otherFields,
          IsUsedForBodyType: filter.has(~~cur.ID),
        },
      };
      return acc;
    }, {});

    ret[bodyType] = forward;
  }

  return ret;
};

const buildFieldsReverse = async (tables) => {
  const logger = baseLogger.job("buildFieldsReverse");
  let ret = {};

  for (let bodyType of Object.keys(tables)) {
    logger.info(`构建 ${bodyType} 的反向索引`);

    const fields = tables[bodyType].fields;
    const filter = tables[bodyType].filter;

    const forward = fields.reduce((acc, cur) => {
      const { Name, ...otherFields } = cur;
      acc = {
        ...acc,
        [Name]: {
          ...otherFields,
          IsUsedForBodyType: filter.has(~~cur.ID),
        },
      };
      return acc;
    }, {});

    ret[bodyType] = forward;
  }

  return ret;
};

const main = async () => {
  baseLogger = initLogger("jx3-body");
  const logger = baseLogger;

  try {
    const tables = await readTables();

    const fwd = await buildFieldsForward(tables);
    logger.info("输出正向索引数据");
    const fwdFilePath = path.join(
      __dirname,
      `../assets/data/body/body_fields_forward.json`
    );
    await writeJSON(fwdFilePath, fwd);

    const rev = await buildFieldsReverse(tables);
    logger.info("输出反向索引数据");
    const revFilePath = path.join(
      __dirname,
      `../assets/data/body/body_fields_reverse.json`
    );
    await writeJSON(revFilePath, rev);
  } catch (e) {
    logger.fail(e);
  }

  await logger.end();
};

main();
