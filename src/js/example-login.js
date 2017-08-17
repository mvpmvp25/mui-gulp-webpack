require('./module/public');

(function($) {

	var formModule = require('./module/example/form');

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();

			formModule.inputClear();

		},

		// 事件绑定
		bindEvent: function() {

			$("#btn").bind("tap", function() {

			});

		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);