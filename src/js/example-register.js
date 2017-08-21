require('./module/public');

(function($) {

	var passWordEle = $("#passWord");
	var checkCodeEle = $("#checkCode");

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();
			formModule.inputClear();
			popupModule.init();
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
				popupModule.open({
					templet: '<div style="width:257px;height:170px;background:#FCFCFC;position:fixed;left:50%;top:150px;z-index:1;margin-left:-128.5px;border-radius:12px;"></div>'
				});
			});

		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);