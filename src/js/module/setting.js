/**
 * 基本配置
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function() {
	var setModule = {};
	
	// 初始化配置
	setModule.init = function() {
		setModule.fontSize();
		document.body.classList.remove("none");
	}

	// 设置页面HTML的fontsize属性
	setModule.fontSize = function() {
		var designSize = 640; // 设计稿宽尺寸(px)
		var designScale = 0.5; // 高保真缩小比例
		var baseSize = 20; // rem转px基数
		(function(doc, win) {
			var docEl = doc.documentElement,
				resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
				recalc = function() {
					var clientWidth = docEl.clientWidth;
					if(!clientWidth) return;
					clientWidth = Math.min(clientWidth, designSize);
					docEl.style.fontSize = baseSize * (clientWidth / (designSize * designScale)) + 'px';
				};
			if(!doc.addEventListener) return;
			win.addEventListener(resizeEvt, recalc, false);
			doc.addEventListener('DOMContentLoaded', recalc, false);
		})(document, window);
	}
	
	// 执行初始化
	setModule.init();
	
})();