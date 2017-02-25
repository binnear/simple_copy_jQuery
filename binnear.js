(function(window) {

	var
		arr = [],
		push = arr.push,
		slice = arr.slice,
		sort = arr.sort,
		splice = arr.splice;

	// 工厂函数, 隐藏new创建对象
	var Binnear = function( selector ) {
		return new Binnear.prototype.init(selector);
	};

	Binnear.fn = Binnear.prototype = {
		// 版本号
		Binnear: '0.0.1',
		length: 0,
		constructor: Binnear,

		// 真正的构造函数
		init: function( selector ) {
			// 处理：null/undefined/0/false/''
			if( !selector ) {
				return this;
			}

			// 参数为 string 类型
			// else if(typeof selector === 'string') {
			else if( Binnear.isString(selector) ) {
				if(selector.charAt(0) === '<') {
					// html 字符串
					push.apply( this, parseHTML(selector) );
				} else {
					// 选择器的情况
					push.apply(this, document.querySelectorAll(selector));
					this.selector = selector;
				}
			}

			// 参数为函数：入口函数
			// else if(typeof selector === 'function') {
			else if( Binnear.isFunction(selector) ) {
				document.addEventListener('DOMContentLoaded', selector);
			}

			// 参数为：DOM对象
			else if( Binnear.isDOM(selector) ) {
				this[0] = selector;
				this.length = 1;
				return this;
			}

			// 参数为数组 或 伪数组 或 Binnear对象（伪数组）都转化为：伪数组
			else if ( Binnear.isArrayLike(selector) ) {
				push.apply(this, selector);
				if(selector.selector) {
					this.selector = selector.selector;
				}
			}
		},

		// 将 this 伪数组转化为：真数组
		toArray: function() {
			return slice.call(this);
		},

		// 将 Binnear 对象，转化为：DOM对象
		get: function( index ) {
			if(index == null) {
				return this.toArray();
			}
			index = index >= 0 ? index : (this.length + index);
			return this[index];
		},

		eq: function( index ) {
			return this.pushStack( this.get(index) );
		},

		first: function() {
			return this.eq(0);
		},

		last: function() {
			return this.eq(-1);
		},

		end: function() {
			// this.constructor() 为了避免获取不到 prevObject 而报错!
			return this.prevObject || this.constructor();
		},

		pushStack: function( arr ) {
			var newIObj = Binnear( arr );
			newIObj.prevObject = this;
			return newIObj;
		},

		push: push,
		sort: sort,
		splice: splice
	};

	Binnear.prototype.init.prototype = Binnear.prototype;

	// 扩展方法
	Binnear.fn.extend = Binnear.extend = function(obj) {
		for(var k in obj) {
			if( obj.hasOwnProperty(k) ) {
				this[k] = obj[k];
			}
		}
	};

	// 将 html 字符串 转化为 DOM对象（集合）
	var parseHTML = function( htmlSring ) {
		var container = document.createElement('div');
		container.innerHTML = htmlSring;

		return container.children;
	};

	// 静态方法 each / map / trim
	Binnear.extend({
		each: function(obj, callback) {
      var i, length;

      if( Binnear.isArrayLike(obj) ) {

        for(i = 0, length = obj.length; i < length; i++) {
          if( callback.call(obj[i], i, obj[i]) === false ) {
            break;
          }
        }
      } else {

        for(i in obj) {
          if( callback.call(obj[i], i, obj[i]) === false ) {
            break;
          }
        }
      }

      return obj;
    },

    map: function(obj, callback) {
			var i, temp, ret = [];
			if( Binnear.isArrayLike(obj) ) {

				for(i = 0; i < obj.length; i++) {
					temp = callback(obj[i], i)
					if(temp != null) {
						ret.push( temp );
					}
				}
			} else {

				for(i in obj) {
					temp = callback(obj[i], i)
					if(temp != null) {
						ret.push( temp );
					}
				}
			}

			return ret;
		},

		// 去除字符串两端的空格
		trim: function( str ) {
			if( String.prototype.trim ) {
				return str.trim();
			}

			return str.replace(/^\s+|\s+$/g, '');
		}
	});

	// 实例方法 each
	Binnear.prototype.extend({
		each: function( callback ) {

			return Binnear.each(this, callback);
		},

		map: function( callback ) {
			// Binnear.map(this, callback);
			var ret = Binnear.map(this, function(value, index) {
				return callback.call(value, index, value);
			});
			return this.pushStack( ret );
		}
	});

	// 类型判断模块
	Binnear.extend({
		isString: function( obj ) {
			return typeof obj === 'string';
		},
		isFunction: function( obj ) {
			return typeof obj === 'function';
		},
		isDOM: function( obj ) {
			return obj && !!obj.nodeType;
		},
		isWindow: function( obj ) {
			return !!obj && obj.window === obj;
		},
		isArrayLike: function( obj ) {
			if( Binnear.isFunction(obj) || Binnear.isWindow(obj) ) {
				return false;
			}

			if('length' in obj && obj.length >= 0) {
				return true;
			}

			return false;
		}
	});

	// 获取指定元素的下一个元素节点
	var getNextElm = function( node ) {
		while( node = node.nextSibling ) {
			if(node.nodeType === 1) {
				return node;
			}
		}
		return null;
	};

	// 获取指定元素的上一个元素节点
	var getPrevElm = function( node ) {
		while( node = node.previousSibling ) {
			if(node.nodeType === 1) {
				return node;
			}
		}
		return null;
	};

	// 获取指定元素后面所有的元素节点
	var getNextAllElms = function( node ) {
		var ret = [];
		while( node = node.nextSibling ) {
			if(node.nodeType === 1) {
				// return node;
				ret.push( node );
			}
		}
		return ret;
	};

	var getPervAllElms = function( node ) {
		var ret = [];
		while( node = node.previousSibling ) {
			if(node.nodeType === 1) {
				ret.push( node );
			}
		}
		return ret;
	};

	// DOM操作模块
	Binnear.fn.extend({
		appendTo: function( node ) {
			var srcElms = this,
				tarElms = Binnear( node ),
				tarLength = tarElms.length,
				tempNode = null,
				ret = [];

			tarElms.each(function(index) {
				var that = this;
				srcElms.each(function() {
					tempNode = (index === tarLength-1) ? this: this.cloneNode(true);
					that.appendChild( tempNode );
					ret.push( tempNode );
				});
			});
			return this.pushStack(ret);
		},

		append: function( node ) {
			Binnear(node).appendTo( this );
			return this;
		},

		prependTo: function( node ) {
			var srcElms = this,
				tarElms = Binnear( node ),
				tarLength = tarElms.length,
				tempNode = null,
				ret = [];

			tarElms.each(function(index, value) {
				var first = value.firstChild;
				srcElms.each(function() {
					tempNode = (index === tarLength-1) ? this : this.cloneNode(true);
					value.insertBefore(tempNode, first);
					ret.push( tempNode );
				})
			});
			return this.pushStack( ret );
		},

		prepend: function( node ) {
			Binnear(node).prependTo( this );
			return this;
		},

		// 获取下一个兄弟元素
		next: function() {
			// this 就是 Binnear对象
			return this.map(function() {
				return getNextElm( this );
			});
		},

		// 获取上一个兄弟元素
		prev: function() {
			return this.map(function() {

				return getPrevElm( this );
			})
		},

		// 获取后面所有的兄弟元素
		nextAll: function() {
			var ret = [];
			this.each(function() {
				var temp = getNextAllElms(this);
				Binnear.each(temp, function() {
					(ret.indexOf(this) < 0) && ret.push( this );
				});
			});

			return this.pushStack( ret );
		},

		// 获取前面所有的兄弟元素
		prevAll: function() {
			var ret = [];
			this.each(function() {
				var temp = getPervAllElms(this);
				Binnear.each(temp, function() {
					(ret.indexOf(this) < 0) && ret.push( this );
				});
			});
			return this.pushStack( ret );
		}
	});

	// 事件操作模块
	Binnear.fn.extend({
		on: function(evnetType, callback) {
			return this.each(function() {
				this.addEventListener(evnetType, callback, false);
			});
		},

		off: function(eventType, callback) {
			return this.each(function() {
				this.removeEventListener(eventType, callback);
			});
		}
	});

	// 统一实现所有其他绑定事件的方法：
	Binnear.each(( 'blur focus focusin focusout load resize scroll unload click dblclick ' +
	'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
	'change select submit keydown keypress keyup error contextmenu' ).split( ' ' ), function(i, v) {
		// 此处的 this 是字符串类型的包装对象，所以，需要使用参数 v
		Binnear.fn[v] = function( callback ) {
			return this.on(v, callback);
		};
	});

	// 类操作模块
	Binnear.fn.extend({
		css: function( name, value ) {
			if( arguments.length === 2 ) {
				return this.each(function() {
					this.style[name] = value;
				});
			}

			if( Binnear.isString(name) ) {
				if(window.getComputedStyle) {
					return  window.getComputedStyle(this.get(0))[name];
				} else {
					return this.get(0).currentStyle[name];
				}
			} else {
				return this.each(function() {
					var that = this;

					Binnear.each(name, function(key, v) {
						that.style[key] = v;
					});
				});
			}
		},

		hasClass: function( clsName ) {
			var flag = false;

			this.each(function() {
				if( (' ' + this.className + ' ').indexOf( ' ' + clsName + ' ') > -1 ) {
					flag = true;
					return false;
				}
			});

			return flag;
		},

		addClass: function( clsName ) {
			return this.each(function() {
				if( !Binnear(this).hasClass(clsName) ) {
					this.className = Binnear.trim( this.className + ' ' + clsName );
				}
			});
		},

		removeClass: function( clsName ) {
			return this.each(function() {
				var classStr = ' ' + this.className + ' ';
				while( classStr.indexOf(' ' + clsName + ' ') > -1 ) {
					classStr = classStr.replace(' ' + clsName + ' ', ' ');
				}

				this.className = Binnear.trim( classStr );
			});
		},

		toggleClass: function( clsName ) {

			return this.each(function() {
				var temp = Binnear(this);

				// 分别判断每一个元素有没有指定的类
				if( temp.hasClass(clsName) ) {
					temp.removeClass( clsName );
				} else {
					temp.addClass( clsName );
				}
			});
		}
	});

	// 属性操作模块
	Binnear.fn.extend({
		attr: function(name, value) {
			if( arguments.length === 2 ) {
				return this.each(function() {
					this.setAttribute(name, value);
				});
			}

			if( Binnear.isString(name) ) {
				return this.get(0).getAttribute(name);
			} else {
				return this.each(function() {
					var that = this;
					Binnear.each(name, function(k, v) {
						that.setAttribute(k, v);
					});
				});
			}
		},

		prop: function(name, value) {
			if( arguments.length === 2 ) {
				return this.each(function() {
					this[name] = value;
				});
			}
			if( Binnear.isString(name) ) {
				return this.get(0)[name];
			} else {
				return this.each(function() {
					var that = this;
					Binnear.each(name, function(k, v) {
						that[k] = v;
					});
				});
			}
		},

		text: function( txt ) {
			var ret = [];
			if( txt == null ) {
				this.each(function() {
					if(this.innerText) {
						ret.push( this.innerText );
					} else {
						ret.push( this.textContent );
					}
				});
				return ret.join('');
			}
			return this.each(function() {
				if( this.innerText ) {
					this.innerText = txt;
				} else {
					this.textContent = txt;
				}
			});
		},

		val: function( value ) {
			if( typeof value === 'undefined' ) {
				return this.get(0).value;
			}

			return this.each(function() {
				this.value = value;
			});
		},

		html: function( htmlString ) {
			if( typeof htmlString === 'undefined' ) {
				return this.get(0).innerHTML;
			}

			return this.each(function() {
				this.innerHTML = htmlString;
			});
		}
	});

	// 暴露 Binnear
	window.I = window.Binnear = Binnear;
})(window);
