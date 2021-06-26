const fs = require("fs");
const iconv = require("iconv-lite");
const parse = require("csv-parse/lib/sync");
const { bodyMap, bodyFiles } = require("../assets/data/index.json");

const range = {}

let raw_files = [
    "./raw/bone_range/LittleBoy.tab",
    "./raw/bone_range/LittleGirl.tab",
    "./raw/bone_range/StandardFemale.tab",
    "./raw/bone_range/StandardMale.tab",
];

function readRangeFiles(){
    for(let item of raw_files){

        let data = fs.readFileSync(item)
        data = iconv.decode(Buffer.from(data), "gbk");
        let records = parse(data, {
            delimiter: "\t",
            columns: true,
            skip_empty_lines: true,
            quote: null,
        });


        let file_name = item.split('/')[3].split('.')[0]
        let key = bodyFiles[file_name]
        range[key] = {}

        for(let o of records){
            range[key][o.Type] = {
                min : ~~o.ValueMin,
                max : ~~o.ValueMax
            }
        }
    }
}

readRangeFiles()

fs.writeFileSync("./assets/data/bone_range.json", JSON.stringify(range));
