require('./module/public');

(function($) {

	//var logicModule = require('./module/logic');

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();
			var canvas = document.createElement("canvas");
			var depict = canvas.getContext("2d");
			var textareaEle = document.createElement("textarea");
			var img = new Image();
			img.src = "../img/icon/eye1.png";
			img.onload = function() {
				canvas.width = img.width;
				canvas.height = img.height;
				depict.drawImage(img, 0, 0);
				var imgDataURL = canvas.toDataURL("image/png", 1.0);
				textareaEle.innerHTML = imgDataURL ;
				document.querySelector("body").appendChild(textareaEle);
			}
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