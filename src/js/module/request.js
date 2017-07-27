/**
 * http模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function($) {

	var loading = $.loadPop();
	var requestModule = {};

	/**
	 * 封装$.ajax()方法
	 * 请求方式默认POST
	 */
	requestModule.ajax = function(parmas) {

		var options = $.extend({
			load: true,
			disguise: true,
			type: "POST",
			url: "",
			data: {},
			dataType: "json",
			async: true, // true默认请求均为异步请求
			success: function() {},
			error: function(err) {},
			complete: function(res) {}
		}, parmas);
		if(options.load) {
			loading.create();
		}
		if(options.disguise) {
			var sign = requestModule.easyDisguiser(options.data, "84fdf5d95e29a22a6421d2cebfed7637");
			options.data.sign = sign;
		}
		$.ajax({
			type: options.type,
			url: parmas.url.indexOf("http") == -1 ? devModule.hostUrl() + options.url : parmas.url,
			//		xhrFields: {withCredentials: true},
			async: options.async,
			contentType: "application/json;charset=utf-8", // contentType: "application/json"
			data: options.data,
			dataType: options.dataType,
			success: function(data) {
				options.success(data);
			},
			error: function(err) {
				options.error(err)
			},
			complete: function(res) {
				if(options.load) {
					loading.remove();
				}
				options.complete(res);
			}
		});
	}

	/**
	 * 参数对称加密
	 */
	requestModule.easyDisguiser = function(inData, key) {
		var inParam = new Object;
		for(var i in inData) {
			if(typeof(inData[i]) !== "function") { // 过滤函数类型，并提示
				if(strModule.checkEmpty(inData[i])) { // 过滤空值
					inParam[i] = inData[i];
				} else {
					delete inData[i]; // 删除入参中的空值字段
				}
			} else {
				console.log("inData is wrong");
			}
		}
		inParam.key = key;
		var inKeyArr = [];
		var paramStr = "";
		for(var i in inParam) {
			inKeyArr.push(i);
		}
		inKeyArr.sort();

		for(var t = 0; t < inKeyArr.length; t++) {
			paramStr += inKeyArr[t] + "=" + inParam[inKeyArr[t]];
		}
		return md5Module.md5(paramStr);
	}
	/**
	 * openWindow
	 */
	requestModule.openWindow = function(url, id, param) {
		var markStr = "?";
		for(var key in param) {
			url += markStr + key + "=" + param[key];
			markStr = "&";
		}
		$.openWindow({
			url: url,
			id: id,
			extras: param
		});
	};

	return requestModule;

})(mui);