const path = require('path');
const { readFile, parseTable, writeJSON } = require("@jx3box/jx3box-build-common/file");
const { initLogger } = require('@jx3box/jx3box-build-common/logger');
const { glob } = require("glob")

let baseLogger = null;

const main = async () => {
    baseLogger = initLogger('jx3-facedat/face/range');
    const logger = baseLogger;

    try {

        const bodyTypeMapping = {
            "standardmale": 1,
            "standardfemale": 2,
            "littleboy": 5,
            "littlegirl": 6
        };
        let ret = {};

        const boneRangeBaseDir = path.join(__dirname, `../../raw/std/settings/facelift/bone/`);
        for (const file of await glob("*.tab", { cwd: boneRangeBaseDir })) {
            const fileFullPath = path.join(boneRangeBaseDir, file);
            const mainName = path.parse(fileFullPath).name.toLowerCase();
            const bodyType = bodyTypeMapping[mainName];
            if (bodyType) {
                logger.info(`正在读取 ${mainName}`);
                const boneRangeTable = await parseTable(await readFile(path.join(fileFullPath)));
                ret[bodyType] = {};
                for (let row of boneRangeTable) {
                    ret[bodyType][row.Type] = {
                        min: ~~row.ValueMin,
                        max: ~~row.ValueMax
                    };
                }
                logger.info(`共构建 ${boneRangeTable.length} 条记录`);
            }
        }

        logger.info(`开始写入文件`);
        const outputPath = path.join(__dirname, `../../assets/data/face/bone_range.json`);
        await writeJSON(outputPath, ret);
        logger.info(`写入文件 ${outputPath} 成功`);
        logger.success();
    } catch (e) {
        console.log(e);
        logger.fail(e);
    }

    await logger.end();
};

main();
