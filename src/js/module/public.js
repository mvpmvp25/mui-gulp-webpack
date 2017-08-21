/**
 * 公共模块(声明不分先后)
 * created by LittleYellow/441980627@qq.com
 */

require('./setting');

require("./mui_extend");

window.devModule = require('./dev');

window.md5Module = require('./md5');

window.strModule = require("./string");

window.reqModule = require("./request");

window.verifyModule = require('./verify');

window.formModule = require('./example/form');

window.sccModule = require('./plugin/send_check_code');

window.popupModule = require('./plugin/popup');