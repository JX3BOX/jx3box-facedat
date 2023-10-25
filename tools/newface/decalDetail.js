const path = require('path');
const { TABLE_DEFAULT_ROW_MODE, readFile, parseTable, writeJSON } = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require('@jx3box/jx3box-build-common/logger');
const lodash = require("lodash");

let baseLogger = null;

const parseRGB = (rgba) => {
    const items = rgba.split(";");
    return {
        "r": parseInt(items[0]),
        "g": parseInt(items[1]),
        "b": parseInt(items[2])
    }
}

const chooseMostFrequent = (data) => {
    if (data.length === 0) return { most: {}, others: {} };
    let freqMap = {};
    data.forEach(item => {
        let fValues = JSON.stringify({
            "value1_min": item.fValue1Min * 100,
            "value1_max": item.fValue1Max * 100,
            "value2_min": item.fValue2Min * 100,
            "value2_max": item.fValue2Max * 100,
            "value3_min": item.fValue3Min * 100,
            "value3_max": item.fValue3Max * 100
        });
        if (freqMap[fValues]) {
            freqMap[fValues].count++;
            freqMap[fValues].ids.push(item.ColorID);
        } else {
            freqMap[fValues] = { count: 1, ids: [item.ColorID] };
        }
    });

    let mostFrequent = Object.keys(freqMap).reduce((a, b) => freqMap[a].count > freqMap[b].count ? a : b);

    let output = {};
    output["most"] = JSON.parse(mostFrequent);
    output["others"] = {};
    Object.keys(freqMap).forEach(fValues => {
        if (fValues !== mostFrequent) {
            freqMap[fValues].ids.forEach(id => {
                output["others"][id] = JSON.parse(fValues);
            });
        }
    });

    return output;
}

const buildDecalDetail = async () => {
    const logger = baseLogger.job("buildDecalDetail");
    let ret = {};

    logger.info("读取 UI 表 FaceDecalsV2");
    const faceDecalsV2Path = path.join(__dirname, `../../raw/std/ui/faceliftv2/facedecalsv2.tab`);
    const faceDecalsV2Table = await parseTable(await readFile(faceDecalsV2Path), {
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.USE,
        keepColumns: ["RoleType", "Type", "ShowID", "DefaultRGBA"]
    });

    logger.info("通过 RoleType, Type, ShowID 索引化");
    for (const { RoleType, Type, ShowID, DefaultRGBA } of faceDecalsV2Table) {
        let ptr = ret;

        // 层叠索引，没有就创建
        if (!ptr[RoleType])
            ptr[RoleType] = {};

        ptr = ptr[RoleType];

        if (!ptr[Type])
            ptr[Type] = {};

        ptr = ptr[Type];

        if (!ptr[ShowID])
            ptr[ShowID] = {};

        ptr = ptr[ShowID];
        ptr["default"] = {};
        ptr = ptr["default"];

        // 默认颜色
        Object.assign(ptr, parseRGB(DefaultRGBA));
    }

    logger.info("读取 FaceDecalDetail_Meta 表");
    const faceDecalDetailMetaPath = path.join(__dirname, `../../raw/std/public/facemeta/facedecaldetail_meta.tab`);
    const faceDecalDetailMetaTable = await parseTable(await readFile(faceDecalDetailMetaPath), {
        useDefaultRow: TABLE_DEFAULT_ROW_MODE.NO,
        keepColumns: [
            "RoleType", "Type", "ShowID", "ColorID",
            "fColorR", "fColorG", "fColorB",
            "fValue1Min", "fValue1Max",
            "fValue2Min", "fValue2Max",
            "fValue3Min", "fValue3Max",
        ]
    });

        logger.info("通过 RoleType, Type, ShowID 填充所有 ColorID");
        for (let roleType of Object.keys(ret)) {
            for (let type of Object.keys(ret[roleType])) {
                for (let showID of Object.keys(ret[roleType][type])) {
                    const allRows = faceDecalDetailMetaTable.filter(row => row.RoleType == roleType && row.Type == type && row.ShowID == showID);
                    for (let { ColorID, fColorR, fColorG, fColorB } of allRows) {
                        if (!ret[roleType][type][showID][ColorID])
                            ret[roleType][type][showID][ColorID] = {
                                "r": Math.round(fColorR * 255),
                                "g": Math.round(fColorG * 255),
                                "b": Math.round(fColorB * 255),
                            };
                    }
                }
            }
        }

    logger.info("通过 RoleType, Type, ShowID 填充并去重所有 fValueMin/Max");
    for (let roleType of Object.keys(ret)) {
        for (let type of Object.keys(ret[roleType])) {
            for (let showID of Object.keys(ret[roleType][type])) {
                const allRows = faceDecalDetailMetaTable.filter(row => row.RoleType == roleType && row.Type == type && row.ShowID == showID);
                const { most, others } = chooseMostFrequent(allRows);

                // 最常出现的值
                ret[roleType][type][showID]["default"] = { ...ret[roleType][type][showID]["default"], ...most };

                // 特殊情况单独处理
                for(let ColorID of Object.keys(others)){
                    ret[roleType][type][showID][ColorID] = { ...ret[roleType][type][showID]["default"], ...others[ColorID] };
                }
            }
        }
    }

    logger.info("输出数据");
    const outputPath = path.join(__dirname, `../../assets/data/newface/decal_detail.json`);
    await writeJSON(outputPath, ret, null, -1);
};

const main = async () => {
    baseLogger = initLogger('jx3-facedat/newface/decalDetail');
    const logger = baseLogger;

    try {
        await buildDecalDetail();
    } catch (e) {
        console.log(e);
        logger.fail(e);
    }

    await logger.end();
};

main();
