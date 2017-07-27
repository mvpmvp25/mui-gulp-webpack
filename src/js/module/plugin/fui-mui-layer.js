/**
 * 银行卡列表模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function($) {
	
	var bcList = {};

	// 阻止浏览器默认事件
	bcList.banDefault = function(e) {
		e.preventDefault();
	}

	// 初始化数据和DOM
	bcList.init = function(params) {
		var defaults = {
			list: [], // 卡列表数据
			item: 5, // 区域可见银行卡张数
			itemHeight: 2.5, // item高度(单位rem)
			callBack: function() {} // 选择银行卡后回调方法
		};
		var options = $.extend(defaults, params);
		var popupBankcardMaskEle = document.getElementById('popupBankcardMask');
		var popupBankcardBoxEle = document.getElementById('popupBankcardBox');
		var bcMaskTpl = '<div id="popupBankcardMask" class="popup-bankcard-mask popup-cell"></div>';
		var bcBoxTpl = '<div id="popupBankcardBox" class="popup-bankcard-box popup-cell"><div class="popup-title"><i class="popup-close"></i>选择银行卡</div><div id="popupContent" class="popup-content" style="{{contentStyle}}"><ul class="popup-list mui-scroll">{{itemTpl}}<li class="popup-list-add" style="{{additemStyle}}"><span class="popup-add-logo"><img src="" /></span><span class="popup-add-text">添加新卡</span><span class="popup-add-icon"></span></li></ul></div></div>';
		var bcItemTpl = '<li class="popup-list-item" style="{{itemStyle}}" data-name="{{cardName}}" data-code="{{cardCode}}" data-short="{{shortName}}"><span class="popup-list-logo">{{logoImg}}</span><span class="popup-list-text">{{cardInfo}}</span></li>';
		var bcItemHtml = "";

		$.each(options.list, function(key, val) {
			var logoImg = "<img src='' />";
			var cardInfo = val.bankName + "（尾号" + val.bankNo.substr(-4) + "）";
			bcItemHtml += bcItemTpl.replace(/{{itemStyle}}/g, "height:" + options.itemHeight + "rem;line-height:" + options.itemHeight + "rem")
				.replace(/{{cardName}}/g, val.bankName)
				.replace(/{{cardCode}}/g, val.bankNo)
				.replace(/{{shortName}}/g, val.bankShort)
				.replace(/{{logoImg}}/g, logoImg)
				.replace(/{{cardInfo}}/g, cardInfo);
		});

		bcBoxTpl = bcBoxTpl.replace(/{{additemStyle}}/g, "height:" + options.itemHeight + "rem;line-height:" + options.itemHeight + "rem")
			.replace(/{{contentStyle}}/g, "height:" + (options.list.length + 1) * options.itemHeight + "rem;max-height:" + (options.item + 1) * options.itemHeight + "rem")
			.replace(/{{itemTpl}}/g, bcItemHtml);

		if(strModule.checkEmpty(popupBankcardMaskEle && popupBankcardBoxEle)) { // 清除之前的DOM
			popupBankcardMaskEle.parentNode.removeChild(popupBankcardMaskEle);
			popupBankcardBoxEle.parentNode.removeChild(popupBankcardBoxEle);
		}

		document.querySelector("body").insertAdjacentHTML("beforeEnd", bcMaskTpl + bcBoxTpl);

		// 区域滚动
		$('#popupContent').scroll({
			indicators: false, //是否显示滚动条
			bounce: false // 是否启用回弹
		});

		bcList.bindEvent(options.callBack);

	};

	// 事件绑定处理
	bcList.bindEvent = function(callBack) {
		$(".popup-close").bind("tap", function() {
			bcList.close();
		});
		$(".popup-list-item").bind("tap", function() {
			var resData = {};
			resData.cardname = $(this).attr("data-name");
			resData.cardcode = $(this).attr("data-code");
			resData.shortname = $(this).attr("data-short");
			callBack && callBack(resData);
			bcList.close();
		});
		$(".popup-list-add").bind("tap", function() {
			console.log("添加新卡");
			bcList.close();
		});
	};

	// 显示列表
	bcList.open = function() {
		$("#popupBankcardMask").removeClass("popup-fadeOut");
		$("#popupBankcardMask").addClass("popup-fadeIn");
		$("#popupBankcardBox").removeClass("popup-fadeInDown");
		$("#popupBankcardBox").addClass("popup-fadeInUp");
		$(".popup-cell").css("display", "block");
		document.addEventListener('touchmove', bcList.banDefault, false);
	};

	// 关闭列表
	bcList.close = function() {
		$("#popupBankcardMask").removeClass("popup-fadeIn");
		$("#popupBankcardMask").addClass("popup-fadeOut");
		$("#popupBankcardBox").removeClass("popup-fadeInUp");
		$("#popupBankcardBox").addClass("popup-fadeInDown");
		setTimeout(function() {
			$(".popup-cell").css("display", "none");
		}, 100);
		$('#popupContent').scroll().scrollTo(0, 0, 0);
		document.removeEventListener('touchmove', bcList.banDefault, false);
	};

	return bcList;
})(mui);