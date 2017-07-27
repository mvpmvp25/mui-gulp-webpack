/**
 * 收银台模块
 * created by littleiellow/441980627@qq.com
 */

module.exports = (function($) {

	var logicModule = require("../logic");

	var kbPointer = "#keyboardPointer";
	var pwIcon = kbPointer + " li i";
	var keyBtn = ".kbNumber";
	var delBtn = "#kbDelBtn";
	var pwStr = ""; // 密码
	var payParmas = {
		pwTitle: "输入支付密码",
		cardTitle: "选择支付方式"
	};
	var payDeskModule = {}; // 收银台
	var payCardModule = {}; // 卡业务

	payDeskModule.init = function() {

		var keyboardBbHtml = "<div id='keyboardBg' class='keyboard-bg hidden' style='height:" + $("body").height() + "px;'></div>";

		var keyboardPointerHtml = "<ul id='keyboardPointer' class='keyboard-pointer'><li><i></i></li><li><i></i></li><li><i></i></li><li><i></i></li><li><i></i></li><li><i></i></li></ul>";

		var deskHtml = "<div id='fuiPaydesk' class='fui-paydesk fui-h5-fadeInUp hidden' data-layer='1'>" +
			"<div class='fui-paylayer'>" +
			"<p class='fui-pw-item fui-pw-title'><span class='fui-pw-close paydesk-close'><img src='../img/icon/close.png' /></span>" + payParmas.pwTitle + "</p>" +
			"<p class='fui-pw-item fui-pw-goods' id='fuiPwGoods'></p>" +
			"<p class='fui-pw-item fui-pw-price' id='fuiPwPrice'></p>" +
			"<p class='fui-pw-item fui-pw-pick paydesk-picker'>" +
			"<span class='fui-pw-cardmark'><img src='../img/icon/card.png' /></span>" +
			"<span class='fui-pw-cardcode'>卡号<em id='payDeskCard'></em></span>" +
			"<span class='fui-pw-cardarrow'><img src='../img/icon/next.png' /></span>" +
			"<span class='fui-pw-balance' id='payDeskBalance'></span>" +
			"</p>" +
			keyboardPointerHtml +
			"</div>" +
			"<div class='fui-paylayer none'>" +
			"<p class='fui-pw-item fui-card-title'><span class='fui-card-back paydesk-back'><img src='../img/icon/back.png' /></span>" + payParmas.cardTitle + "</p>" +
			"<div id='fuiCardBox'>" +
			//"<p class='fui-pw-item fui-card-cell paydesk-card-item' data-acct='8807551010004077741' data-balance='68.0'><span class='fui-card-view'>捷顺通卡(尾号7741)</span><span class='fui-card-balance'>￥68.0</span></p>" +
			//"<p class='fui-pw-item fui-card-cell paydesk-card-item' data-acct='8807551010004071111' data-balance='22.0'><span class='fui-card-view'>捷顺通卡(尾号1111)</span><span class='fui-card-balance'>￥12.0</span></p>" +
			"</div>" +
			"<p class='fui-pw-item fui-card-btn'><span class='fui-card-recharge'>&nbsp;</span><span class='fui-card-arrow'><img class='hidden' src='../img/icon/next.png' /></span></p>" +
			"</div>" +
			"</div>";

		var keyboardPressHtml = "<div id='keyboardPushkey' class='keyboard-pushkey hidden'><input class='kb-input kbNumber line' type='button' value='1' /><input class='kb-input kbNumber column line' type='button' value='2' /><input class='kb-input kbNumber column line' type='button' value='3' /><input class='kb-input kbNumber line' type='button' value='4' /><input class='kb-input kbNumber column line' type='button' value='5' /><input class='kb-input kbNumber column line' type='button' value='6' /><input class='kb-input kbNumber line' type='button' value='7' /><input class='kb-input kbNumber column line' type='button' value='8' /><input class='kb-input kbNumber column line' type='button' value='9' /><input class='kb-input useless' type='button' value=' ' /><input class='kb-input kbNumber column' type='button' value='0' /><input id='kbDelBtn' class='kb-input kb-del-btn column' type='button' value=' ' /></div>";

		$("body").append(keyboardBbHtml + deskHtml + keyboardPressHtml);

		// 输完密码开始支付
		payDeskModule.bindWrite(payDeskModule.callpay);
	}

	// 收银预处理
	payDeskModule.open = function(parmas) {

		payParmas = $.extend(payParmas, parmas);

		if(payParmas.cardList.length > 0) { // 已绑卡
			payCardModule.isAblePay(payParmas.cardList, payParmas.goodsPrice, function() { // 调出收银台
				payDeskModule.show();
				var defaultCardnum = "";
				var defaultCardbal = "";
				var payCardList = "";

				$("#fuiPwGoods").html(payParmas.goodsName);
				$("#fuiPwPrice").html("￥" + payParmas.goodsPrice);
				// 判断默认卡余额是否充足
				$.each(payParmas.cardList, function(key, val) {
					if(parseFloat(val.acctBal) > parseFloat(payParmas.goodsPrice)) {
						if(val.valid == 1) {
							defaultCardnum = val.usercode;
							defaultCardbal = val.acctBal;
							return false;
						}
					}
				});
				// 遍历其他余额充足的卡
				if(!strModule.checkEmpty(defaultCardnum)) {
					for(var t = 0; t < payParmas.cardList.length; t++) {
						if(parseFloat(payParmas.cardList[t].acctBal) > parseFloat(payParmas.goodsPrice)) {
							defaultCardnum = payParmas.cardList[t].usercode;
							defaultCardbal = payParmas.cardList[t].acctBal;
							break;
						}
					}
				}

				// 卡列表信息
				$.each(payParmas.cardList, function(key, val) {
					if(key >= 9) { // 最多只显示9张卡
						return false;
					}
					payCardList += "<p class='fui-pw-item fui-card-cell paydesk-card-item' data-acct='" + val.usercode + "' data-balance='" + parseFloat(val.acctBal).toFixed(2) + "'><span class='fui-card-view'>Coffice卡(尾号" + strModule.infoProtectDeal({ targetStr: val.usercode, keepEnd: 4, cipherLen: 0 }) + ")</span><span class='fui-card-balance'>￥" + parseFloat(val.acctBal).toFixed(2) + "</span></p>";

				});

				payDeskModule.payInfo(defaultCardnum, defaultCardbal);
				$("#fuiCardBox").html(payCardList);

			});
		} else { // 未绑卡-另一种支付方式
			$.confirm("您暂未绑定Coffice卡，是否去绑卡？", " ", ["暂不", "绑卡"], function(e) {
				if(e.index == 1) {
					payParmas.formpage = "pay.html";
					reqModule.openWindow("../jsp/bindCard.jsp", "../jsp/bindCard.jsp", payParmas);
				}
			});

		}
	}

	// 收银台样式
	payDeskModule.show = function() {
		pwStr = "";
		$(pwIcon).addClass("hidden");
		logicModule.stopDefault(true); // 阻止滑动屏幕
		$("#keyboardBg").removeClass("hidden");
		$("#fuiPaydesk").removeClass("hidden");
		$("#keyboardPushkey").removeClass("hidden");
	}

	// 事件绑定
	payDeskModule.bindWrite = function(doneback) {
		// 数字按键事件
		$("body").on("tap", keyBtn, function() {
			var self = $(this);
			self.addClass("kb-acitve");
			setTimeout(function() {
				self.removeClass("kb-acitve");
			}, 100);
			if(pwStr.length >= 0 && pwStr.length <= 5) {
				pwStr = pwStr + self.val();
				for(var c = 1; c <= 6; c++) {
					if(c <= pwStr.length) {
						$(pwIcon).eq(c - 1).removeClass("hidden");
					} else {
						$(pwIcon).eq(c - 1).addClass("hidden");
					}
				}
			}
			if(pwStr.length == 6) {
				doneback(pwStr, payParmas); // 回调函数
				setTimeout(function() {
					payDeskModule.close();
				}, 200);
			}
		});

		// 删除按键事件
		$("body").on("tap", delBtn, function() {
			var self = $(this);
			self.addClass("kb-del-acitve");
			setTimeout(function() {
				self.removeClass("kb-del-acitve");
			}, 100);
			if(pwStr.length >= 1 && pwStr.length <= 6) {
				pwStr = pwStr.substring(0, pwStr.length - 1);
				for(var c = 1; c <= 6; c++) {
					if(c <= pwStr.length) {
						$(pwIcon).eq(c - 1).removeClass("hidden");
					} else {
						$(pwIcon).eq(c - 1).addClass("hidden");
					}
				}
			} else if(pwStr.length == 0) {
				for(var c = 0; c <= 5; c++) {
					$(pwIcon).eq(c).addClass("hidden");
				}
			}
		});

		// 切换到卡列表
		$("body").on("tap", ".paydesk-picker", function() {
			payDeskModule.toCardList();
		});

		// 切换到收银台
		$("body").on("tap", ".paydesk-back", function() {
			payDeskModule.toPayDesk();
		});

		// 选择支付卡并返回收银台
		$("body").on("tap", ".paydesk-card-item", function() {
			if($("#fuiPaydesk").attr("data-layer") == "2") {
				payDeskModule.payInfo($(this).attr("data-acct"), $(this).attr("data-balance"));
				payDeskModule.toPayDesk();
			}
		});

		// 关闭收银台
		$("body").on("tap", ".paydesk-close", function() {
			payDeskModule.close();
		});

	}

	// 发起支付
	payDeskModule.callpay = function(pw, parmas) {
		var billVal = (parseFloat(parmas.goodsPrice)).toFixed(2) * 1000000 / 10000;
		var payVal = (parseFloat(parmas.goodsPay)).toFixed(2) * 1000000 / 10000;
		reqModule.ajax({
			type: "POST",
			url: "qrcode/qrcodePay.do",
			data: {
				cardNo: $("#payDeskCard").attr("data-card"), // 8807550010000033434 
				payPasswd: pw,
				billValue: billVal, // 字面金额
				paymoney: payVal, // 实际扣款金额
				openId: parmas.openId,
				mchId: parmas.mchId,
				mchName: parmas.mchName,
				encryptStr: parmas.encryptStr

			},
			dataType: "json",
			success: function(data) {
				if(data.errCode == "00") {
					reqModule.openWindow("pay_result.html", "pay_result.html", {
						money: payVal / 100,
						shop: parmas.mchName
					});
				} else {
					// "55"-密码错误，还有4次机会 "38"-请120秒后再输入密码
					$.alert(data.errMsg, " ", function(e) {});
				}
			}
		});
	}

	// 显示支付信息
	payDeskModule.payInfo = function(card, bal) {
		$("#payDeskCard").attr("data-card", card);
		$("#payDeskCard").html(strModule.infoProtectDeal({
			targetStr: card,
			keepEnd: 4,
			cipherLen: 3
		}));
		$("#payDeskBalance").html("￥" + parseFloat(bal).toFixed(2));
	}

	// 收银台切换到卡列表
	payDeskModule.toCardList = function() {
		$(".fui-paylayer").eq(0).addClass("fui-h5-fadeOutLeft none");
		$(".fui-paylayer").eq(0).removeClass("fui-h5-fadeInLeft");
		$(".fui-paylayer").eq(1).addClass("fui-h5-fadeInRight");
		$(".fui-paylayer").eq(1).removeClass("fui-h5-fadeOutRight none");
		$("#fuiPaydesk").attr("data-layer", "2");
		$("#keyboardPushkey").addClass("hidden");
	}

	// 卡列表切换到收银台
	payDeskModule.toPayDesk = function() {
		$(".fui-paylayer").eq(0).addClass("fui-h5-fadeInLeft");
		$(".fui-paylayer").eq(0).removeClass("fui-h5-fadeOutLeft none");
		$(".fui-paylayer").eq(1).addClass("fui-h5-fadeOutRight none");
		$(".fui-paylayer").eq(1).removeClass("fui-h5-fadeInRight");
		$("#fuiPaydesk").attr("data-layer", "1");
		$("#keyboardPushkey").removeClass("hidden");
	}

	// 关闭收银台
	payDeskModule.close = function() {
		pwStr = "";
		logicModule.stopDefault(false);
		$("#keyboardBg").addClass("hidden");
		$("#fuiPaydesk").addClass("hidden");
		$("#keyboardPushkey").addClass("hidden");
		$(".fui-paylayer").removeClass("fui-h5-fadeInLeft fui-h5-fadeOutLeft fui-h5-fadeOutRight fui-h5-fadeInRight");
	}

	// 是否可以支付
	payCardModule.isAblePay = function(cardlist, payprice, dopay) {
		var payabletype = 0;
		var theCard = "";

		if(strModule.checkEmpty(payprice)) {
			if(cardlist.length == 1) {
				// 绑一张卡
				theCard = cardlist[0].usercode;
				switch(cardlist[0].stat) {
					case 13:
						payabletype = 1;
						break;
					case 0:
						if(parseFloat(payprice) < parseFloat(cardlist[0].acctBal)) { payabletype = 0; } else { payabletype = 3; }
						break;
					case "00":
						if(parseFloat(payprice) < parseFloat(cardlist[0].acctBal)) { payabletype = 0; } else { payabletype = 3; }
						break;
					default:
						payabletype = 2;
				}
			} else {
				// 绑多张卡
				$.each(cardlist, function(key, val) {
					if(val.valid == 1) {
						theCard = val.usercode;
					}
				});
				$.each(cardlist, function(key, val) {
					if(val.stat != 0 && val.stat != "00") { payabletype += 1 }
				});
				if(payabletype == cardlist.length) {
					payabletype = 11
				} else {
					payabletype = 0;
					$.each(cardlist, function(key, val) {
						if((val.stat == 0 || val.stat == "00") && parseFloat(payprice) < parseFloat(val.acctBal)) { payabletype += 1; }
					});
					if(payabletype == 0) {
						payabletype = 12;
					} else {
						payabletype = 0;
					}
				}
			}
		} else {
			payabletype = -1;
		}

		if(payabletype == 0) {
			dopay(); // 可以支付
		} else {
			payCardModule.stopPay(theCard, payabletype); // 不可以支付
		}

	}

	// 不能支付的状态
	payCardModule.stopPay = function(cardcode, paytype) {

		switch(paytype) {
			case -1:
				$.alert("请输入金额", " ", function(e) {});
				break;
			case 1:
				$.confirm("该Coffice卡(尾号" + strModule.infoProtectDeal({ targetStr: cardcode, keepEnd: 4, cipherLen: 0 }) + ")已挂失，可拨打<em class='tips'>400-700-5305</em>联系客服，或使用其他卡片支付", " ", ["确定", "其他卡支付"], function(e) {
					if(e.index == 1) {
						payParmas.formpage = "pay.html";
						reqModule.openWindow("../jsp/bindCard.jsp", "../jsp/bindCard.jsp", payParmas);
					}
				});
				break;
			case 2:
				$.confirm("该Coffice卡(尾号" + strModule.infoProtectDeal({ targetStr: cardcode, keepEnd: 4, cipherLen: 0 }) + ")存在异常，可拨打<em class='tips'>400-700-5305</em>联系客服，或使用其他卡片支付", " ", ["确定", "其他卡支付"], function(e) {
					if(e.index == 1) {
						payParmas.formpage = "pay.html";
						reqModule.openWindow("../jsp/bindCard.jsp", "../jsp/bindCard.jsp", payParmas);
					}
				});
				break;
			case 3:
				$.alert("该Coffice卡(尾号" + strModule.infoProtectDeal({ targetStr: cardcode, keepEnd: 4, cipherLen: 0 }) + ")余额不足", " ", function(e) {});
				break;
			case 11:
				$.confirm("您暂无可使用的Coffice卡，可拨打<em class='tips'>400-700-5305</em>联系客服，或使用其他卡片支付", " ", ["确定", "其他卡支付"], function(e) {
					if(e.index == 1) {
						payParmas.formpage = "pay.html";
						reqModule.openWindow("../jsp/bindCard.jsp", "../jsp/bindCard.jsp", payParmas);
					}
				});
				break;
			case 12:
				$.alert("您暂无足够余额的卡片进行支付", " ", function(e) {});
				break;
		}
	};

	return payDeskModule;
})(mui);