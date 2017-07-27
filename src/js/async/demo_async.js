/**
 * 异步调用的模块
 * created by LittleYellow/441980627@qq.com
 */

// 调用方式
//$("#btn").bind("tap", function() {
//	require.ensure([], function() {
//		var bwork = require('../js/async/workB-async');
//		console.log(bwork.data);
//	});
//});

module.exports = {

	logText: function() {
		console.log("async-code");
	}

}