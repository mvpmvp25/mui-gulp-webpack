require('./module/public');

(function($) {

	var logicModule = require('./module/logic');

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();
			var testData = "";
			setTimeout(function() { testData = "666" }, 3000);

			logicModule.setIntervalTask(function(){
				console.log("doing");
			},function() {
				if(strModule.checkEmpty(testData)) {
					return true;
				} else {
					return false;
				}
			}, function() {
				console.log("end");
			});

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