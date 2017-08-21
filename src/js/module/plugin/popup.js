/**
 * 弹窗模块
 * created by LittleYellow/441980627@qq.com
 * init()初始化后再调用
 * popupModule.open({
		templet: '<div style="width:257px;height:170px;background:#FCFCFC;position:fixed;left:50%;top:150px;z-index:1;margin-left:-128.5px;border-radius:12px;"></div>'
	});
 */

module.exports = (function($) {

	var popup = {}; // 弹窗模块

	// 阻止浏览器默认事件
	popup.banDefault = function(e) {
		e.preventDefault();
	}

	// 弹窗初始化
	popup.init = function() {
		var popupMaskTpl = '<div id="popupMask" class="popup-mask popup-hide"></div><div id="popupContent" class="popup-content popup-close popup-hide"></div>';
		document.querySelector("body").insertAdjacentHTML("beforeEnd", popupMaskTpl);

	}

	// 打开弹窗
	popup.open = function(params) {
		var defaults = {
			templet: "<div></div>"
		};
		var options = $.extend(defaults, params);
		$("#popupMask").removeClass("popup-hide popup-fadeOut").addClass("popup-fadeIn");
		$("#popupContent").html(options.templet);
		$("#popupContent").removeClass("popup-hide popup-fadeInDown").addClass("popup-fadeInUp");
		$(".popup-close").bind("tap", function() {
			popup.close();
		});
		document.addEventListener('touchmove', popup.banDefault, false);
	}

	// 关闭弹窗
	popup.close = function() {
		$("#popupMask").removeClass("popup-fadeIn").addClass("popup-fadeOut");
		$("#popupContent").removeClass("popup-fadeInUp").addClass("popup-fadeInDown");
		setTimeout(function() {
			$("#popupMask").addClass("popup-hide");
			$("#popupContent").addClass("popup-hide");
			$("#popupContent").html("");
		}, 100);
		document.removeEventListener('touchmove', popup.banDefault, false);
	}

	return popup;
})(mui);