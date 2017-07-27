/**
 * 开发配置
 * created by LittleYellow/441980627@qq.com
 */

module.exports = {

	// 配置项
	config: {
		"server": "01", // 环境类型 01-开发地址  02-测试地址  03-演练地址  04-生产地址  其他情况返回本机地址
	},

	// 接口地址
	hostUrl: function() {
		var type = this.config.server; // 01-开发地址  02-测试地址  03-演练地址  04-生产地址  其他情况返回本机地址
		var devIp = "http://ns1.jieshunpay.cn/hdwxgzh/wechat-subscription/"; //灰度 http://ns1.jieshunpay.cn/hdwxgzh/wechat-subscription // 测试http://ns1.jieshunpay.cn/wxgzh/wechat-subscription/ 开发http://ns1.jieshunpay.cn/upay/wechat-subscription/
		var testIp = ""; // http://10.101.130.31:30002/
		var copyIp = "";
		var proIp = "";
		switch(type) {
			case "01":
				return devIp;
				break;
			case "02":
				return testIp;
				break;
			case "03":
				return copyIp;
				break;
			case "04":
				return proIp;
				break;
			default:
				return "http://" + location.hostname + ":" + location.port + "/";
		}
	}

};