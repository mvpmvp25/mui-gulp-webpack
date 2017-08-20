/**
 * 发送验证码模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function($) {

	function checkCode() {
		this.defaults = {
			title: "获取验证码",
			mobile: "",
			isInit: true, // true-自动发短信 false-手动发短信
			doneBack: function() {}
		};
		this.status = "00"; // 00-未倒计时 01-正在倒计时
	}

	// 初始化
	checkCode.prototype.init = function(params) {
		var self = this;
		this.options = strModule.extendObj(this.defaults, params);
		var pageHtml = '<div class="send-box">' +
			'<header class="app-header-box">' +
			'<a class="app-header-back close-btn"></a>' +
			'<h1 class="app-header-title">' + this.options.title + '</h1>' +
			'</header>' +
			'<div class="send-mobile">请输入手机' + strModule.infoProtectDeal({
				targetStr: self.options.mobile,
				keepStart: 3,
				keepEnd: 4,
				cipherLen: 4
			}) + '收到的短信验证码</div>' +
			'<div class="send-cell">' +
			'<input id="codeInput" class="clear-input code-input" type="tel" maxlength="6" placeholder="请输入验证码" />' +
			'<input id="codeBtn" class="code-btn" type="button" value="获取验证码" />' +
			'</div>' +
			'<section class="send-btn">' +
			'<div id="doneBtn" class="btn lock">确定</div>' +
			'</section>' +
			'</div>';
		document.querySelector("body").insertAdjacentHTML("beforeEnd", pageHtml);
		this.sendBoxEle = document.querySelector(".send-box");
		this.codeInputEle = document.querySelector("#codeInput");
		this.codeBtnEle = document.querySelector("#codeBtn");
		this.closeBtn = document.querySelectorAll(".close-btn");
		this.doneBtnEle = document.querySelector("#doneBtn");
		this.bindEvent();
		if(this.options.isInit) {
			setTimeout(function() {
				self.open();
				if(self.status == "00") {
					self.getCode(self.codeBtnEle);
				}
			}, 10);
		}
	}

	// 事件绑定
	checkCode.prototype.bindEvent = function() {
		var self = this;
		this.codeInputEle.addEventListener("input", function() {
			if(this.value.length > 0) {
				self.doneBtnEle.classList.remove("lock");
			} else {
				self.doneBtnEle.classList.add("lock");
			}
		});
		this.codeBtnEle.addEventListener("touchstart", function() {
			if(this.getAttribute("disabled") != "true") {
				self.getCode(this);
			}
		});
		for(var t = 0; t < this.closeBtn.length; t++) {
			this.closeBtn[t].addEventListener("touchstart", function() {
				self.close();
			});
		}
		this.doneBtnEle.addEventListener("touchstart", function() {
			if(this.classList.toString().indexOf("lock") == -1) {
				self.doneBack();
			}
		});

	}
	// 显示
	checkCode.prototype.open = function() {
		this.sendBoxEle.classList.add("show");
		this.sendBoxEle.classList.remove("hide");
	}
	//隐藏
	checkCode.prototype.close = function() {
		this.sendBoxEle.classList.add("hide");
		this.sendBoxEle.classList.remove("show");
		this.codeInputEle.value = "";
	}
	// 发送验证码
	checkCode.prototype.getCode = function(el) {
		this.timeDown(el);
		reqModule.ajax({
			load: false,
			url: "https://www.baidu.com/",
			data: {
				mobile: "18777961256"
			},
			success: function(data) {

			}
		});
	}
	// 提交验证码
	checkCode.prototype.doneBack = function() {
		var self = this;
		var mesCode = self.codeInputEle.value;
		var checkRes = verifyModule.check("checkcode", mesCode);
		if(checkRes.res) {
			reqModule.ajax({
				//load: false,
				url: "https://www.xxxxx.com/",
				data: {
					code: mesCode
				},
				success: function(data) {
					self.options.doneBack();
					self.close();
				}
			});
		} else {
			$.tips(checkRes.tips);
		}
	}
	// 倒计时
	checkCode.prototype.timeDown = function(o, s) {
		var t = arguments[1] || arguments[1] == 0 ? arguments[1] : 60;
		var self = this;
		if(t == 0) {
			self.status = "00";
			o.removeAttribute("disabled");
			o.value = "获取验证码";
		} else {
			self.status = "01";
			o.setAttribute("disabled", true);
			o.value = "(" + t + "秒)重新获取";
			t--;
			setTimeout(function() {
				self.timeDown(o, t);
			}, 1000);
		}
	}

	return new checkCode();
})(mui);