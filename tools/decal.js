const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const _ = require("lodash");

// 开始解析
function buildData(input, output) {
    //人物体型role_type 1-6
    let facedata = {
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
    //装饰类型type 0-20
    _.each(facedata, function(val, key) {
        for (let i = 0; i <= 20; i++) {
            //let type_key = 'type_' + i
            facedata[key][i] = {};
        }
    });
    // console.log(facedata)

    // let data = fs.readFileSync("./raw/face/facedecals.tab");
    let data = fs.readFileSync(input);

    const records = parse(data, {
        // delimiter: "\t",
        delimiter: ",",
        columns: true,
        skip_empty_lines: true,
    }).slice(1);

    // console.log(records)

    for (let record of records) {
        // console.log(record)

        let role_type = record.RoleType, //体型
            type = record.Type, //装饰类型
            showid = record.ShowID, //展示id
            name = record.Name, //装饰名
            iconid = record.IconID; //图标id

        // console.log(type)

        facedata[role_type][type][showid] = {
            name: name,
            iconid: iconid,
            CanUseInCreate: record.CanUseInCreate,
            CoinPrice: record.CoinPrice,
        };
    }

    // console.log(facedata)
    fs.writeFileSync(output, JSON.stringify(facedata));
}

buildData("./raw/decal/facedecal_std.csv","./assets/data/decal_std.json")
buildData("./raw/decal/facedecal_origin.csv","./assets/data/decal_origin.json")