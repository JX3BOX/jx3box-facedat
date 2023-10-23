const path = require('path');
const { TABLE_DEFAULT_ROW_MODE, readFile, parseTable, writeJSON } = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require('@jx3box/jx3box-build-common/logger');

let baseLogger = null;

const mergeTable = async (client) => {
    const logger = baseLogger.job("mergeTable");

    logger.info("读取并索引化 ui 表");
    const uiTablePath = path.join(__dirname, `../../raw/${client}/ui/facelift/decoration.tab`);
    const uiTable = await parseTable(await readFile(uiTablePath), {
        delimiter: "\t",
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.USE,
        keepColumns: ["ID", "RoleType", "IconID"]
    });
    let dataTableIndexed = {};
    for (let row of uiTable) {
        if (!dataTableIndexed[row.RoleType])
            dataTableIndexed[row.RoleType] = {};
        dataTableIndexed[row.RoleType][row.ID] = {
            IconID: row.IconID
        };
    }
    logger.info(`共构建 ${uiTable.length} 条记录`);

    logger.info("读取并索引化 settings 表");
    const settingsTablePath = path.join(__dirname, `../../raw/${client}/settings/facelift/decoration.tab`);
    const settingsTable = await parseTable(await readFile(settingsTablePath), {
        delimiter: "\t",
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.USE,
        keepColumns: ["RoleType", "DecorationID", "CoinPrice"]
    });
    let settingsTableIndexed = {};
    for (let row of settingsTable) {
        if (!settingsTableIndexed[row.RoleType])
        settingsTableIndexed[row.RoleType] = {};
        settingsTableIndexed[row.RoleType][row.DecorationID] = {
            CoinPrice: row.CoinPrice
        };
    }
    logger.info(`共构建 ${settingsTable.length} 条记录`);


    logger.info("读取 data 表");
    const dataTablePath = path.join(__dirname, `../../raw/${client}/public/face/facepart_${client == "origin" ? "classic" : "hd"}.tab`);
    const dataTable = await parseTable(await readFile(dataTablePath), {
        delimiter: "\t",
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.NO,
        keepColumns: ["RoleType", "ID", "Name"]
    });
    logger.info(`共构建 ${dataTable.length} 条记录`);

    logger.info("开始合表");
    let mergedTable = [];
    for (let row of dataTable) {
        let mergedRow = {
            ...row,
            ...dataTableIndexed[row.RoleType][row.ID],
            ...settingsTableIndexed[row.RoleType][row.ID]
        };
        mergedTable.push(mergedRow);
    }
    logger.info(`共合表 ${mergedTable.length} 条记录`);
    return mergedTable;
};

const buildData = async (client) => {
    const logger = baseLogger.job("buildData");

    logger.info(`开始构建 ${client} 的 decoration 数据`);
    const mergedTables = await mergeTable(client);

    //人物体型role_type 1-6
    let ret = {
        //成男
        1: {
            role_type: "成男",
        },
        //成女
        2: {
            role_type: "成女",
        },
        //魁梧男
        3: {
            role_type: "魁梧男",
        },
        // 性感女
        4: {
            role_type: "性感女",
        },
        //正太
        5: {
            role_type: "正太",
        },
        //萝莉
        6: {
            role_type: "萝莉",
        },
        0: {
            role_type: "未知",
        },
    };

    logger.info("开始构建输出");

    for (let record of mergedTables) {
        const { RoleType, ID, ...otherFields } = record;
        ret[record.RoleType][record.ID] = otherFields;
    }

    logger.info(`开始写入文件`);
    const outputPath = path.join(__dirname, `../../assets/data/face/decoration_${client}.json`);
    await writeJSON(outputPath, ret);
    logger.info(`写入文件 ${outputPath} 成功`);
};

const main = async () => {
    baseLogger = initLogger('jx3-facedat/face/decoration');
    const logger = baseLogger;

    try {
        await buildData("std");
        await buildData("origin");
        logger.success();
    } catch (e) {
        console.log(e);
        logger.fail(e);
    }

    await logger.end();
};

main();
