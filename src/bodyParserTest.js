const bodyParser = require("./bodyParser.js");
const fs = require("fs");

const content = fs.readFileSync(
  "demo/体型解析数据/Body_LittleGirl_20230817-154710.dat"
);
const read = bodyParser.load(content);
const write = bodyParser.dump(read);
console.log(read, write);
fs.writeFileSync("demo/体型解析数据/out.dat", write);
