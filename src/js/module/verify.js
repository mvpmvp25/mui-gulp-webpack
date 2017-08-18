/**
 * 验证模块
 * created by LittleYellow/441980627@qq.com
 */

module.exports = {

	/**
	 * 验证策略
	 */

	check: function(rule, val) {
		var res = false;
		if(rule == "mobile") {
			res = /^1[3|4|5|7|8|9]\d{9}$/.test(val);
		}
		if(rule == "email") {
			res = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(val);
		}
		if(rule == "money") {
			res = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/.test(val);
		}
		if(rule == "password") {
			res = /^(?![^A-Za-z]+$)(?![^0-9]+$)[\x21-\x7E]{6,20}$/.test(val);
		}
		return res;
	},

	/**
	 * 验证策略
	 * rule为"isMobile", "isEmail"等方法
	 * paramData为eid-提示元素id，tips-错误提示语， val-需校验的值
	 */

	//	check: function(rule, paramData) {
	//
	//		var holder = {
	//			isMobile: function() {
	//				var options = strModule.extendObj({ tips: "请输入正确的手机号码" }, paramData);
	//				var res = /^1[3|4|5|7|8|9]\d{9}$/.test(options.val);
	//				document.getElementById(options.eid).innerHTML = res ? "" : options.tips;
	//			},
	//			isEmail: function() {
	//				var options = strModule.extendObj({ tips: "请输入正确的邮箱账号" }, paramData);
	//				var res = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(options.val);
	//				document.getElementById(options.eid).innerHTML = res ? "" : options.tips;
	//			},
	//			isMoney: function() {
	//				var options = strModule.extendObj({ tips: "请输入正确的金额(最多两位小数)" }, paramData);
	//				var res = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/.test(options.val);
	//				document.getElementById(options.eid).innerHTML = res ? "" : options.tips;
	//			}
	//		}
	//
	//		var task = function(dealName) {
	//			holder[dealName]();
	//		}
	//
	//		task(rule);
	//	},

	/**
	 * 校验企业营业执照号
	 * 如：430100400007489
	 */
	licenceCode: function(busCode) {
		var ret = false;
		if(busCode.length == 15) {
			var sum = 0;
			var s = [];
			var p = [];
			var a = [];
			var m = 10;
			p[0] = m;
			for(var i = 0; i < busCode.length; i++) {
				a[i] = parseInt(busCode.substring(i, i + 1), m);
				s[i] = (p[i] % (m + 1)) + a[i];
				if(0 == s[i] % m) {
					p[i + 1] = 10 * 2;
				} else {
					p[i + 1] = (s[i] % m) * 2;
				}
			}
			if(1 == (s[14] % m)) {
				ret = {
					res: true,
					msg: "ok"
				}; //营业执照编号正确!
			} else {
				ret = {
					res: false,
					msg: "请输入正确的营业执照编号"
				};
			}
		} else if(busCode == "") {
			ret = {
				res: false,
				msg: "请输入正确的营业执照编号"
			}; // 营业执照编号不能为空
		} else {
			ret = {
				res: false,
				msg: "格式不正确，营业执照号须为15位数字组成"
			};
		}
		return ret;
	},

	/**
	 * 校验组织机构代码
	 * 如：05230317-7、X3203231-4
	 */
	orgCode: function(orgCode) {
		var ret = false;
		var codeVal = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		var intVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
		var crcs = [3, 7, 9, 10, 5, 8, 4, 2];
		if(!("" == orgCode) && orgCode.length == 10) {
			var sum = 0;
			for(var i = 0; i < 8; i++) {
				var codeI = orgCode.substring(i, i + 1);
				var valI = -1;
				for(var j = 0; j < codeVal.length; j++) {
					if(codeI == codeVal[j]) {
						valI = intVal[j];
						break;
					}
				}
				sum += valI * crcs[i];
			}
			var crc = 11 - (sum % 11);

			switch(crc) {
				case 10:
					{
						crc = "X";
						break;
					}
				default:
					{
						break;
					}
			}
			if(crc == orgCode.substring(9)) {
				ret = {
					res: true,
					msg: "ok"
				};
			} else {
				ret = {
					res: false,
					msg: "请输入正确的组织机构代码"
				};
			}
		} else if(orgCode == "") {
			ret = {
				res: false,
				msg: "请输入正确的组织机构代码"
			};
		} else {
			ret = {
				res: false,
				msg: "格式不正确，必须为8位数字或大写字母+“-”+1位校验码"
			}; //格式不正确，组织机构代码为8位数字或者拉丁字母+“-”+1位校验码，并且字母必须大写
		}
		return ret;
	},

	/**
	 * 校验身份证号码
	 * 支持15位身份证号码校验
	 */
	identityCode: function(code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //加权因子
		var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; //校验位
		var pass = {
			res: true,
			msg: "ok"
		};
		if(code.length == 15) {
			code = code.substring(0, 6) + "19" + code.substring(6, 15);
			var ocode = code.split('');
			var osum = 0;
			for(var i = 0; i < 17; i++) {
				osum += ocode[i] * factor[i];
			}
			code = code + (parity[osum % 11]).toString();
		}
		if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
			pass = {
				res: false,
				msg: "请输入正确的身份证号码"
			}; // 身份证号格式错误
		} else if(!city[code.substr(0, 2)]) {
			pass = {
				res: false,
				msg: "请输入正确的身份证号码"
			}; // 地址编码错误
		} else {
			//18位身份证需要验证最后一位校验位
			if(code.length == 18) {
				code = code.split('');
				var sum = 0;
				for(var i = 0; i < 17; i++) {
					sum += code[i] * factor[i];
				}
				if(parity[sum % 11] != code[17]) {
					pass = {
						res: false,
						msg: "请输入正确的身份证号码"
					}; // 校验位错误
				}
			}
		}
		return pass;
	}
};