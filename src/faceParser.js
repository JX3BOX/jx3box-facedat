import { parse as luaParse } from "lua-json";
import { parse as iniParse } from "ini";
import { buf as CRC32 } from "crc-32";
import { convertIni } from "./iniConverter.js";

// 输入一个 buffer，输出解析的脸型数据 object
export function parseFace(rawData, ignoreHeaderError = false) {
    const gbkDecoder = new TextDecoder("gbk");
    const sig = new Uint8Array(rawData, 2, 2);
    /* KD header */
    if (sig[0] == 0x44 && sig[1] == 0x4B) { // "DK"
        console.log("数据类型为带 KD 头的 jx3dat");
        const hashFlag = new Uint8Array(rawData, 0, 1)[0];
        const compressFlag = new Uint8Array(rawData, 1, 1)[0];
        if (compressFlag != 0x4E) { // "N"
            console.log("暂不支持压缩的数据: " + compressFlag);
            throw new Error("暂不支持压缩的数据");
        }
        const hash = new DataView(rawData).getInt32(4, true);
        const length1 = new DataView(rawData).getInt32(8, true);
        const length2 = new DataView(rawData).getInt32(12, true);
        const remainingLen = rawData.byteLength - 16;
        if (length1 != length2 || remainingLen != length1 || remainingLen != length2) {
            if(ignoreHeaderError)
                console.log("数据长度有误，将继续尝试解析: L1=" + length1 + " L2=" + length2 + " Actual=" + remainingLen + " 将继续尝试解析");
            else
                throw new Error("数据长度有误: L1=" + length1 + " L2=" + length2 + " Actual=" + remainingLen);
        }
        let payload = new Uint8Array(rawData, 16, remainingLen);
        if (hashFlag != 0x4E) { // "N", has hashing
            let payloadHash = null;
            if (hashFlag == 0x43) {  // "C"
                payloadHash = CRC32(payload);
            }
            // Compare hash
            if (hash != payloadHash) {
                if(ignoreHeaderError)
                    console.log("数据校验有误: " + hash + " Actual=" + payloadHash + " 将继续尝试解析");
                else
                    throw new Error("数据校验有误: " + hash + " Actual=" + payloadHash);
            }
        }
        payload = gbkDecoder.decode(payload);
        return luaParse("return" + payload.slice(payload.indexOf("{")));
    }
    /* without header */
    else {
        console.log("未检测到 KD 头");
        const payload = gbkDecoder.decode(rawData);
        const luaData = luaParse("return" + payload.slice(payload.indexOf("{")));
        if (luaData.length != 0) {
            console.log("数据类型为不带 KD 头的 jx3dat");
            return luaData;
        }
        else {
            console.log("数据类型为 INI");
            return convertIni(iniParse(payload));
        }
    }
}

// 输入一个 buffer，加上合法的 KD 头
export function dumpFace(payload) {
    const gbkEncoder = new TextEncoder("gbk");
    let payloadBuf = gbkEncoder.encode(payload);
    let length = payloadBuf.length;
    let crc32 = CRC32(payloadBuf) >>> 0; // Convert to unsigned
    let output = Buffer.alloc(length + 16);
    output.write("CNDK", 0);
    output.writeUInt32LE(crc32, 4);
    output.writeUInt32LE(length, 8);
    output.writeUInt32LE(length, 12);
    output.write(payload, 16);
    return output;
}
