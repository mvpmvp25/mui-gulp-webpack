/**
 * 表单模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function() {

	var formModule = {};

	// input值清除
	formModule.inputClear = function() {
		var options = {
			inputClass: 'clear-input',
			iconClassName: 'clear-icon',
			eyeClassName: 'eye-cion'
		};
		var inputList = document.querySelectorAll("." + options.inputClass);
		for(var i = 0; i < inputList.length; i++) {
			var theInput = inputList[i];
			if(theInput.getAttribute("data-skill") == "eye") {
				var eyeEle = document.createElement("i");
				eyeEle.classList.add(options.eyeClassName, "close-eye");
				eyeEle.addEventListener("touchstart", function() {
					var partnerInput = this.previousSibling;
					while(partnerInput.classList.toString().indexOf(options.inputClass) == -1) {
						partnerInput = partnerInput.previousSibling;
					}
					if(this.classList.toString().indexOf("close-eye") >= 0) {
						this.classList.remove("close-eye");
						this.classList.add("open-eye");
						partnerInput.setAttribute("type", "text");
					} else {
						this.classList.remove("open-eye");
						this.classList.add("close-eye");
						partnerInput.setAttribute("type", "password");
					}
				});
				strModule.insertAfter(eyeEle, theInput);
			}
			theInput.addEventListener("keyup", function() {
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