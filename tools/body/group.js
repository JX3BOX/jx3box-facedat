const path = require("path");
const {
    TABLE_DEFAULT_ROW_MODE,
    readFile,
    parseTable,
    writeJSON,
} = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require("@jx3box/jx3box-build-common/logger");

let baseLogger = null;

const readAllFieldNames = async (dir) => {
    const logger = baseLogger.job("readAllFieldNames");
    logger.info("读取所有字段名称");

    const bodyTypeFilePath = path.resolve(__dirname, "../../assets/data/index.json");
    const bodyTypes = Object.values(JSON.parse(await readFile(bodyTypeFilePath))["bodyMap"]).map(i => i["value"]);

    let ret = {};
    for (let bodyType of bodyTypes) {
        logger.info(`正在读取 ${bodyType} 的字段名称`);

        const bodyParamFilePath = path.resolve(__dirname, `../../raw/std/public/bodyreshaping/${bodyType}/bodyparam.tab`);
        const bodyParam = await parseTable(await readFile(bodyParamFilePath), {
            newline: "\n",
            keepColumns: ["Name", "ID"]
        });
        for (let row of bodyParam)
            if (!ret[row["ID"]])
                ret[row["ID"]] = row["Name"];
    }

    logger.info(`读取所有字段名称完成，共 ${Object.keys(ret).length} 个字段`);
    return ret;
}

const buildGroups = async (fieldMapping) => {
    const logger = baseLogger.job("readAllFieldNames");
    logger.info("构建字段名称到分组");

    logger.info("读取分组键与名称")
    const groupTabFilePath = path.resolve(__dirname, "../../assets/data/body/body_group_tabs.json");
    const groupTabs = JSON.parse(await readFile(groupTabFilePath, "utf-8"));

    const bodyBonesFilePath = path.resolve(__dirname, "../../raw/std/ui/facelift/bodybones.tab");
    const bodyBones = await parseTable(await readFile(bodyBonesFilePath), {
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.IGNORE,
        keepColumns: ["ClassID", "ClassName", "BodyType", "BodyName", "RoleType", "szTip"]
    });

    let ret = {};
    for (let row of bodyBones) {
        const groupKey = groupTabs[row["ClassID"]]["value"];
        const fieldKey = fieldMapping[row["BodyType"]];
        if (!ret[groupKey])
            ret[groupKey] = {};
        ret[groupKey][fieldKey] = {
            "name": row["BodyName"],
            "role": row["RoleType"],
            "tip": row["szTip"]
        };
    }

    logger.info("构建字段名称到分组完成，正在写入文件");
    const outputFilePath = path.resolve(__dirname, "../../assets/data/body/body_group_fields.json");
    await writeJSON(outputFilePath, ret);
    logger.info("写入文件完成");
};

const main = async () => {
    baseLogger = initLogger("jx3box-facedat/body/group");
    const logger = baseLogger;

    try {

        const fieldNames = await readAllFieldNames();
        await buildGroups(fieldNames);
        logger.end();

    } catch (e) {
        logger.fail(e);
    }

    await logger.end();
};

main();