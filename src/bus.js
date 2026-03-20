import mitt from "mitt";

// 创建事件总线实例
const Bus = mitt();

export default Bus;

// 使用方式：
// Bus.emit("事件名", 数据);   // 发送事件
// Bus.on("事件名", data => {}); // 监听事件
// Bus.off("事件名", handler);   // 移除监听
