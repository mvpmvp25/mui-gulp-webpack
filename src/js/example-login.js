require('./module/public');

(function($) {

	var formModule = require('./module/example/form');

	var passWordEle = $("#passWord");

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();

			formModule.inputClear();

		},

		// 事件绑定
		bindEvent: function() {

			passWordEle.bind("input", function() {
				//console.log(verifyModule.check("password", this.value));
			});

		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);