const crc32 = require("crc-32");
const { buf: CRC32 } = crc32;

function load(rawData, ignoreHeaderError = false) {
  const array = new Uint8Array(rawData);
  const buf = array.buffer;
  const viewer = new DataView(buf);

  /* KD header */
  const sig = new Uint8Array(buf, 2, 2);
  if (sig[0] == 0x44 && sig[1] == 0x4b) {
    // "DK"
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
      if (!ignoreHeaderError) throw new Error("数据长度有误");
    }

    let payload = new Uint8Array(buf, 16, remainingLen);
    if (hashFlag != 0x4e) {
      // not "N", has hashing
      let payloadHash = null;
      if (hashFlag == 0x43) {
        // "C"
        payloadHash = CRC32(payload);
      }
      // Compare hash
      if (hash != payloadHash) {
        if (!ignoreHeaderError) throw new Error("数据校验有误");
      }
    }

    return payload;
  } else {
    /* without header */
    return new Uint8Array(array);
  }
}

function dump(payload) {
  const payloadBytes = payload;
  let length = payloadBytes.length;
  let crc32 = CRC32(payloadBytes) >>> 0; // Convert to unsigned
  let output = Buffer.alloc(16);
  output.write("CNDK", 0);
  output.writeUInt32LE(crc32, 4);
  output.writeUInt32LE(length, 8);
  output.writeUInt32LE(length, 12);
  return Buffer.concat([output, payloadBytes]);
}

module.exports = { load, dump };
