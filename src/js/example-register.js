require('./module/public');

(function($) {

	var formModule = require('./module/example/form');
	var sccModule = require('./module/plugin/send_check_code');

	var passWordEle = $("#passWord");
	var checkCodeEle = $("#checkCode");

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

			checkCodeEle.bind("tap", function() {
				sccModule.getCode(this);
			});

			$(".btn").bind("tap", function() {
				
			});

		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);