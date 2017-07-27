/**
 * 规则模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function() {

	var banDefault = function(e) { e.preventDefault(); }
	var logicModule = {};

	/**
	 * 获取验证码倒计时，默认倒计时60秒
	 * logicModule.timeDown($("#btn")[0], 5)
	 */
	logicModule.timeDown = function(o, s) {
		var t = arguments[1] || arguments[1] == 0 ? arguments[1] : 60;
		if(t == 0) {
			o.removeAttribute("disabled");
			o.value = "获取验证码";
		} else {
			o.setAttribute("disabled", true);
			o.value = "(" + t + "秒)重新获取";
			t--;
			setTimeout(function() {
				logicModule.timeDown(o, t);
			}, 1000);
		}
	}

	/**
	 * 阻止浏览器默认行为
	 */
	logicModule.stopDefault = function(isBan) {
		if(isBan) {
			document.addEventListener('touchmove', banDefault, false);
		} else {
			document.removeEventListener('touchmove', banDefault, false);
		}
	}

	/**
	 * setTimeout循环
	 * loopCall循环执行的方法，controlCall控制循环停止的方法，stopCall循环停止时回调的方法, speed循环速率
	 */
	logicModule.setTimeoutTask = function(loopCall, controlCall, stopCall, speed) {
		speed = speed || 10;
		loopCall && loopCall();
		if(controlCall && controlCall()) {
			stopCall && stopCall();
		} else {
			setTimeout(function() {
				logicModule.setTimeoutTask(loopCall, controlCall, stopCall);
			}, speed);
		}
	}

	/**
	 * setInterval循环
	 * loopCall循环执行的方法，controlCall控制循环停止的方法，stopCall循环停止时回调的方法, speed循环速率
	 */
	logicModule.setIntervalTask = function(loopCall, controlCall, stopCall, speed) {
		speed = speed || 10;
		var scan = function() {
			loopCall && loopCall();
			if(controlCall && controlCall()) {
				stopCall && stopCall();
				clearInterval(init);
			}
		}
		var init = setInterval(scan, speed);
	}

	return logicModule;
})();