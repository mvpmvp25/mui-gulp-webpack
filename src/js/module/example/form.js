/**
 * 字符串模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function() {

	var formModule = {};

	//
	formModule.inputClear = function(params) {
		var defaults = {
			el: '.clear-input',
			iconClassName: 'clear-icon'
		};
		var options = strModule.extendObj(defaults, params);
		var inputList = document.querySelectorAll(options.el);
		for(var i = 0; i < inputList.length; i++) {
			inputList[i].addEventListener("input", function() {
				var self = this;
				var theVal = self.value;
				var isWriting = self.classList.contains("writing");
				var iconRemove = function() {
					var thisIconEle = self.nextSibling;
					thisIconEle.parentNode.removeChild(thisIconEle);
					self.classList.remove("writing");
				}
				if(theVal.length > 0) {
					if(!isWriting) { // 插入图标节点
						var iconEle = document.createElement("span");
						iconEle.classList.add(defaults.iconClassName);
						iconEle.addEventListener("click", function() {
							self.value = "";
							self.focus();
							iconRemove();
						})
						strModule.insertAfter(iconEle, self);
						self.classList.add("writing");
					}
				} else {
					if(isWriting) { // 清除之前的图标节点
						iconRemove();
					}
				}
			});
		}
	}

	return formModule;
})();