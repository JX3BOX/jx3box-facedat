import axios from "axios";
import _ from "lodash";
import { __ossMirror, __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
import dict from "../assets/data/face/dict.json";
import group from "../assets/data/face/group.json";
import decal_v2 from "../assets/data/newface/decal_v2.json";
import decal_origin from "../assets/data/face/decal_origin.json";
import decal_std from "../assets/data/face/decal_std.json";
import decoration_std from "../assets/data/face/decoration_std.json";
import decoration_origin from "../assets/data/face/decoration_origin.json";
import decoration_v2 from "../assets/data/newface/decoration_v2.json";

/**
 * 本地数据文件映射表
 * 作为初始化数据和网络请求失败时的兜底数据源
 */
const LOCAL_DATA_FILES = {
    decoration_std,
    decoration_v2,
    decoration_origin,
    decal_origin,
    decal_std,
    decal_v2,
};

/**
 * 贴花数据库管理类
 * 负责管理角色面部贴花和装饰物的数据获取与缓存
 */
export class DecalDatabase {
    /**
     * 创建 DecalDatabase 实例
     * @param {string} client - 客户端类型，可选值: "std" | "origin"
     * @param {boolean} v2 - 是否使用 v2 版本数据
     */
    constructor(client = "std", v2 = false) {
        this.client = client;
        this.bodyType = 0;
        this.v2 = v2;

        // 立即使用本地文件数据初始化（同步），确保 ready() 立即可用
        const dataKey = v2 ? "v2" : client;
        this.decal = this._getFromSessionCache(`decal_${dataKey}`) || LOCAL_DATA_FILES[`decal_${dataKey}`] || null;
        this.decoration =
            this._getFromSessionCache(`decoration_${dataKey}`) || LOCAL_DATA_FILES[`decoration_${dataKey}`] || null;

        // 异步更新网络数据
        this._updateFromNetwork(dataKey);
    }

    /**
     * 异步从网络更新数据
     * @param {string} dataKey - 数据键名
     */
    async _updateFromNetwork(dataKey) {
        const decalKey = `decal_${dataKey}`;
        const decorationKey = `decoration_${dataKey}`;

        // 并行请求贴花和装饰物数据
        const [decalData, decorationData] = await Promise.all([
            this._fetchFromNetwork(decalKey, `${__ossMirror}data/face/${decalKey}.json`),
            this._fetchFromNetwork(decorationKey, `${__ossMirror}data/face/${decorationKey}.json`),
        ]);

        // 更新数据
        if (decalData) this.decal = decalData;
        if (decorationData) this.decoration = decorationData;
    }

    /**
     * 从网络获取数据
     * @param {string} cacheKey - 缓存键名
     * @param {string} url - 远程数据 URL
     * @returns {Promise<Object|null>} 数据对象或 null
     */
    async _fetchFromNetwork(cacheKey, url) {
        try {
            const response = await axios.get(url);
            if (response.data) {
                this._saveToSessionCache(cacheKey, response.data);
                return response.data;
            }
        } catch (error) {
            console.warn(`网络请求失败 [${cacheKey}]:`, error.message);
        }
        return null;
    }

    /**
     * 从 sessionStorage 读取缓存
     * @param {string} key - 缓存键名
     * @returns {Object|null} 缓存数据或 null
     */
    _getFromSessionCache(key) {
        try {
            const cached = sessionStorage.getItem(key);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }

    /**
     * 保存数据到 sessionStorage
     * @param {string} key - 缓存键名
     * @param {Object} data - 要缓存的数据
     */
    _saveToSessionCache(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
        } catch {
            console.warn("缓存写入失败，可能已超出存储限制");
        }
    }

    /**
     * 检查数据库是否已加载完成
     * @returns {boolean} 是否已就绪
     */
    ready() {
        return this.decal !== null && this.decoration !== null;
    }

    /**
     * 设置体型类型
     * @param {number} bodyType - 体型 ID
     */
    setBodyType(bodyType) {
        this.bodyType = bodyType;
    }

    /**
     * 获取贴花数据的路径键名
     * @param {string} key - 贴花键名
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {string} 数据类型键名
     */
    _getDecalTypeKey(key, v2) {
        return v2 ? key : dict[key]?.type;
    }

    /**
     * 获取贴花数据项
     * @param {string} key - 贴花键名
     * @param {number} val - 贴花值
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {Object|undefined} 贴花数据项
     */
    _getDecalItem(key, val, v2 = false) {
        const typeKey = this._getDecalTypeKey(key, v2);
        return _.get(this.decal, [this.bodyType, typeKey, val]);
    }

    /**
     * 获取贴花名称
     * @param {string} key - 贴花键名
     * @param {number} val - 贴花值
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {string} 贴花名称
     */
    getDecalName(key, val, v2 = false) {
        const item = this._getDecalItem(key, val, v2);
        return item?.name || "无";
    }

    /**
     * 获取贴花图标 URL
     * @param {string} key - 贴花键名
     * @param {number} val - 贴花值
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {string} 图标 URL
     */
    getDecalIcon(key, val, v2 = false) {
        const item = this._getDecalItem(key, val, v2);
        const iconId = item?.iconid || "undefined";
        return `${__iconPath}icon/${iconId}.png`;
    }

    /**
     * 获取贴花是否可翻转
     * @param {string} key - 贴花键名
     * @param {number} val - 贴花值
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {boolean} 是否可翻转
     */
    getDecalIsFlip(key, val, v2 = false) {
        const item = this._getDecalItem(key, val, v2);
        return item?.IsFlip || false;
    }

    /**
     * 获取贴花是否可在创建角色时使用
     * @param {string} key - 贴花键名
     * @param {number} val - 贴花值
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {number} 1=可用, 0=不可用, -1=不存在
     */
    getDecalIsFree(key, val, v2 = false) {
        const item = this._getDecalItem(key, val, v2);
        return item ? ~~item.CanUseInCreate : -1;
    }

    /**
     * 获取贴花价格
     * @param {string} key - 贴花键名
     * @param {number} val - 贴花值
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {number} 价格（通宝）
     */
    getDecalPrice(key, val, v2 = false) {
        const item = this._getDecalItem(key, val, v2);
        return ~~(item?.CoinPrice || 0);
    }

    /**
     * 获取装饰物数据项
     * @param {number} id - 装饰物 ID
     * @returns {Object|undefined} 装饰物数据项
     */
    _getDecorationItem(id) {
        return _.get(this.decoration, [this.bodyType, id]);
    }

    /**
     * 获取装饰物名称
     * @param {number} id - 装饰物 ID
     * @returns {string} 装饰物名称
     */
    getDecorationName(id) {
        const item = this._getDecorationItem(id);
        return item?.Name || "无";
    }

    /**
     * 获取装饰物图标 URL
     * @param {number} id - 装饰物 ID
     * @returns {string} 图标 URL
     */
    getDecorationIcon(id) {
        const item = this._getDecorationItem(id);
        const iconId = item?.IconID || "undefined";
        return `${__iconPath}icon/${iconId}.png`;
    }

    /**
     * 获取装饰物价格
     * @param {number} id - 装饰物 ID
     * @returns {number} 价格（通宝）
     */
    getDecorationPrice(id) {
        const item = this._getDecorationItem(id);
        return ~~(item?.CoinPrice || 0);
    }

    /**
     * 计算面部数据总价格
     * @param {Object} data - 面部数据对象
     * @param {boolean} v2 - 是否使用 v2 格式
     * @returns {number} 总价格
     */
    getTotalPrice(data, v2) {
        let sum = 0;

        const tDecal = data?.tDecal;
        if (tDecal) {
            for (const key in tDecal) {
                const showId = tDecal[key]?.nShowID;
                if (showId) {
                    sum += this.getDecalPrice(key, showId, v2);
                }
            }
        }

        const decorationId = data?.nDecorationID;
        if (decorationId) {
            sum += this.getDecorationPrice(decorationId);
        }

        return sum;
    }

    /**
     * 检查面部数据是否可在创建角色时使用
     * @param {Object} data - 面部数据对象
     * @returns {boolean} 是否可在创建时使用
     */
    canUseInCreate(data) {
        if (data?.nDecorationID) {
            return false;
        }

        const tDecal = data?.tDecal;
        if (tDecal) {
            for (const key in tDecal) {
                const showId = tDecal[key]?.nShowID;
                if (showId && this.getDecalIsFree(key, showId) === 0) {
                    return false;
                }
            }
        }

        return true;
    }
}
