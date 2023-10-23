import axios from "axios";
import _ from "lodash";
import { __ossMirror, __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
import dict from "../assets/data/face/dict.json";
import group from "../assets/data/face/group.json";
import v2_type from "../assets/data/face/decal_v2.json"
export class DecalDatabase {
    _fetchWithCache(key, url, callback) {
        // 优先使用本地缓存
        try {
            const local = sessionStorage.getItem(key);
            if (local) {
                callback(JSON.parse(local));
                return;
            }
        }
        catch { }

        // 本地缓存无效，获取并写入
        try {
            axios.get(url).then((res) => {
                // 写缓存可能炸？炸就不管了
                try {
                    if (res.data) {
                        sessionStorage.setItem(key, JSON.stringify(res.data));
                        return
                    }
                }
                catch { }
                callback(res.data);
            });
        }
        catch {
            callback("");
        }
        try {
            sessionStorage.setItem(key, JSON.stringify(v2_type));
        }
        catch {
            callback("");
        }
    }

    ready() {
        return this.decal && this.decoration;
    }

    setBodyType(bodyType) {
        this.bodyType = bodyType;
    }

    // 贴花
    getDecalName(key, val, v2 = false) {
        return (
            _.get(this.decal[this.bodyType][v2 ? key : dict[key]["type"]][val], "name") ||
            "无"
        );
    }
    getDecalIcon(key, val, v2 = false) {
        /*let iconid = _.get(
            this.decal[this.bodyType][dict[key]["type"]][val],
            "iconid"
        );*/
        let iconid = _.get(this.decal, [this.bodyType, v2 ? key : dict[key]["type"], val, "iconid"]);
        return __iconPath + "icon/" + (iconid || "undefined") + ".png";
    }
    getDecalIsFlip(key, val, v2 = false) {
        return (
            _.get(
                this.decal[this.bodyType][v2 ? key : dict[key]["type"]][val],
                "IsFlip"
            ) || false
        );
    }
    getDecalIsFree(key, val, v2 = false) {
        /*if (this.decal?.[this.bodyType]?.[dict[key]?.type]?.[val])
            return ~~this.decal?.[this.bodyType]?.[dict[key]?.type]?.[val]
                ?.CanUseInCreate;
        else    // 不存在的贴花
            return -1;
            */
        return ~~(_.get(this.decal, [this.bodyType, v2 ? key : _.get(dict, [key, "type"]), val, "CanUseInCreate"], -1))
    }
    getDecalPrice(key, val,v2 = false) {
        /*return ~~this.decal?.[this.bodyType]?.[dict[key]?.type]?.[val]
            ?.CoinPrice;*/
        return ~~(_.get(this.decal, [this.bodyType, v2 ? key : _.get(dict, [key, "type"]), val, "CoinPrice"], 0))
    }

    // 装饰物
    getDecorationName(id) {
        return _.get(this.decoration[this.bodyType][id], "Name") || "无";
    }
    getDecorationIcon(id) {
        //let iconid = _.get(this.decoration[this.bodyType][id], "IconID");
        let iconid = _.get(this.decoration, [this.bodyType, id, "IconID"]);
        return __iconPath + "icon/" + (iconid || "undefined") + ".png";
        /*if (iconid) {
            return __iconPath + "icon/" + iconid + ".png";
        } else {
            return __iconPath + "icon/" + "undefined" + ".png";
        }*/
    }
    showDecorationPrice(id) {
        return ~~(
            _.get(this.decoration[this.bodyType][id], "CoinPrice") || "0"
        );
    }

    // 所有
    getTotalPrice(data, v2) {
        let sum = 0;
        for (let key in data["tDecal"]) {
            if (data["tDecal"][key])
                sum += this.getDecalPrice(
                    key,
                    data["tDecal"][key]["nShowID"]
                );
        }
        if (data["nDecorationID"])
            sum += this.showDecorationPrice(this.cleandata["nDecorationID"]);
        return sum;
    }
    canUseInCreate(data) {
        if (data["nDecorationID"])
            return false;
        for (let key in data["tDecal"])
            if (data["tDecal"][key] && this.getDecalIsFree(key, data["tDecal"][key]["nShowID"]) === 0)
                return false;
        return true;
    }

    constructor(client = "std", v2 = false) {
        this.client = client;
        this.decal = {};
        this.decoration = {};
        this.bodyType = 0;
        this._fetchWithCache(`decal_${v2 ? 'v2' : client}`, `${__ossMirror}data/face/decal_${v2 ? 'v2' : client}.json`, r => this.decal = r);
        this._fetchWithCache(`decoration_${client}`, `${__ossMirror}data/face/decoration_${client}.json`, r => this.decoration = r);
    }
}
