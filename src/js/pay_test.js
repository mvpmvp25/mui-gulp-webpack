require('./module/public');

(function($) {

	var payDesk = require('./module/plugin/fui-mui-paydesk-test');

	var testCard = [{ "accounttype": "2", "acctBal": "28.0", "bindTime": null, "cardBal": "0.0", "certNo": "", "certType": "", "id": "", "nPayPwd": "", "openId": "ohd71t60c_uyFk4KCZhMtzhkp420", "password": "161068", "payPwd": "", "stat": "0", "userName": "", "usercode": "8807550010000033434", "usertype": "", "valid": "1" }, { "accounttype": "2", "acctBal": "0.0", "bindTime": null, "cardBal": "0.0", "certNo": "", "certType": "", "id": "", "nPayPwd": "", "openId": "ohd71t60c_uyFk4KCZhMtzhkp420", "password": "864501", "payPwd": "", "stat": "12", "userName": "", "usercode": "8807551010004070324", "usertype": "", "valid": "0" }];
	//var testCard = [{ "accounttype": "2", "acctBal": "28.0", "bindTime": null, "cardBal": "0.0", "certNo": "", "certType": "", "id": "", "nPayPwd": "", "openId": "ohd71t60c_uyFk4KCZhMtzhkp420", "password": "161068", "payPwd": "", "stat": "0", "userName": "", "usercode": "8807551010004077741", "usertype": "", "valid": "1" }, { "accounttype": "2", "acctBal": "0.0", "bindTime": null, "cardBal": "0.0", "certNo": "", "certType": "", "id": "", "nPayPwd": "", "openId": "ohd71t60c_uyFk4KCZhMtzhkp420", "password": "864501", "payPwd": "", "stat": "12", "userName": "", "usercode": "8807551010004070324", "usertype": "", "valid": "0" }];

	var openId = strModule.getUrlString("openId");
	var mchId = strModule.getUrlString("mchId");
	var mchName = strModule.getUrlString("mchName");
	var encryptStr = strModule.getUrlString("encryptStr");

	var payShopNameEle = $("#payShopName");
	var tradeAmountEle = $("#tradeAmount");
	var payShopIdEle = $("#payShopId");

	var tradeAmount = "#tradeAmount";
	var tradeBtn = "#tradeBtn";

	var userCardList = [];
	userCardList = testCard;

	var main = {

		// 初始化执行
		init: function() {
			this.bindEvent();
			this.getCardInfo();
			this.payInfo();
			payDesk.init();
		},

		// 显示支付信息
		payInfo: function() {
			payShopNameEle.html(mchName);
			payShopIdEle.html(mchId);
		},

		// 获取已绑卡信息
		getCardInfo: function() {
			reqModule.ajax({
				load: false,
				type: "GET",
				url: "",//zlCard/getUserCards.execute
				data: {
					openId: openId
				},
				dataType: "json",
				success: function(data) {
					if(data.errCode == "00") {
						userCardList = data.data;
					} else {
						$.alert(data.errMsg, " ", function(e) {});
					}
				}
			});
		},

		// 事件绑定
		bindEvent: function() {

			$("body").on("input", tradeAmount, function() {
				if($(this).val().length > 0) {
					$(tradeBtn).removeClass("disabled");
				} else {
					$(tradeBtn).addClass("disabled");
				}
			});

			$("body").on("tap", tradeBtn, function() {

				if(!$(this).hasClass("disabled")) {
					var tradePay = tradeAmountEle.val();
					var inputRes = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/.test(tradePay); // 最多两位正小数
					tradeAmountEle[0].blur();

					if(inputRes) {
						payDesk.open({ // 发起支付
							goodsName: "扫码支付",
							goodsPrice: tradePay,
							goodsPay: tradePay,
							cardList: userCardList,
							openId: openId,
							mchId: mchId,
							mchName: mchName,
							encryptStr: encryptStr
						});
					} else {
						$.alert("请输入正确的金额(最多两位小数)", " ", function(e) {});
					}
				}
			});
		}

	};

	$.ready(function() {
		main.init();
	});

})(mui);