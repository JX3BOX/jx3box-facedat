import zhCN from "./zh-CN";

const traditionalCharacters = {
    "无": "無", "宝": "寶", "体": "體", "写": "寫", "实": "實", "脸": "臉", "数": "數", "据": "據",
    "导": "導", "戏": "戲", "浏": "瀏", "览": "覽", "读": "讀", "请": "請", "换": "換", "错": "錯",
    "类": "類", "败": "敗", "旧": "舊", "轮": "輪", "贴": "貼", "颜": "顏", "转": "轉", "颚": "顎",
    "颊": "頰", "宽": "寬", "饱": "飽", "满": "滿", "叠": "疊", "闪": "閃", "线": "線", "妆": "妝",
    "须": "鬚", "额": "額", "层": "層", "阴": "陰", "浓": "濃", "哑": "啞", "躯": "軀", "干": "幹",
    "头": "頭", "颈": "頸", "髋": "髖", "长": "長", "脚": "腳", "两": "兩", "侧": "側", "颧": "顴",
    "苹": "蘋", "颌": "頜", "间": "間", "开": "開", "缩": "縮", "弯": "彎", "倾": "傾", "着": "著",
    "浏览": "瀏覽", "数据": "資料", "文件": "檔案", "默认": "預設", "服务": "伺服",
};

function toTraditional(value) {
    if (Array.isArray(value)) return value.map(toTraditional);
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toTraditional(item)]));
    }
    if (typeof value !== "string") return value;
    let output = value;
    for (const [source, target] of Object.entries(traditionalCharacters).sort((a, b) => b[0].length - a[0].length)) {
        output = output.split(source).join(target);
    }
    return output;
}

const messages = toTraditional(zhCN);
messages.facedat.face.actions.exportStd = "匯出正式服";
messages.facedat.face.actions.exportOrigin = "匯出懷舊服";
messages.facedat.upload.guide = "遊戲臉型匯入匯出指南";
messages.facedat.upload.selectAny = "上傳臉型／體型資料";
messages.facedat.upload.selectFace = "上傳臉型資料";
messages.facedat.upload.selectBody = "上傳體型資料";
messages.facedat.upload.reset = "清除並重設";
messages.facedat.common.fileTypes.face_ini = "編輯器臉型";

export default messages;
