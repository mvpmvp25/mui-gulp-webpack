/**
 * MUI扩展方法
 * created by LittleYellow/441980627@qq.com
 */

module.exports = (function($, window) {

	/**
	 * DOM事件
	 * bind
	 */
	$.extend($.fn, {
		bind: function(event, callback) {
			return this.each(function() {
				this.addEventListener(event, callback);
			});
		}
	});
	/* DOM事件  END */

	/**
	 * DOM选择器
	 * siblings|parent|children|size|eq|first|last|find|get|filter|next|prev|nextAll|prevAll
	 */
	var sibling,
		siblings,
		dir;
	sibling = function(cur, dir) {
		do {
			cur = cur[dir];
		} while (cur && cur.nodeType !== 1);

		return cur;
	};
	siblings = function(n, elem) {
		var matched = [];
		for(; n; n = n.nextSibling) {
			if(n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};
	dir = function(elem, dir) {
		var matched = [];
		if(!elem) {
			return matched;
		};
		while((elem = elem[dir]) && elem.nodeType !== 9) {
			if(elem.nodeType === 1) {
				matched.push(elem);
			}
		}
		return matched;
	};
	$.each({
		siblings: function(elem) {
			return siblings((this[0].parentNode || {}).firstChild, elem);
		},
		parent: function(elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? $(parent) : null;
		},
		children: function(selector) {
			return siblings(this[0].firstChild, selector);
		},
		next: function(elem) {
			return sibling(elem, "nextSibling");
		},
		prev: function(elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function(elem) {
			return dir(elem, "nextSibling");
		},
		prevAll: function(elem) {
			return dir(elem, "previousSibling");
		}
	}, function(name, fn) {
		$.fn[name] = function(until, selector) {
			if(name.slice(-5) !== "Until") {
				selector = until;
			}
			var ret = fn.call(this, this[0]);
			$.type(ret) === "array" ?
				((ret = $(ret).filter(selector)) && (ret = $.unique(ret))) : ret = $(ret);
			return ret.length > 0 ? $.extend($(""), ret, { selector: selector }) : $("");
		}
	});

	$.extend($.fn, {
		size: function() {
			return this.length;
		},
		eq: function(n) {
			return $(this[n]);
		},
		first: function() {
			return this.eq(0);
		},
		last: function() {
			return this.eq(this.size() - 1);
		},
		find: function(selector) {
			var ret = this[0].querySelectorAll(selector);
			return ret.length > 0 ? $.extend($(""), ret, { selector: selector }) : $("")
		},
		get: function(num) {
			return num != null ?

				// Return just the one element from the set
				(num < 0 ? this[num + this.length] : this[num]) :

				// Return all the elements in a clean array
				$.slice.call(this);
		},
		filter: function(selector) {
			return $.filter(this[0], selector)
		}
	});
	/* DOM选择器  END */

	/* 属性操作  addClass|removeClass|hasClass|html|text|val|css|attr|prop|width|height|removeAttr|remove */
	var operatClass,
		operatDom,
		operatAttr;

	operatClass = function(classlist, operatType) {
		var self = this,
			noNum = 0;
		classlist = classlist.split(/\s+/g);
		$.each(classlist, function(key, _class) {
			$.each(self, function(key, doms) {
				operatType !== "has" ?
					self[key].classList[operatType](_class) :
					!self[key].classList.contains(_class) && noNum++;
			});
		});
		return operatType === "has" ? noNum === 0 : self;
	};
	operatDom = function(val, operatType) {
		if(!val && $.type(val) !== "string" && this[0]) {
			return this[0][operatType];
		}
		$.each(this, function(key, obj) {
			obj[operatType] = val;
		});
		return this;
	};
	operatAttr = function(data) {
		var self = this;
		if(!!data && $.type(data) === "string" && this[0]) {
			return this[0].getAttribute(data);
		}
		$.each(this, function(key, obj) {
			$.each(data, function(key, val) {
				$.type(data) === "object" ?
					obj.setAttribute(key, val) :
					obj.removeAttribute(val);
			});
		});
		return this;
	};
	$.extend($.fn, {
		addClass: function(key) {
			return operatClass.apply(this, [key, "add"]);
		},
		removeClass: function(key) {
			return operatClass.apply(this, [key, "remove"]);
		},
		hasClass: function(key) {
			return operatClass.apply(this, [key, "has"]);
		},
		html: function(html) {
			return operatDom.apply(this, [html, "innerHTML"]);
		},
		text: function(text) {
			return operatDom.apply(this, [text, "innerText"]);
		},
		val: function(val) {
			return operatDom.apply(this, [val, "value"]);
		},
		css: function(key, val) {
			var obj = {};
			if(!key) {
				return this;
			}
			if($.type(key) === "string") {
				if(!!val) {
					obj[key] = val;
				} else {
					return document.defaultView.getComputedStyle(this[0])[key]
				}
			}
			if($.type(key) === "object") {
				obj = key;
			}

			$.each(this, function(ind, O) {
				$.each(obj, function(k, v) {
					O.style[k] = v;
				})
			})
			return this
		},
		attr: function(key, val) {
			var data = {};
			if($.type(key) === "string") {
				if(!val) {
					data = key;
				} else {
					data[key] = val;
				}
			} else if($.type(key) === "object") {
				data = key;
			} else {
				return this;
			}
			return operatAttr.call(this, data);
		},
		prop: function(key, val) {
			return this.attr(key, val);
		},
		width: function(val) {
			if(val) {
				this.css("width", val);
				return this;
			}
			return this[0].offsetWidth
		},
		height: function(val) {
			if(val) {
				this.css("height", val);
				return this;
			}
			return this[0].offsetHeight
		},
		removeAttr: function(key) {
			if(!key || !($.type(key) === "array" || $.type(key) === "string")) {
				return this;
			}
			return operatAttr.call(this, $.type(key) === "array" ? key : key.split(/\s+/g));
		},
		remove: function() {
			this[0].remove();
		}
	});
	/* 属性操作 END */

	/* DOM操作  prepend|append|before|after */
	function traverseNode(node, fun) {
		fun(node);
		for(var i = 0, len = node.childNodes.length; i < len; i++) {
			traverseNode(node.childNodes[i], fun)
		}
	}
	var fragmentRE = /^\s*<(\w+|!)[^>]*>/,
		singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
		fragment,
		table = document.createElement('table'),
		tableRow = document.createElement('tr'),
		containers = {
			'tr': document.createElement('tbody'),
			'tbody': table,
			'thead': table,
			'tfoot': table,
			'td': tableRow,
			'th': tableRow,
			'*': document.createElement('div')
		};
	fragment = function(html, name, properties) {
		var dom, nodes, container

		if(singleTagRE.test(html)) {
			dom = $(document.createElement(RegExp.$1))
		}

		if(!dom) {
			dom = [];
			if(html.replace) {
				html = html.replace(tagExpanderRE, "<$1></$2>")
			}
			if(name === undefined) {
				name = fragmentRE.test(html) && RegExp.$1
			}
			if(!(name in containers)) {
				name = '*'
			}

			container = containers[name];
			container.innerHTML = '' + html;
			$.each([].slice.call(container.childNodes), function(_, el) {
				dom.push(el)
			})
		}
		return dom
	};
	$.each(['after', 'prepend', 'before', 'append'], function(operatorIndex, operator) {
		var inside = operatorIndex % 2; //=> prepend, append
		$.fn[operator] = function() {
			var argType, nodes = [],
				parent, copyByClone = this.length > 1;
			$.each(arguments, function(_, arg) {
				var arr = [],
					argType = $.type(arg);
				if(argType == "array") {
					arg.forEach(function(el) {
						if(el.nodeType !== undefined) return arr.push(el)
						else
							arr = arr.concat(fragment(el))
					})
					return arr
				}
				$.extend(nodes, argType == "object" || arg == null ?
					arg : fragment(arg));
			});
			if(nodes.length < 1) {
				return this
			}
			return this.each(function(_, target) {
				parent = inside ? target : target.parentNode
				// convert all methods to a "before" operation
				target = operatorIndex == 0 ? target.nextSibling :
					operatorIndex == 1 ? target.firstChild :
					operatorIndex == 2 ? target :
					null;
				var parentInDocument = $.contains(document.documentElement, parent);
				nodes.forEach(function(node) {
					if(copyByClone) {
						node = node.cloneNode(true)
					} else if(!parent) {
						return $(node).remove()
					}
					parent.insertBefore(node, target);

					if(parentInDocument) traverseNode(node, function(el) {
						if(el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
							(!el.type || el.type === 'text/javascript') && !el.src) {
							var target = el.ownerDocument ? el.ownerDocument.defaultView : window
							target['eval'].call(target, el.innerHTML)
						}
					})
				})
			})
		}

		// after    => insertAfter
		// prepend  => prependTo
		// before   => insertBefore
		// append   => appendTo
		$.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function(html) {
			$(html)[operator](this)
			return this
		}
	});
	/* DOM操作 END */

	/**
	 * 常用函数 noop|filter|unique|timer|contains
	 * 用法：mui.timer(times, endFunction, timeFunction)
	 */
	$.extend({
		noop: function() {},
		filter: function(elements, selector) {
			var
				idRE = /^#([\w-]+)$/,
				classRE = /^\.([\w-]+)$/,
				tagRE = /^[\w-]+$/,
				deal = false,
				ret = [];
			if($.type(selector) === "function") {
				$.type(elements) === "object" && (ret = {});
				$.each(elements, function(key, val) {
					var r = selector(key, val);
					$.type(r) === "boolean" && (r && (r = val));
					$.type(r) === "number" ?
						($.type(key) === "number" ? ret.push(r) : ret[key] = r) :
						(r && ($.type(key) === "number" ? ret.push(r) : ret[key] = val))
				});
				return ret;
			}
			if($.type(selector) === "string") {
				$.each(elements, function(k, elem) {
					$.each(selector.split(/\s*,\s*/), function(k, sel) {
						if(idRE.test(sel)) {
							$(elem).attr("id") === $.slice.call(sel, 1).join("") ? ret.push(elem) : null
						}
						if(classRE.test(sel)) {
							$(elem).hasClass($.slice.call(sel, 1).join("")) ? ret.push(elem) : null
						}
						if(tagRE.test(sel)) {
							$(elem)[0].tagName.toLowerCase() === sel ? ret.push(elem) : null;
						}
					})
				});
				return ret;
			}
			return elements;
		},
		unique: function(elements) {
			var ret = [];
			$.each(elements, function(k, elem) {
				ret.indexOf(elem) === -1 ? ret.push(elem) : null
			});
			return ret;
		},
		timer: function(N, endFn, timeFn) {
			endFn = endFn || $.noop;
			timeFn = timeFn || $.noop;
			(function(N) {
				var args = arguments;
				if(N === 0) {
					endFn();
					return;
				}
				timeFn(N);
				setTimeout(function() {
					args.callee(--N);
				}, 1000);
			})(N);
		},
		contains: function(parent, node) {
			if(document.documentElement.contains) {
				return parent !== node && parent.contains(node)
			}
			if(node && (node = node.parentNode)) {
				if(node === parent) {
					return true
				}
			}
			return false
		}

	});
	/* 常用函数  END */

	/**
	 * 业务交互 ktoast|loadPop|kajax
	 */
	//var pop = mui.loadPop();pop.create();pop.remove();
	//完整写法mui.ktoast({msg:"test", "timeOut":2000, align:"middle"}, function(){});
	//简写mui.ktoast("test")

	$.extend({
		tips: function(option, cb) { // 提示框
			var opts = $.extend({
					msg: "",
					align: "middle",
					timeOut: 2000
				}, $.isObject(option) ? option : { msg: option }),
				css = ["top", "middle", "bottom"];

			cb = cb || $.noop;
			var toast = document.createElement('div');
			toast.classList.add('tips-container');
			toast.classList.add(css.indexOf(opts.align) + 1 ? opts.align : css[1]);
			toast.innerHTML = '<div class="tips-message">' + opts.msg + '</div>';
			document.body.appendChild(toast);
			setTimeout(function() {
				document.body.removeChild(toast);
				cb();
			}, opts.timeOut);
		},
		loadPop: function() {
			var pop;
			return {
				create: function(cb) {
					cb = cb || $.noop;
					if(pop) {
						document.body.removeChild(pop);
						return;
					}
					pop = document.createElement("div");
					pop.classList.add('loading-pop');
					pop.innerHTML = '<div class="loading-message"><span class="loading-spinner"></span></div>';
					document.body.appendChild(pop);
					cb();
				},
				remove: function(cb) {
					cb = cb || $.noop;
					if(!pop) { return; }
					setTimeout(function() {
						document.body.removeChild(pop);
						pop = null;
						cb();
					}, 1000);
				}
			};
		}
		//		request: function(parmas) {
		//			parmas = $.extend({ success: $.noop, error: $.noop }, parmas);
		//			var pop = $.loadPop();
		//			pop.create();
		//			$.ajax(parmas.url, {
		//				data: parmas.data,
		//				dataType: 'json',
		//				type: 'post',
		//				timeout: 10000,
		//				success: function() {
		//					var grgs = arguments;
		//					pop.remove(function() {
		//						parmas.success.apply([], grgs)
		//					});
		//				},
		//				error: function() {
		//					var grgs = arguments;
		//					pop.remove(function() {
		//						parmas.error.apply([], grgs)
		//					});
		//				}
		//			})
		//		}
	});
	/* 业务交互  END */

	/**
	 * 监听(图片)加载状态
	 */
	// 用法：mui.kfetch({ object: mui("img"), success: function(res){}, error: function(res){}, complete: function(res){} });
	// 或       $("img").kfetch({ before: function(res){}, success: function(res){}, error: function(res){}, complete: function(status, faillist){} });

	//	var involidName = "data-kimg-over";
	//  var o = function(obj){
	//          return $.isArray(obj)
	//              ? [].concat(obj)
	//                  : (
	//                      /^([#\.]\w+|\w+)$/.test(obj)
	//                          ? [].concat($(obj)) 
	//                              : [].concat(obj) 
	//                  );
	//      };
	//  var objects = function(data){
	//      var res = [];
	//      // 先转化为数组
	//      $.each(o(data.list), function(ind, obj){
	//          var _object = singleObject(obj, data);
	//          if(!$.isEmptyObject(_object)){
	//            res = res.concat(_object)  
	//          }
	//      });
	//      return !$.isEmptyObject(res) && res;
	//  };
	//  // 单个对象处理
	//  var singleObject = function(obj, data){
	//      var res = [];
	//      $.each([].concat(o(obj)), function(ind, _obj){
	//          var src = ($.type(_obj) == "string" && _obj)
	//                      || $(_obj).attr("data-kimage") 
	//                      || _obj.src 
	//                      || (_obj.style["backgroundImage"]||"").replace(/(url\(['"]?|['"]?\))/g, "") 
	//                      || null,
	//              _o = null,
	//              tempObj = null;
	//          if(!src){ return;}
	//          if($.type(_obj) == "string"){
	//              tempObj = new Image();
	//              tempObj.src = src;
	//          }
	//          _o = {
	//              object:  tempObj || _obj,
	//              type: $(_obj).attr("data-kimage") ? "kimg" : (
	//                          _obj.tagName.toLowerCase() === "img" ? "img" : (
	//                              (_obj.style["backgroundImage"]||"").replace(/(url\(['"]?|['"]?\))/g, "") ? "bg" : null
	//                          )
	//                      ),
	//              src: src
	//          };
	//          if(!$(_o.object).attr(involidName)){
	//              data.before.call(_o.object, _o);
	//              res.push(_o)
	//          }
	//      });
	//      return !$.isEmptyObject(res) && res;
	//  };
	//  $.extend({
	//      kfetch: function(options){
	//          var opts = $.extend({
	//              object: [],
	//              before: $.noop,
	//              success: $.noop,
	//              error: $.noop,
	//              complete: $.noop
	//          }, options),
	//          list = objects({
	//              list: opts.object, 
	//              before: opts.before
	//          });
	//
	//          if( list.length <1 ){return}
	//
	//          var imgNum = list.length,
	//              over = false,
	//              finishList = [],
	//              failList = [],
	//              intV = setInterval(function(){
	//                  if(finishList.length + failList.length == imgNum){
	//                      clearInterval(intV);
	//                      opts.complete({
	//                          status: failList.length === 0,
	//                          failList: failList
	//                      })
	//                  }
	//              },40);
	//
	//          $.each(list, function(ind, obj){
	//              var imgObj = $(obj.object),
	//                  img = document.createElement("img");
	//                  img.src = obj.src;
	//              img.onload = function(){
	//                  finishList.push(obj);
	//                  opts.success.call(obj.object, obj);
	//                  imgObj.attr(involidName, 1)
	//              };
	//              img.onerror = function(){
	//                  failList.push(obj);
	//                  opts.error.call(obj.object, obj);
	//                  imgObj.attr(involidName, 1)
	//              };
	//          });
	//      }
	//  });
	//  $.extend($.fn, {
	//      kfetch: function(opts){
	//          $.kfetch.call(this, $.extend(opts, {object: this}))
	//      }
	//  });
	/* 监听(图片)加载状态  END */

})(mui, window);