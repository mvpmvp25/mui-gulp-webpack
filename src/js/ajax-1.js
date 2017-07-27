require('./module/public');

(function($) {

	var logicModule = require('./module/logic');

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();

		},

		// 事件绑定
		bindEvent: function() {

			$("#btn").bind("tap", function() {
				reqModule.ajax({
					load: false,
					url: "zlCard/getUserCards.execute",
					data: {
						openId: "aa"
					},
					success: function(data) {
						
					}
				});
			});

		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);