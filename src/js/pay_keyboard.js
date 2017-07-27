require('./module/public');

(function($) {

	var logicModule = require("./module/logic");

	var payNum = strModule.getUrlString("goodsPay"); // 实际扣款金额
	var goodsPrice = strModule.getUrlString("goodsPrice"); // 字面金额
	var goodsName = strModule.getUrlString("goodsName"); // 字面金额
	var mchId = strModule.getUrlString("mchId");
	var mchName = strModule.getUrlString("mchName");
	var encryptStr = strModule.getUrlString("encryptStr");
	var openId = strModule.getUrlString("openId");
	var cardCode = strModule.getUrlString("card");
	var operType = strModule.getUrlString("oper"); // unbind-解绑 pay-支付

	//var openId = strModule.getUrlString("openId");

	var payKbCard = $("#payKbCard");

	var main = {

		// 初始化执行
		init: function() {
			var self = this;
			self.bindEvent();
			self.payCardInfo();
			self.numberKeyboard(self.payAction);
		},

		// 卡号信息
		payCardInfo: function() {
			payKbCard.html(strModule.infoProtectDeal({ targetStr: cardCode, keepEnd: 4, cipherLen: 3 }));
		},

		// 发起支付
		payAction: function(pw) {

			if(operType == "unbind") { // 解绑
				reqModule.ajax({
					type: "POST",
					url: "zlCard/unbindJstCard.execute",
					data: {
						openId: openId,
						cardCode: cardCode,
						accounttype: 2,
						password: pw
					},
					dataType: "json",
					success: function(data) {
						if(data.errCode == "00") {
							$.tips({ msg: "解绑成功", timeOut: 800 }, function() {
								reqModule.openWindow("../jsp/myCard.jsp", "../jsp/myCard.jsp", {
									openId: openId
								});
							});
						} else {
							// "55"-密码错误，还有4次机会 "38"-请120秒后再输入密码
							$.alert(data.errMsg, " ", function(e) {});
						}
					},
					complete: function() {
						$("#numkeystage").find("i").css({ "border": "1px solid #999", "background": "#fff" });
					}
				});
			}

			if(operType == "pay") { // 支付
				reqModule.ajax({
					type: "POST",
					url: "qrcode/qrcodePay.do",
					data: {
						cardNo: cardCode, // 8807550010000033434 
						payPasswd: pw,
						billValue: (parseFloat(goodsPrice)).toFixed(2) * 1000000 / 10000, // 字面金额
						paymoney: (parseFloat(payNum)).toFixed(2) * 1000000 / 10000, // 实际扣款金额
						openId: openId,
						mchId: mchId,
						mchName: mchName,
						encryptStr: encryptStr
					},
					dataType: "json",
					success: function(data) {
						if(data.errCode == "00") {
							reqModule.openWindow("../jsp/result.jsp", "result.jsp", {
								res: "01",
								bus: goodsName,
								newcard: "01",
								card: cardCode,
								oid: openId
							});
						} else {
							// "55"-密码错误，还有4次机会 "38"-请120秒后再输入密码
							$.alert(data.errMsg, " ", function(e) {});
						}
					},
					complete: function() {
						$("#numkeystage").find("i").css({ "border": "1px solid #999", "background": "#fff" });
					}
				});
			}

		},

		// 事件绑定
		bindEvent: function() {

		},

		// 数字键盘
		numberKeyboard: function(doneback) {
			var pwStr = "";
			var pwIcon = $("#numkeystage").find("i");
			logicModule.stopDefault(true); // 阻止滑动屏幕
			$(".keyb_num").bind("tap", function() {
				var self = $(this);
				self.addClass("tbg_grey");
				setTimeout(function() {
					self.removeClass("tbg_grey");
				}, 100);

				if(pwStr.length >= 0 && pwStr.length <= 5) {
					pwStr = pwStr + self.val();
					for(var c = 1; c <= 6; c++) {
						if(c <= pwStr.length) {
							pwIcon.eq(c - 1).css("border", "1px solid #000");
							pwIcon.eq(c - 1).css("background", "#000");
						} else {
							pwIcon.eq(c - 1).css("border", "1px solid #999");
							pwIcon.eq(c - 1).css("background", "#fff");
						}
					}
				}

				if(pwStr.length == 6) {
					doneback(pwStr); // 回调函数
					pwStr = "";
				};

			});
			$("#keyb_delbtn").bind("tap", function() {
				var self = $(this);
				self[0].className = self[0].className.replace("keyb_del", "tbg_del");
				setTimeout(function() {
					self[0].className = self[0].className.replace("tbg_del", "keyb_del");
				}, 100);
				if(pwStr.length >= 1 && pwStr.length <= 6) {
					pwStr = pwStr.substring(0, pwStr.length - 1);
					for(var c = 1; c <= 6; c++) {
						if(c <= pwStr.length) {
							pwIcon.eq(c - 1).css("border", "1px solid #000");
							pwIcon.eq(c - 1).css("background", "#000");
						} else {
							pwIcon.eq(c - 1).css("border", "1px solid #999");
							pwIcon.eq(c - 1).css("background", "#fff");
						}
					}
				} else if(pwStr.length == 0) {
					for(var c = 0; c <= 5; c++) {
						pwIcon.eq(c).css("border", "1px solid #999");
						pwIcon.eq(c).css("background", "#fff");
					}
				}

			});
		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);