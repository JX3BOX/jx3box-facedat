const path = require('path');
const { TABLE_DEFAULT_ROW_MODE, readFile, parseTable, writeJSON } = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require('@jx3box/jx3box-build-common/logger');
const lodash = require("lodash");

let baseLogger = null;

const mergeTable = async (client) => {
    const logger = baseLogger.job("mergeTable");

    logger.info("读取并索引化 settings 表");
    const settingsTablePath = path.join(__dirname, `../../raw/${client}/settings/facelift/decal.tab`);
    const settingsTable = await parseTable(await readFile(settingsTablePath), {
        delimiter: "\t",
        keepColumns: ["RoleType", "Type", "ShowID", "CanUseInCreate", "CoinPrice"]
    });
    let settingsTableIndexed = {};
    for (let row of settingsTable) {
        if (!settingsTableIndexed[row.RoleType])
            settingsTableIndexed[row.RoleType] = {};
        if (!settingsTableIndexed[row.RoleType][row.Type])
            settingsTableIndexed[row.RoleType][row.Type] = {};
        settingsTableIndexed[row.RoleType][row.Type][row.ShowID] = {
            CanUseInCreate: row.CanUseInCreate,
            CoinPrice: row.CoinPrice
        };
    }
    logger.info(`共构建 ${settingsTable.length} 条记录`);

    logger.info("读取 ui 表");
    const uiTablePath = path.join(__dirname, `../../raw/${client}/ui/facelift/facedecals.tab`);
    const uiTable = await parseTable(await readFile(uiTablePath), {
        delimiter: "\t",
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.USE
    });
    logger.info(`共构建 ${uiTable.length} 条记录`);

    logger.info("开始合表");
    let mergedTable = [];
    for (let row of uiTable) {
        let mergedRow = {
            ...row,
            ...settingsTableIndexed[row.RoleType][row.Type][row.ShowID]
        };
        mergedTable.push(mergedRow);
    }
    logger.info(`共合表 ${mergedTable.length} 条记录`);
    return mergedTable;
};

const buildData = async (client) => {
    const logger = baseLogger.job("buildData");

    logger.info(`开始构建 ${client} 的 decal 数据`);
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

    //装饰类型type 0-20
    lodash.each(ret, function (val, key) {
        for (let i = 0; i <= 20; i++) {
            //let type_key = 'type_' + i
            ret[key][i] = {};
        }
    });

    for (let record of mergedTables) {
        let role_type = record.RoleType, //体型
            type = record.Type, //装饰类型
            showid = record.ShowID, //展示id
            name = record.Name, //装饰名
            iconid = record.IconID; //图标id

        ret[role_type][type][showid] = {
            name: name,
            iconid: iconid,
            CanUseInCreate: record.CanUseInCreate,
            CoinPrice: record.CoinPrice,
            IsFlip: false,
        };

        // 处理贴花翻转的 ID
        let flipID = record.FlipID;
        if(flipID) {
            ret[role_type][type][flipID] = {
                name: name,
                iconid: iconid,
                CanUseInCreate: record.CanUseInCreate,
                CoinPrice: record.CoinPrice,
                IsFlip: true,
            };
        }
    }

    logger.info(`开始写入文件`);
    const outputPath = path.join(__dirname, `../../assets/data/face/decal_${client}.json`);
    await writeJSON(outputPath, ret);
    logger.info(`写入文件 ${outputPath} 成功`);
};

const main = async () => {
    baseLogger = initLogger('jx3-facedat/face/decal');
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
