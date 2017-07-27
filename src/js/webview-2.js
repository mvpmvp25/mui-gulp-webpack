require('./module/public');

(function($) {

	var strModule = require('./module/string');
	
	var fromPageId = strModule.getUrlString("fromPageId");
	var viewApi, view;

	var main = {
		// 初始化执行
		init: function() {
			mui.init();
			this.pageView();
			this.bindEvent();
			this.getWebviewInfo();
		},

		// webview初始化
		pageView: function() {
			viewApi = $('#app').view({ defaultPage: '#setting' });
			view = viewApi.view;
			$('.mui-scroll-wrapper').scroll(); // 初始化单页的区域滚动
		},

		// 绑定事件
		bindEvent: function() {
			//处理view的后退与webview后退
			var oldBack = $.back;
			$.back = function() {
				if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
					viewApi.back();
				} else { 
					if($.os.plus) { // 关闭当前webview，并执行上一页自定义事件
						$.fire(plus.webview.getWebviewById(fromPageId), "webview-one");
						plus.webview.currentWebview().close();
					} else {//执行webview后退
						oldBack();
					}
				}
			};

			$(".e-btn").on("tap", "#page-btn", function() {
				viewApi.go("#notifications_disturb");
			});

			$(".w-btn").on("tap", "#window-btn", function() {
				$.openWindow({
					url: "webview-1.html",
					id: "webview-1.html",
					extras: {

					}
				});
			});

			//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
			//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
			view.addEventListener('pageBeforeShow', function(e) {
				//				console.log(e.detail.page.id + ' beforeShow');
				document.getElementById("debug-html").innerHTML = e.detail.page.id + ' beforeShow';

			});
			view.addEventListener('pageShow', function(e) {
				//				console.log(e.detail.page.id + ' show');
				document.getElementById("debug-html").innerHTML = e.detail.page.id + ' show';

			});
			view.addEventListener('pageBeforeBack', function(e) {
				//				console.log(e.detail.page.id + ' beforeBack');
				document.getElementById("debug-html").innerHTML = e.detail.page.id + ' beforeBack';

			});
			view.addEventListener('pageBack', function(e) {
				//				console.log(e.detail.page.id + ' back');
				document.getElementById("debug-html").innerHTML = e.detail.page.id + ' back';
			});
		},

		// 当前webview信息
		getWebviewInfo: function() {
			$.plusReady(function() { // 页面加载时立即使用plus需要$.plusReady
				document.getElementById("debug-app").innerHTML = JSON.stringify(plus.webview.currentWebview());
			});
			document.getElementById("debug-html").innerHTML = strModule.getUrlString("user") + "," + fromPageId;
		}

	}

	$.ready(function() {
		main.init();
	});
	

})(mui);