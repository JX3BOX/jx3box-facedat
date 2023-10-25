const path = require('path');
const { TABLE_DEFAULT_ROW_MODE, readFile, parseTable, writeJSON } = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require('@jx3box/jx3box-build-common/logger');
const lodash = require("lodash");

let baseLogger = null;

const buildBonesUI = async () => {
    const logger = baseLogger.job("buildBonesUI");
    logger.info(`生成骨骼 UI 表`)

    const uiTablePath = path.join(__dirname, `../../raw/std/ui/faceliftv2/facebonesv2.tab`);
    const uiTable = await parseTable(await readFile(uiTablePath), {
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.USE,
    });

    let ret = {};
    let lastAreaName = "", lastClassName = "", lastDivideName = "";

    for (const row of uiTable) {
        if (row.AreaName) {
            if (lastAreaName != row.AreaName) {
                lastClassName = "";
                lastDivideName = "root";
            }
            lastAreaName = row.AreaName;
        }
        if (!ret[lastAreaName])
            ret[lastAreaName] = {};

        if (row.ClassName) {
            if (lastClassName != row.ClassName) {
                lastDivideName = "root";
            }
            lastClassName = row.ClassName;
        }
        if (!ret[lastAreaName][lastClassName])
            ret[lastAreaName][lastClassName] = {};

        if (row.DivideName) {
            lastDivideName = row.DivideName;
        }
        if (!ret[lastAreaName][lastClassName][lastDivideName])
            ret[lastAreaName][lastClassName][lastDivideName] = [];

        ret[lastAreaName][lastClassName][lastDivideName].push({
            BoneType: row.BoneType,
            BoneName: row.BoneName,
        });
    }

    return ret;
}

const saveBonesUI = async (data) => {
    const logger = baseLogger.job("saveBonesUI");
    logger.info(`保存骨骼 UI 表`)

    const filePath = path.join(__dirname, `../../assets/data/newface/ui.json`);
    await writeJSON(filePath, data);
};

const main = async () => {
    baseLogger = initLogger('jx3-facedat/newface/decal');
    const logger = baseLogger;

    try {
        const bonesUI = await buildBonesUI();
        await saveBonesUI(bonesUI);
        logger.success();
    } catch (e) {
        console.log(e);
        logger.fail(e);
    }

    await logger.end();
};

main();
