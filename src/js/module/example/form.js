/**
 * 字符串模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function() {

	var formModule = {};

	// input值清除
	formModule.inputClear = function() {
		var options = {
			el: '.clear-input',
			iconClassName: 'clear-icon',
			eyeClassName: 'eye-cion'
		};
		//var options = strModule.extendObj(defaults, params);
		var inputList = document.querySelectorAll(options.el);
		for(var i = 0; i < inputList.length; i++) {
			var theInput = inputList[i];
			if(theInput.getAttribute("data-skill") == "eye") {
				var eyeEle = document.createElement("i");
				eyeEle.classList.add(options.eyeClassName, "close-eye");
				eyeEle.addEventListener("touchstart", function() {
					if(eyeEle.classList.toString().indexOf("close-eye")  > 0){
						eyeEle.classList.remove("close-eye");
						eyeEle.classList.add("open-eye");
						theInput.setAttribute("type", "text");
					}else{
						eyeEle.classList.remove("open-eye");
						eyeEle.classList.add("close-eye");
						theInput.setAttribute("type", "password");
					}
				});
				strModule.insertAfter(eyeEle, theInput);
			}
			theInput.addEventListener("input", function() {
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
						iconEle.classList.add(options.iconClassName);
						iconEle.addEventListener("touchstart", function() {
							self.value = "";
							self.focus();
							iconRemove();
						});
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