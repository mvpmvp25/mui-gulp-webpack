require('./module/public');

(function($) {

	var verify = require('./module/verify');

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();

		},

		// 事件绑定
		bindEvent: function() {

			$("#code").bind("input", function() {
				verify.check("isMobile", {
					eid: "code-tips",
					//tips: "",
					val: $(this).val()
				});
			});

		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);