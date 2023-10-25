import * as KData from "./KData";
import { parse as luaJsonParse } from "lua-json";
import { serializer as luadata } from "luadata";
import { parse as iniParse } from "ini";
import { convertFaceIni } from "./FaceINIConverter";
import { load as convertBody } from "./BodyConverter";

/**
 * 加载数据，若解析成功返回数据类型和数据，否则返回 null
 * @param {Uint8Array} buf 
 * @return {object} {type: "face" | "face_v2" | "face_ini" | "body", data: object} | null
 */
export function load(buf) {
    const payload = KData.load(buf);

    // 先尝试作为 LuaTable 解析
    let lua;
    try {

        // FIXME: 后期统一用 object 输出，需要大改 body
        lua = luadata.unserialize(payload);

        if (lua.get("tBody")) {
            console.log("数据为体型数据");
            return {
                type: "body",
                data: convertBody(lua),
            }
        }
        else if(lua.get("bNewFace")) {
            console.log("数据为写实脸型数据");
            return {
                type: "face_v2",
                data: luadata.unserialize(payload, { dictType: "object" }), // FIXME: 同上
            }
        }
        else {
            console.log("数据为写意脸型数据");
            return {
                type: "face",
                data: luaJsonParse("return " + payload),    // 为了和之前的代码保持兼容，暂时不更换 lua-json，要手动加回去 return
            }
        }
    }
    catch {
        // 作为 LuaTable 解析失败再尝试作为 INI 解析
        try {
            const ini = iniParse(payload);
            const face = convertFaceIni(ini);
            console.log("数据为编辑器 INI 脸型数据");
            return {
                type: "face_ini",
                data: face,
            }
        }
        catch {
            return null;
        }
    }
}
