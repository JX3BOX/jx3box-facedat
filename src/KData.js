import { buf as CRC32 } from "crc-32";
import iconv from "iconv-lite";

function loadDecode(data, encoding, removeReturnStatement) {
  if(!encoding)
    return data;
  const payloadStr = iconv.decode(data, encoding);
  return removeReturnStatement
    ? payloadStr.replace(/^return /, "")
    : payloadStr;
}

/**
 * 读取 KData 格式数据
 * @param {Uint8Array} rawData
 * @param {Object} config
 * @returns {String | Uint8Array}
 */
export function load(rawData, config) {
  config = Object.assign(
    {},
    {
      encoding: "gbk",
      ignoreHeaderError: false,
      removeReturnStatement: true,
    },
    config
  );

  const array = new Uint8Array(rawData);
  const buf = array.buffer;
  const viewer = new DataView(buf);

  // 判断是否有头（"DK"），无头直接返回
  const sig = new Uint8Array(buf, 2, 2);
  if (!(sig[0] == 0x44 && sig[1] == 0x4b)) {
    return loadDecode(array, config.encoding, config.removeReturnStatement);
  }

  // 判断压缩和校验
  const hashFlag = new Uint8Array(buf, 0, 1)[0];
  const compressFlag = new Uint8Array(buf, 1, 1)[0];
  if (compressFlag != 0x4e) {
    // "N"
    throw new Error("暂不支持压缩的数据");
  }
  const hash = viewer.getInt32(4, true);
  const length1 = viewer.getInt32(8, true);
  const length2 = viewer.getInt32(12, true);
  const remainingLen = buf.byteLength - 16;
  if (
    length1 != length2 ||
    remainingLen != length1 ||
    remainingLen != length2
  ) {
    if (!config.ignoreHeaderError) throw new Error("数据长度有误");
  }

  // 读取数据并核对校验
  const payload = new Uint8Array(buf, 16, remainingLen);
  if (hashFlag != 0x4e) {
    // not "N", has hashing
    let payloadHash = null;
    if (hashFlag == 0x43) {
      // "C"
      payloadHash = CRC32(payload);
    }
    // Compare hash
    if (hash != payloadHash) {
      if (!config.ignoreHeaderError) throw new Error("数据校验有误");
    }
  }

  return loadDecode(payload, config.encoding, config.removeReturnStatement);
}

/**
 * 将数据转换为 KData 格式
 * @param {String | Uint8Array} payload
 * @param {Object} config
 * @returns {Uint8Array}
 */
export function dump(payload, config) {
  config = Object.assign(
    {},
    {
      encoding: "gbk",
    },
    config
  );

  const payloadBuf = config.encoding ? iconv.encode(payload, "gbk") : payload;
  let length = payloadBuf.length;
  let crc32 = CRC32(payloadBuf) >>> 0; // Convert to unsigned
  let output = Buffer.alloc(16);
  output.write("CNDK", 0);
  output.writeUInt32LE(crc32, 4);
  output.writeUInt32LE(length, 8);
  output.writeUInt32LE(length, 12);
  return Uint8Array.from(Buffer.concat([output, payloadBuf]));
}
