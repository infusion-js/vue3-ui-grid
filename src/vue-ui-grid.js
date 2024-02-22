
(function (root, factory) {
	if (typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if (typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() { 'use strict';
	
	/* Java script Event Bus API */
	const $$eBus = {
		$on: function (name, callback, ctx) {
			var ebs = this.ebs || (this.ebs = {});
			(ebs[name] || (ebs[name] = [])).push({
				fn: callback,
				ctx: ctx
			});
			return this;
		},
		$emit: function (name) {
			var data = [].slice.call(arguments, 1);
			var evArr = ((this.ebs || (this.ebs = {}))[name] || []).slice();
			var i = 0, len = evArr.length;
			for (i; i < len; i++) {
				evArr[i].fn.apply(evArr[i].ctx, data);
			}
			return this;
		},
		$off: function (name, callback) {
			var ebs = this.ebs || (this.ebs = {});
			var evs = ebs[name], liveEvents = [];
			if (evs && callback) {
				for (var i = 0, len = evs.length; i < len; i++) {
					if (evs[i].fn !== callback)
						liveEvents.push(evs[i]);
				}
			}
			(liveEvents.length)? ebs[name] = liveEvents: delete ebs[name];
			return this;
		}
	};
    
    
	/* Java script Utility Functions */
	const $$util = {
		noop: function () {},
		error: function(message) { throw new Error(message); },
		slice: [].slice, 
        logError: function(message, data) {
        	if (data) console.error(message, data);
        	else console.error(message);
        },
        logWarn: function(logMessage, data) {
        	if (data) console.warn(message, data);
        	else console.warn(message);
        },
        logDebug: function(message, data) {
        	if (data) console.log(message, data);
        	else console.log(message);
        },
		isDefined: function (value) {
			return typeof value !== 'undefined';
		},
		isUndefined: function (value) {
			return typeof value === 'undefined';
        },
        isNullOrUndefined: function(obj) {
            return obj === undefined || obj === null;
		},
		isNumber: function (value) {
			return typeof value === 'number';
		},
		isString: function (value) {
			return typeof value === 'string';
		},
		isDate: function (value) {
		  return toString.call(value) === '[object Date]';
		},
		isArray: function (arr) {
		  return Array.isArray(arr) || arr instanceof Array;
		},
		isBoolean: function (value) {
		  return typeof value === 'boolean';
		},
		isBlob: function (obj) {
		  return toString.call(obj) === '[object Blob]';
		},
		isFunction: function (value) {
			return typeof value === 'function';
		},
		isBlankObject: function (value) {
		  return value !== null && typeof value === 'object' && !getPrototypeOf(value);
		},
		isObject: function (value) {
			return value !== null && typeof value === 'object';
		},
		isRegExp: function (value) {
		  return toString.call(value) === '[object RegExp]';
		},
		isElement: function (node) {
		  return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
        },
        isVisible: function(node) {
            return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
		},
		isWindow: function (obj) {
			return obj && obj.window === obj;
		},
        isIE: function () {
            var match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
            return (match !== -1) ? true: false;
        },
		uid: ["0", "0", "0", "0"],
		constants: {
	        UID_PREFIX: "uiGrid-",
	        COL_CLASS_PREFIX: 'ui-grid-col',
		    aggregation: {
		    	SUM: 'sum', COUNT: 'count', AVG: 'avg', MAX: 'max', MIN: 'min'
		    },
		    dataChange: {
		      ALL: 'all', EDIT: 'edit', ROW: 'row', COLUMN: 'column', OPTIONS: 'options'
		    },
		    filter: {
		      STARTS_WITH: '^', ENDS_WITH: '$', EQUALS: '=', CONTAINS: '*', 
		      GREATER_THAN: '>', GREATER_THAN_OR_EQUAL: '>=', LESS_THAN: '<', LESS_THAN_OR_EQUAL: '<=', NOT_EQUAL: '!=', 
		      INPUT: 'input', SELECT: 'select', CHECKBOX: 'checkbox', RADIO: 'radio'
		    },
		    scrollbars: {
		      NEVER: 0, ALWAYS: 1, WHEN_NEEDED: 2
		    },
		    scrollDirection: {
		      UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right', NONE: 'none'
		    },
			GRID: 'GRID',
			CANVAS: 'CANVAS',
			ROW: 'ROW',
			COLUMN: 'COLUMN',
		    ASC: 'asc',
		    DESC: 'desc',
		    LEFT: 'left',
		    RIGHT: 'right',
		    NONE: ''
		},
		parse: function (obj, prop) {
            if (typeof obj !== 'object') throw 'parse: obj is not an object'
            if (typeof prop !== 'string') throw 'parse: prop is not a string'

            /* Replaces [] notation with dot notation */
            prop = prop.replace(/\[["'`]([^\]]+)["'`]\]/g,".$1")

            return prop.split('.').reduce(function(prev, curr) {
                return prev ? prev[curr] : undefined
            }, obj || self)
        },
        preEval: function(path) {
            var m = /^(.*)((?:\s*\[\s*\d+\s*\]\s*)|(?:\s*\[\s*"(?:[^"\\]|\\.)*"\s*\]\s*)|(?:\s*\[\s*'(?:[^'\\]|\\.)*'\s*\]\s*))(.*)$/.exec(path);
            if (m) {
                return (m[1] ? $$util.preEval(m[1]) : m[1]) + m[2] + (m[3] ? $$util.preEval(m[3]) : m[3]);
            } else {
                path = path.replace(/'/g, "\\'");
                var parts = path.split(/\./g);
                var preparsed = [parts.shift()];
                parts.forEach(function(part) {
                    preparsed.push(part.replace(/(\([^)]*\))?$/, "']$1"));
                });
                return preparsed.join("['");
            }
        },
        setNestedObjectData: function (obj, path, value) {
        	if (path.length === 1) {
        		obj[path] = value;
        		return;
        	}
        	return $$util.setNestedObjectData(obj[path[0]], path.slice(1), value);
        },
        debounce: function (func, wait, immediate) {
    	  var timeout;
    	  return function() {
    	    var context = this, args = arguments, callNow = immediate && !timeout;
    		
    	    if (timeout) clearTimeout(timeout);
    	    timeout = setTimeout(function() {
    	      timeout = null;
    	      if (!immediate) func.apply(context, args);
    	    }, wait, false);
    		
    	    if (callNow) func.apply(context, args);
    	  };
    	},
		simpleCompare: function (a, b) { 
			return a === b || (a !== a && b !== b); 
		},
        endsWith: function(str, suffix) {
            if (!str || !suffix || typeof str !== "string") {
                return false;
            }
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },
        arrayContainsObjectWithProperty: function(array, propertyName, propertyValue) {
            var found = false;
            array.forEach(function(object) {
                if (object[propertyName] === propertyValue) {
                    found = true;
                }
            });
            return found;
        },
  		fromJson: function (json) {
  			return isString(json)? JSON.parse(json): json;
  		},
  		toJson: function (obj, pretty) {
  			if (isUndefined(obj)) return undefined;
  			if (!isNumber(pretty)) { pretty = pretty ? 2 : null; }
  			return JSON.stringify(obj, toJsonReplacer, pretty);
  		},
        trim: function (value) {
  		  return isString(value) ? value.trim() : value;
  		},
        swap: function(elm, options, callback, args) {
            var ret, name, old = {};
            for (name in options) {
                old[name] = elm.style[name];
                elm.style[name] = options[name];
            }
            ret = callback.apply(elm, args || []);
            for (name in options) {
                elm.style[name] = old[name];
            }
            return ret;
        },
        nextUid: function nextUid() {
            var index = $$util.uid.length;
            var digit;
            while (index) {
                index--;
                digit = $$util.uid[index].charCodeAt(0);
                if (digit === 57) {
                    $$util.uid[index] = "A";
                    return $$util.constants.UID_PREFIX + $$util.uid.join("");
                }
                if (digit === 90) {
                	$$util.uid[index] = "0";
                } else {
                	$$util.uid[index] = String.fromCharCode(digit + 1);
                    return $$util.constants.UID_PREFIX + $$util.uid.join("");
                }
            }
            $$util.uid.unshift("0");
            return $$util.constants.UID_PREFIX + $$util.uid.join("");
        },
        hashKey: function (obj) {
            var objType = typeof obj,
                key;
            if (objType === "object" && obj !== null) {
                if (typeof(key = obj.$$hashKey) === "function") {
                    key = obj.$$hashKey();
                } else {
                    if (typeof obj.$$hashKey !== "undefined" && obj.$$hashKey) {
                        key = obj.$$hashKey;
                    } else {
                        if (key === undefined) {
                            key = obj.$$hashKey = $$util.nextUid();
                        }
                    }
                }
            } else {
                key = obj;
            }
            return objType + ": " + key;
        },
		setHashKey: function (obj, h) {
			if (h) {
				obj.$$hashKey = h;
			} else {
				delete obj.$$hashKey;
			}
		},
		baseExtend: function (dst, objs, deep) {
		  var h = dst.$$hashKey;
		  for (var i = 0, ii = objs.length; i < ii; ++i) {
		    var obj = objs[i];
		    if (!$$util.isObject(obj) && !$$util.isFunction(obj)) continue;
		    var keys = Object.keys(obj);
		    for (var j = 0, jj = keys.length; j < jj; j++) {
		      var key = keys[j];
		      var src = obj[key];
		      if (deep && $$util.isObject(src)) {
		        if (isDate(src)) {
		          dst[key] = new Date(src.valueOf());
		        } else if ($$util.isRegExp(src)) {
		          dst[key] = new RegExp(src);
		        } else if (src.nodeName) {
		          dst[key] = src.cloneNode(true);
		        } else if ($$util.isElement(src)) {
		          dst[key] = src.clone();
		        } else {
		          if (key !== '__proto__') {
		            if (!$$util.isObject(dst[key])) dst[key] = $$util.isArray(src) ? [] : {};
		            baseExtend(dst[key], [src], true);
		          }
		        }
		      } else {
		        dst[key] = src;
		      }
		    }
		  }
		  $$util.setHashKey(dst, h);
		  return dst;
		},
        extend: function (dst) {
  		  return $$util.baseExtend(dst, $$util.slice.call(arguments, 1), false);
  		},
		getId: function() {
            var id = (new Date).getTime();
            return function() {
                return id += 1;
            };
        }(),
        getSize: function (array) {
            return array ? array.length : 0;
        },
        evaluateType: function(item) {
            switch (typeof item) {
                case "number":
                case "boolean":
                case "string":
                    return typeof item;
                default:
                    if ($$util.isDate(item)) {
                        return "date";
                    }
                    return "object";
            }
        },
        getCamelCaseField: function(field) {
            if (typeof field === "undefined" || field === undefined || field === null) {
                return field;
            }
            field = (typeof field !== "string") ? String(field) : field;
            return field.replace(/_+/g, " ").replace(/^[A-Z]+$/, function(match) {
                return match.toLowerCase();
            }).replace(/([\w\u00C0-\u017F]+)/g, function(match) {
                return match.charAt(0).toUpperCase() + match.slice(1);
            }).replace(/(\w+?(?=[A-Z]))/g, "$1 ");
        },
	    createMethodWrapper: function (object, method) {
	        return function() {
	            return method.apply(object, arguments);
	        };
	    },
        getRawComponent: function (component) {
        	var rawComponent = undefined, tokens = ['name', 'props', 'data', 'setup', 'computed', 'beforeCreate', 'created', 'beforeMount', 'mounted', 
        		'methods', 'beforeUpdate', 'updated', 'beforeUnmount', 'unmounted', 'components', 'directives', 'mixins'];
        	if (!this.isNullOrUndefined(component['template'])) {
        		rawComponent = Vue.markRaw({
        			template: component['template']
        		});
            	tokens.forEach(function(token) {
            		if (component[token]) {
            			rawComponent[token] = component[token];
            		}
            	});
        	}
        	return rawComponent;
        },
        
    	/* Java script Element Functions */
        $$element: {
            createDomElement: function (htmlStr) {
            	var i=0, elm = document.createElement("div"), frag = document.createDocumentFragment();
    	    	elm.innerHTML = htmlStr;
    	    	return frag.appendChild(elm.removeChild(elm.firstChild));
            },
            setStyles: function (elm, stObj) {
            	for (var st in stObj) {
            		elm.style[st] = stObj[st];
            	}
            },
            getStyles: function (elm) {
            	elm = (elm && typeof elm.length !== "undefined" && elm.length) ? elm[0] : elm;
                return elm.ownerDocument.defaultView.getComputedStyle(elm, null);
            },
            getBorderSize: function(elm, borderType) {
            	elm = (elm && typeof elm.length !== "undefined" && elm.length) ? elm[0] : elm;
                var styles = this.getStyles(elm);
                borderType = ((borderType) ? "border" + borderType.charAt(0).toUpperCase() + borderType.slice(1) : "border") + "Width";
                var val = parseInt(styles[borderType], 10);
                return (isNaN(val)) ? 0 : val;
            },
            getLineHeight: function (elm) {
                var parent = elm.parentElement;
                parent = (!parent) ? document.getElementsByTagName("body")[0] : parent;
                return parseInt($$util.$$element.getStyles(parent).fontSize) || parseInt($$util.$$element.getStyles(elm).fontSize) || 16;
            },
            evaluateWidthOrHeight: function (elm, name, extra, isBorderBox, styles) {
                var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0, val = 0;
                var sides = ["Top", "Right", "Bottom", "Left"];
                for (; i < 4; i += 2) {
                    var side = sides[i];
                    var margin = extra === "margin" ? parseFloat(styles[extra + side]) : "";
                    val += !isNaN(margin) ? margin : 0;
                    
                    var padding = (isBorderBox && extra === "content") ? parseFloat(styles["padding" + side]) : "";
                    var border = (isBorderBox && extra === "margin") ? parseFloat(styles["border" + side + "Width"]) : "";
                    val -= !isNaN(padding) ? padding : !isNaN(border) ? border : "";
                    
                    padding = !isBorderBox ? parseFloat(styles["padding" + side]) : "";
                    border = (!isBorderBox && extra !== "padding") ? parseFloat(styles["border" + side + "Width"]) : "";
                    val += !isNaN(padding) ? padding : !isNaN(border) ? border : 0;
                }
                return val;
            },
            getWidthOrHeight: function (elm, name, extra) {
                var valueIsBorderBox = true, val, styles = $$util.$$element.getStyles(elm), isBorderBox = styles["boxSizing"] === "border-box";
                if (val <= 0 || val == null) {
                    val = styles[name];
                    if (val < 0 || val == null) {
                        val = elm.style[name];
                    }
                    if (new RegExp("^(" + /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source + ")(?!px)[a-z%]+$", "i").test(val)) {
                        return val;
                    }
                    valueIsBorderBox = isBorderBox && (true || val === elm.style[name]);
                    val = parseFloat(val) || 0;
                }
                var ret = val + this.evaluateWidthOrHeight(elm, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles);
                return ret;
            },
            elementWidthOrHeight: function(elm, name, extra) {
                var self=this;
            	elm = (elm && typeof elm.length !== "undefined" && elm.length) ? elm[0] : elm;
                if (elm && elm !== null) {
                    var styles = $$util.$$element.getStyles(elm);
                    return elm.offsetWidth === 0 && /^(block|none|table(?!-c[ea]).+)/.test(styles.display) ? 
                    	$$util.swap(elm, { position: "absolute", visibility: "hidden", display: "block" }, function() {
                    		return self.getWidthOrHeight(elm, name, extra);
                    	}) : self.getWidthOrHeight(elm, name, extra);
                }
                return null;
            },
            elementWidth: function(elm, extra) {
            	return this.elementWidthOrHeight(elm, "width", extra);
            },
            elementHeight: function(elm, extra) {
            	return this.elementWidthOrHeight(elm, "height", extra);
            },
            outerElementWidth: function(elm, margin) {
                return elm ? this.elementWidthOrHeight.call(this, elm, "width", margin ? "margin" : "border") : null;
            },
            outerElementHeight: function(elm, margin) {
                return elm ? this.elementWidthOrHeight.call(this, elm, "height", margin ? "margin" : "border") : null;
            },
            closestElement: function(elm, selector) {
            	elm = (elm && typeof elm.length !== "undefined" && elm.length) ? elm[0] : elm;
                var matchesFn = ["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"].find(function(fn) {
                	return typeof document.body[fn] === "function";
                });
                while (elm !== null) {
                	elm = elm.parentElement;
                    if (elm !== null && elm[matchesFn](selector)) {
                        return elm;
                    }
                }
                return null;
            },
            rtlScrollType: function () {
                if (this.rtlScrollType.type) {
                    return this.rtlScrollType.type;
                }
                var scrollElm = this.createDomElement(
            		`<div dir="rtl" style="width: 1px; height: 1px; position: fixed; top: 0px; left: 0px; overflow: hidden"> 
                		<div style="width: 2px"><span style="display: inline-block; width: 1px"></span>
            		<span style="display: inline-block; width: 1px"></span></div></div>`
                ), type = "reverse";
                document.body.appendChild(scrollElm);
                if (scrollElm.scrollLeft > 0) {
                    type = "default";
                } else {
                    if (typeof Element !== "undefined" && Element.prototype.scrollIntoView) {
                        scrollElm.children[0].children[1].scrollIntoView();
                        if (scrollElm.scrollLeft < 0) {
                            type = "negative";
                        }
                    } else {
                        scrollElm.scrollLeft = 1;
                        if (scrollElm.scrollLeft === 0) {
                            type = "negative";
                        }
                    }
                }
                scrollElm.parentElement.removeChild(scrollElm);
                this.rtlScrollType.type = type;
                return type;
            },
            getScrollbarWidth: function() {
                var outer = document.createElement("div");
                $$util.$$element.setStyles(outer, {visibility: 'hidden', width: '100px', msOverflowStyle: 'scrollbar'});
                document.body.appendChild(outer);
                var widthNoScroll = outer.offsetWidth;
                $$util.$$element.setStyles(outer, {overflow: 'scroll', position: 'absolute'});
                var inner = document.createElement("div");
                $$util.$$element.setStyles(inner, {width: '100%'});
                outer.appendChild(inner);
                var widthWithScroll = inner.offsetWidth;
                outer.parentNode.removeChild(outer);
                return widthNoScroll - widthWithScroll;
            },
        }
	};
	
	
	/* Java script Localization Labels */
	const $$i18n = {
		"en": {
            column: {
                hide: "Hide Column"
            },
            headerCell: { priority: "Priority:" },
            sort: {
                ascending: "Sort Ascending", descending: "Sort Descending", remove: "Remove Sort"
            },
            pagination: {
                sizes: "Items per Page", totalItems: "items", of: "of", records: "Records"
            },
            pinning: {
                pinLeft: "Pin Left", pinRight: "Pin Right", unpin: "Unpin"
            },
            aggregation: {
                count: "Total Rows: ", sum: "Total: ", avg: "Avg: ", min: "Min: ", max: "Max: "
            },
            grouping: {
                group: "Group", ungroup: "Ungroup", count: "Agg: Count", sum: "Agg: Sum", min: "Agg: Min", 
                max: "Agg: Max", avg: "Agg: Avg", remove: "Agg: Remove"
            },
            selection: {
                selectAll: "Select All"
            }
		}
	};
	
	
	/* Data Grid Java script Grid API */
	const GridApi = function (grid) {
        this.grid = grid;
        this.listeners = [];
	};
	GridApi.prototype.setupGlobalEvent = function (grid, eventId, handler) {
        return $$eBus.$on(eventId, function(obj) {
            var args = Array.prototype.slice.call(arguments[0]);
            handler.apply(grid.api, args);
        });
    };
    GridApi.prototype.setupEvent = function(name, eventName) {
        this[name] = (!this[name]) ? {} : this[name];
        var self = this, feature = this[name];
        if (!feature.on) {
            feature.on = {};
            feature.raise = {};
        }
        var eventId = self.grid.id + name + eventName;
        feature.raise[eventName] = function() {
            $$eBus.$emit(eventId, Array.prototype.slice.call(arguments));
        };
        feature.on[eventName] = function(handler) {
            var deregEventOn = self.setupGlobalEvent(self.grid, eventId, handler);
            var listener = { eventId: eventId, dereg: deregEventOn, handler: handler };
            self.listeners.push(listener);
            var removeListener = function() {
                $$eBus.$off(eventId);
                var index = self.listeners.indexOf(listener);
                self.listeners.splice(index, 1);
            };
            return removeListener;
        };
    };
    
    
	/* Data Grid Java script Grid Container API */
	const GridContainer = function (grid, name, options) {
	    var self = this;
	    self.grid = grid;
	    self.name = name;
	    const initProps = {"renderedRows": [], "visibleRowCache": [], "renderedColumns": [], "visibleColumnCache": [], 
	    	"viewportAdjusters": [], "prevScrollTop": 0, "prevScrolltopPercentage": 0, "prevRowScrollIndex": 0, "prevScrollLeft": 0, 
	    	"prevScrollleftPercentage": 0, "prevColumnScrollIndex": 0, "$$canvasHeight": 0, "hasHScrollbar": false, "hasVScrollbar": false, 
	    	"canvasHeightShouldUpdate": true, "columnStyles": "" };
        Object.keys(initProps).forEach(function(key) {
        	self[key] = initProps[key];
        });
	    if (options && $$util.isObject(options)) {
	    	Object.assign({}, self, options);
	    }
	    self.grid.setupStyleComputations({
	        priority: 10, fn: function() {
	            self.updateColumnWidths();
	            return self.columnStyles;
	        }
	    });
	};
	GridContainer.prototype.updateColumnWidths = function() {
        var self = this, columnCache = [], asterisksArray = [], asteriskNum = 0, usedWidthSum = 0, ret = "", 
        	pinRightColumn = false, fixedNumberArray = [], percentageArray = [], totalPercentage = 0;
        var availableWidth = self.grid.getViewportWidth() - self.grid.scrollbarWidth;
        Object.keys(self.grid.renderContainers).forEach(function(key){
        	var container = self.grid.renderContainers[key];
        	columnCache = columnCache.concat(container.visibleColumnCache);
        });
        columnCache.forEach(function(column) {
            var width = 0;
            if (!column.visible) {
                return;
            }
            if (pinRightColumn) {
                availableWidth += self.grid.scrollbarWidth;
            }
            if (!pinRightColumn && column.colDef.pinnedRight) {
                pinRightColumn = true;
            }
            if ($$util.isNumber(column.width)) {
                width = parseInt(column.width, 10);
                usedWidthSum = usedWidthSum + width;
                column.drawnWidth = width;
                fixedNumberArray.push(column);
            } else {
                if ($$util.endsWith(column.width, "%")) {
                    var percentageIntegerValue = parseInt(column.width.replace(/%/g, ""), 10);
                    width = parseInt(percentageIntegerValue / 100 * availableWidth);
                    width = (width > column.maxWidth) ? column.maxWidth : (width < column.minWidth) ? column.minWidth : width;
                    usedWidthSum = usedWidthSum + width;
                    column.drawnWidth = width;
                    totalPercentage = totalPercentage + percentageIntegerValue;
                    percentageArray.push(column);
                } else {
                    if ($$util.isString(column.width) && column.width.indexOf("*") !== -1) {
                        asteriskNum = asteriskNum + column.width.length;
                        asterisksArray.push(column);
                    }
                }
            }
        });
        var remainingWidth = availableWidth - usedWidthSum;
        if (asterisksArray.length > 0) {
            var asteriskVal = remainingWidth / asteriskNum;
            asterisksArray.forEach(function(column) {
                var width = parseInt(column.width.length * asteriskVal, 10);
                width = (width > column.maxWidth) ? column.maxWidth : (width < column.minWidth) ? column.minWidth : width;
                usedWidthSum = usedWidthSum + width;
                column.drawnWidth = width;
            });
        }
        var variableWidthColumnArray;
        if (asterisksArray.length > 0) {
            variableWidthColumnArray = asterisksArray;
        } else if (percentageArray.length > 0 && fixedNumberArray.length === 0 && totalPercentage === 100) {
            variableWidthColumnArray = percentageArray;
        }
        if (!$$util.isUndefined(variableWidthColumnArray)) {
            var processColumnUpwards = function(column) {
                if (column.drawnWidth < column.maxWidth && leftoverWidth > 0) {
                    column.drawnWidth++;
                    usedWidthSum++;
                    leftoverWidth--;
                    columnsToChange = true;
                }
            };
            var leftoverWidth = availableWidth - usedWidthSum;
            var columnsToChange = true;
            while (leftoverWidth > 0 && columnsToChange) {
                columnsToChange = false;
                variableWidthColumnArray.forEach(processColumnUpwards);
            }
            var processColumnDownwards = function(column) {
                if (column.drawnWidth > column.minWidth && excessWidth > 0) {
                    column.drawnWidth--;
                    usedWidthSum--;
                    excessWidth--;
                    columnsToChange = true;
                }
            };
            var excessWidth = usedWidthSum - availableWidth;
            columnsToChange = true;
            while (excessWidth > 0 && columnsToChange) {
                columnsToChange = false;
                variableWidthColumnArray.forEach(processColumnDownwards);
            }
        }
        asterisksArray.forEach(function(column) {
        	column.width = $$util.isNumber(column.drawnWidth) ? column.drawnWidth : column.width;
        });
        var canvasWidth = 0;
        self.visibleColumnCache.forEach(function(column) {
            if (column.visible) {
                canvasWidth = canvasWidth + column.drawnWidth;
            }
        });
        columnCache.forEach(function(column) {
            ret = ret + column.getColClassDefinition();
        });
        self.canvasWidth = canvasWidth;
        this.columnStyles = ret;
    };
    GridContainer.prototype.setupViewportAdjuster = function (func) {
    	this.viewportAdjusters.push(func);    	
    };
    GridContainer.prototype.getViewportAdjustment = function () {
        var self = this;
        var adjustment = { height: 0, width: 0 };
        self.viewportAdjusters.forEach(function(fnc) {
            adjustment = fnc.call(this, adjustment);
        });
        return adjustment;
    };
    GridContainer.prototype.setRenderedRows = function (newRows) {
    	var renderedRows = this.renderedRows = new Array();
        renderedRows.length = newRows.length;
        for (var i = 0; i < newRows.length; i++) {
            renderedRows[i] = newRows[i];
        }
        this.renderedRows = renderedRows;
    };
    GridContainer.prototype.getViewportHeight = function () {
        var self = this;
        var headerHeight = self.headerHeight ? self.headerHeight : self.grid.headerHeight;
        var viewPortHeight = self.grid.gridHeight - headerHeight- self.grid.footerHeight;
        var adjustment = self.getViewportAdjustment();
        viewPortHeight = viewPortHeight + adjustment.height;
        return viewPortHeight;
    };
    GridContainer.prototype.getCanvasHeight = function () {
        var self = this;
        if (!self.canvasHeightShouldUpdate) {
            return self.$$canvasHeight;
        }
        var oldCanvasHeight = self.$$canvasHeight;
        self.$$canvasHeight = 0;
        self.visibleRowCache.forEach(function(row) {
            self.$$canvasHeight += row.$$height;
        });
        self.canvasHeightShouldUpdate = false;
        self.grid.api.core.raise.canvasHeightChanged(oldCanvasHeight, self.$$canvasHeight);
        return self.$$canvasHeight;
    };
    GridContainer.prototype.getVerticalScrollLength = function () {
        return (this.getCanvasHeight() - this.getViewportHeight() + this.grid.scrollbarHeight) !== 0 ? 
        	(this.getCanvasHeight() - this.getViewportHeight() + this.grid.scrollbarHeight) : -1;
    };
    GridContainer.prototype.adjustRows = function (scrollTop, scrollPercentage, postDataLoaded) {
        var self = this, minRows = 0, rowAddedHeight = 0, viewPortHeight = self.getViewportHeight(), newRange = [];
        for (var i = self.visibleRowCache.length - 1; rowAddedHeight < viewPortHeight && i >= 0; i--) {
            rowAddedHeight += self.visibleRowCache[i].$$height;
            minRows++;
        }
        var rowCache = self.visibleRowCache, maxRowIndex = rowCache.length - minRows;
        if ((typeof scrollPercentage === "undefined" || scrollPercentage === null) && scrollTop) {
            scrollPercentage = scrollTop / self.getVerticalScrollLength();
        }
        var rowIndex = Math.ceil(Math.min(maxRowIndex, maxRowIndex * scrollPercentage));
        if (rowIndex > maxRowIndex) {
            rowIndex = maxRowIndex;
        }
        if (rowCache.length > self.grid.options.virtualizationThreshold) {
            if (!(typeof scrollTop === "undefined" || scrollTop === null)) {
                if (!self.grid.suppressParentScrollDown && self.prevScrollTop < scrollTop && rowIndex < self.prevRowScrollIndex + 
                		self.grid.options.scrollThreshold && rowIndex < maxRowIndex) {
                    return;
                }
                if (!self.grid.suppressParentScrollUp && self.prevScrollTop > scrollTop && rowIndex > self.prevRowScrollIndex - 
                		self.grid.options.scrollThreshold && rowIndex < maxRowIndex) {
                    return;
                }
            }
            var rangeStart = Math.max(0, rowIndex - self.grid.options.excessRows);
            var rangeEnd = Math.min(rowCache.length, rowIndex + minRows + self.grid.options.excessRows);
            newRange = [rangeStart, rangeEnd];
        } else {
            newRange = [0, Math.max(self.visibleRowCache.length, minRows + self.grid.options.excessRows)];
        }
        self.currentTopRow = newRange[0];
        self.setRenderedRows( self.visibleRowCache.slice(newRange[0], newRange[1]) );
        self.prevRowScrollIndex = rowIndex;
    };
    GridContainer.prototype.updateColumnOffset = function () {
        var hiddenColumnsWidth = 0;
        for (var i = 0; i < this.currentFirstColumn; i++) {
            hiddenColumnsWidth += this.visibleColumnCache[i].drawnWidth;
        }
        this.columnOffset = hiddenColumnsWidth;
    };
    GridContainer.prototype.setRenderedColumns = function (newColumns) {
    	var renderedColumns = this.renderedColumns = new Array();
        renderedColumns.length = newColumns.length;
        for (var i = 0; i < newColumns.length; i++) {
            renderedColumns[i] = newColumns[i];
        }
        this.renderedColumns = renderedColumns;
        this.updateColumnOffset();
    };
    GridContainer.prototype.getViewportWidth = function () {
        var self = this;
        var viewportWidth = self.grid.gridWidth;
        var adjustment = self.getViewportAdjustment();
        viewportWidth = viewportWidth + adjustment.width;
        return viewportWidth;
    };
    GridContainer.prototype.getCanvasWidth = function () {
        return this.canvasWidth;
    };
    GridContainer.prototype.getHorizontalScrollLength = function () {
        return (this.getCanvasWidth() - this.getViewportWidth() + this.grid.scrollbarWidth) !== 0 ? 
        	(this.getCanvasWidth() - this.getViewportWidth() + this.grid.scrollbarWidth) : -1;
    };
    GridContainer.prototype.adjustColumns = function (scrollLeft, scrollPercentage) {
        var self = this, minCols = 0, totalWidth = 0, viewportWidth = self.getViewportWidth();
        for (var i = 0; i < self.visibleColumnCache.length; i++) {
            var col = self.visibleColumnCache[i];
            if (totalWidth < viewportWidth) {
                totalWidth += col.drawnWidth ? col.drawnWidth : 0;
                minCols++;
            } else {
                var currWidth = 0;
                for (var j = i; j >= i - minCols; j--) {
                    currWidth += self.visibleColumnCache[j].drawnWidth ? self.visibleColumnCache[j].drawnWidth : 0;
                }
                if (currWidth < viewportWidth) {
                    minCols++;
                }
            }
        }
        var columnCache = self.visibleColumnCache, maxColumnIndex = columnCache.length - minCols;
        if ((typeof scrollPercentage === "undefined" || scrollPercentage === null) && scrollLeft) {
            scrollPercentage = scrollLeft / self.getHorizontalScrollLength();
        }
        var colIndex = Math.ceil(Math.min(maxColumnIndex, maxColumnIndex * scrollPercentage));
        if (colIndex > maxColumnIndex) {
            colIndex = maxColumnIndex;
        }
        var newRange = [];
        if (columnCache.length > self.grid.options.columnVirtualizationThreshold && self.getCanvasWidth() > self.getViewportWidth()) {
            var rangeStart = Math.max(0, colIndex - self.grid.options.excessColumns);
            var rangeEnd = Math.min(columnCache.length, colIndex + minCols + self.grid.options.excessColumns);
            newRange = [rangeStart, rangeEnd];
        } else {
            var maxLen = self.visibleColumnCache.length;
            newRange = [0, Math.max(maxLen, minCols + self.grid.options.excessColumns)];
        }
        self.currentFirstColumn = newRange[0];
        self.setRenderedColumns( self.visibleColumnCache.slice(newRange[0], newRange[1]) );
        self.prevColumnScrollIndex = colIndex;
    };
    GridContainer.prototype.getMargin = function (side) {
        var self = this, amount = 0;
        self.viewportAdjusters.forEach(function(func) {
            var adjustment = func.call(this, { height: 0, width: 0 });
            if (adjustment.side && adjustment.side === side) {
                amount += adjustment.width * -1;
            }
        });
        return amount;
    };
    GridContainer.prototype.headerCellWrapperStyle = function() {
        var self = this;
        if (self.currentFirstColumn !== 0) {
            var offset = self.columnOffset;
            return (self.grid.isRTL()) ? { "margin-right": offset + "px" } : { "margin-left": offset + "px" };
        }
        return null;
    };
    GridContainer.prototype.getViewportStyle = function() {
        var self = this, styles = {}, scrollbarVisibility = {};
        scrollbarVisibility[$$util.constants.scrollbars.ALWAYS] = "scroll";
        scrollbarVisibility[$$util.constants.scrollbars.WHEN_NEEDED] = "auto";
        self.hasHScrollbar = self.hasVScrollbar = false;
        if (self.grid.disableScrolling) {
            styles["overflow-x"] = "hidden";
            styles["overflow-y"] = "hidden";
            return styles;
        }
        if (self.name === "body") {
            self.hasHScrollbar = self.grid.options.enableHorizontalScrollbar !== $$util.constants.scrollbars.NEVER;
            if (!self.grid.isRTL()) {
                if (!self.grid.hasRightContainerColumns()) {
                    self.hasVScrollbar = self.grid.options.enableVerticalScrollbar !== $$util.constants.scrollbars.NEVER;
                }
            } else {
                if (!self.grid.hasLeftContainerColumns()) {
                    self.hasVScrollbar = self.grid.options.enableVerticalScrollbar !== $$util.constants.scrollbars.NEVER;
                }
            }
        } else {
            if (self.name === "left") {
                self.hasVScrollbar = self.grid.isRTL() ? self.grid.options.enableVerticalScrollbar !== $$util.constants.scrollbars.NEVER : false;
            } else {
                self.hasVScrollbar = !self.grid.isRTL() ? self.grid.options.enableVerticalScrollbar !== $$util.constants.scrollbars.NEVER : false;
            }
        }
        styles["overflow-x"] = self.hasHScrollbar ? scrollbarVisibility[self.grid.options.enableHorizontalScrollbar] : "hidden";
        styles["overflow-y"] = self.hasVScrollbar ? scrollbarVisibility[self.grid.options.enableVerticalScrollbar] : "hidden";
        return styles;
    };
    GridContainer.prototype.scrollHorizontal = function (newScrollLeft) {
        var horizScrollPercentage = -1;
        if (newScrollLeft !== this.prevScrollLeft) {
            var xDiff = newScrollLeft - this.prevScrollLeft;
            this.grid.scrollDirection = (xDiff > 0) ? $$util.constants.scrollDirection.RIGHT : (xDiff < 0) ? 
            		$$util.constants.scrollDirection.LEFT : this.grid.scrollDirection;
            var horizScrollLength = this.getHorizontalScrollLength();
            horizScrollPercentage = (horizScrollLength !== 0) ? newScrollLeft / horizScrollLength : 0;
            if (this.prevScrollLeft !== newScrollLeft) {
                if (typeof newScrollLeft === "undefined" || newScrollLeft === undefined || newScrollLeft === null) {
                	newScrollLeft = (this.getCanvasWidth() - this.getViewportWidth()) * horizScrollPercentage;
                }
                this.adjustColumns(newScrollLeft, horizScrollPercentage);
                this.prevScrollLeft = newScrollLeft;
                this.prevScrollleftPercentage = horizScrollPercentage;
                this.grid.queueRefresh();
            }
            return horizScrollPercentage;
        }
    };
    GridContainer.prototype.scrollVertical = function (newScrollTop) {
        var vertScrollPercentage = -1;
        if (newScrollTop !== this.prevScrollTop) {
            var yDiff = newScrollTop - this.prevScrollTop;
            this.grid.scrollDirection = (yDiff > 0) ? $$util.constants.scrollDirection.DOWN : (yDiff < 0) ? 
            		$$util.constants.scrollDirection.UP : this.grid.scrollDirection;
            var vertScrollLength = this.getVerticalScrollLength();
            vertScrollPercentage = newScrollTop / vertScrollLength;
            vertScrollPercentage = (vertScrollPercentage > 1) ? 1 : (vertScrollPercentage < 0) ? 0 : vertScrollPercentage;
            if (this.prevScrollTop !== newScrollTop) {
                if (typeof newScrollTop === "undefined" || newScrollTop === undefined || newScrollTop === null) {
                	newScrollTop = (this.getCanvasHeight() - this.getViewportHeight()) * vertScrollPercentage;
                }
                this.adjustRows(newScrollTop, vertScrollPercentage, false);
                this.prevScrollTop = newScrollTop;
                this.prevScrolltopPercentage = vertScrollPercentage;
                this.grid.queueRefresh();
            }
            return vertScrollPercentage;
        }
    };
    GridContainer.prototype.needsHScrollbarPlaceholder = function() {
        var self = this, containerBody;
        if (self.name === "left" || self.name === "right" && !this.hasHScrollbar && !this.grid.disableScrolling) {
            if (self.grid.options.enableHorizontalScrollbar === $$util.constants.scrollbars.ALWAYS) {
                return true;
            }
            containerBody = this.grid.$el.querySelector(".ui-grid-render-container-body .ui-grid-viewport");
            return containerBody.scrollWidth > containerBody.offsetWidth;
        }
        return false;
    };
    
	
	/* Data Grid Java script Row API */
	const GridRow = function (grid, rowData, index) {
        this.grid = grid;
        this.$$height = grid.options.rowHeight;
        this.uid = $$util.nextUid();
        this.data = rowData;
        this.isSelected = false;
        this.visible = true;
	};
    GridRow.prototype.getQualifiedColField = function (col) {
    	return (col.field === "$$this") ? "data" : $$util.preEval("data." + col.field);
    };
    GridRow.prototype.evaluateRowVisibility = function (isRefresh) {
        var visibility = true;
        if (typeof this.invisibleReason !== "undefined") {
        	this.invisibleReason.forEach(function(value, key) {
                if (value) {
                    visibility = false;
                }
            });
        }
        if (typeof this.visible === "undefined" || this.visible !== visibility) {
            this.visible = visibility;
            if (!isRefresh) {
                this.grid.queueGridRefresh();
                this.grid.api.core.raise.rowVisibilityChanged(this);
            }
        }
    };
    GridRow.prototype.setRowInvisible = function (row) {
        if (row) {
            if (!this.invisibleReason) {
                this.invisibleReason = {};
            }
            this.invisibleReason["user"] = true;
            this.evaluateRowVisibility();
        }
    };
    GridRow.prototype.clearRowInvisible = function (row) {
        if (row) {
            if (typeof this.invisibleReason !== "undefined") {
                delete this.invisibleReason["user"];
            }
            this.evaluateRowVisibility();
        }
    };
    GridRow.prototype.setSelected = function (selected) {
        if (selected !== this.isSelected) {
          this.isSelected = selected;
          this.grid.selection.selectedCount += selected ? 1 : -1;
        }
    };
    GridRow.prototype.setFocused = function (val) {
        if (val !== this.isFocused) {
            this.grid.selection.focusedRow && (this.grid.selection.focusedRow.isFocused = false);
            this.grid.selection.focusedRow = val ? this : null;
            this.isFocused = val;
        }
    };
	
	
	/* Data Grid Java script Column API */
	const GridColumn = function (grid, colDef, uid) {
		var self = this;
		self.grid = grid;
		self.uid = uid;
		self.updateColumnDef(colDef, true);
		self.aggregationValue = undefined;
	};
	GridColumn.prototype.setupTooltip = function(col, colDef, name, sFn, dFn) {
        if (typeof colDef[name] === "undefined" || colDef[name] === false) {
        	col[name] = false;
        } else {
            if (colDef[name] === true) {
            	col[name] = dFn;
            } else {
                if (typeof colDef[name] === "function") {
                	col[name] = colDef[name];
                } else {
                	col[name] = sFn;
                }
            }
        }
    };
    GridColumn.prototype.setupCellClass = function(col, colDef, name) {
        if (typeof colDef[name] === "undefined" || colDef[name] === false) {
        	col[name] = undefined;
        } else {
            if (typeof colDef[name] === "function") {
            	col[name] = colDef[name];
            } else {
            	col[name] = function() {
                	return colDef[name];
                };
            }
        }
    };
    GridColumn.prototype.setPropOrDefault = function(colDef, propName, defaultValue) {
        var self = this;
        if (typeof colDef[propName] !== "undefined" && colDef[propName]) {
            self[propName] = colDef[propName];
        } else {
            if (typeof self[propName] !== "undefined") {
                self[propName] = self[propName];
            } else {
                self[propName] = defaultValue ? defaultValue : {};
            }
        }
    };
	GridColumn.prototype.updateColumnDef = function(colDef, isNew) {
		var self = this;
        self.colDef = colDef;
        if (colDef.field === undefined) {
            throw new Error("colDef.field is required for column at index " + self.grid.options.columnDefs.indexOf(colDef));
        }
        if (!$$util.isNumber(self.width) || !self.hasCustomWidth || colDef.allowCustomWidthOverride) {
            var colDefWidth = colDef.width;
            var parseErrorMsg = "Cannot parse column width '" + colDefWidth + "' for column '" + colDef.field + "'";
            self.hasCustomWidth = false;
            if (!$$util.isString(colDefWidth) && !$$util.isNumber(colDefWidth)) {
                self.width = "*";
            } else {
                if ($$util.isString(colDefWidth)) {
                    if ($$util.endsWith(colDefWidth, "%")) {
                        var percentStr = colDefWidth.replace(/%/g, ""), percent = parseInt(percentStr, 10);
                        if (isNaN(percent)) {
                            throw new Error(parseErrorMsg);
                        }
                        self.width = colDefWidth;
                    } else {
                        if (colDefWidth.match(/^(\d+)$/)) {
                            self.width = parseInt(colDefWidth.match(/^(\d+)$/)[1], 10);
                        } else if (colDefWidth.match(/^\*+$/)) {
                            self.width = colDefWidth;
                        } else {
                            throw new Error(parseErrorMsg);
                        }
                    }
                } else {
                    self.width = colDefWidth;
                }
            }
        }
        ["minWidth", "maxWidth"].forEach(function(name) {
            var minOrMaxWidth = colDef[name];
            var parseErrorMsg = "Cannot parse column " + name + " '" + minOrMaxWidth + "' for column named '" + self.field + "'";
            if (name === "minWidth" && !($$util.isString(minOrMaxWidth) || $$util.isNumber(minOrMaxWidth)) && 
            		$$util.isDefined(self.grid.options.minimumColumnSize)) {
                minOrMaxWidth = self.grid.options.minimumColumnSize;
            }
            if (!($$util.isString(minOrMaxWidth) || $$util.isNumber(minOrMaxWidth))) {
                self[name] = (name === "minWidth") ? 30 : 9000;
            } else {
                if ($$util.isString(minOrMaxWidth)) {
                    if (minOrMaxWidth.match(/^(\d+)$/)) {
                        self[name] = parseInt(minOrMaxWidth.match(/^(\d+)$/)[1], 10);
                    } else {
                        throw new Error(parseErrorMsg);
                    }
                } else {
                    self[name]= minOrMaxWidth;
                }
            }
        });
        self.field = colDef.field;
        if (typeof self.field !== "string") {
        	$$util.logError("Field is not a string, this is likely to break the code, Field is: " + self.field);
        }
        self.visible = colDef.visible = $$util.isNullOrUndefined(colDef.visible) || colDef.visible;
        self["objectBinding"] = colDef["objectBinding"] = (colDef.field.indexOf('.') !== -1 && colDef.visible) ? true : false;
        colDef.title = colDef.title === undefined ? $$util.getCamelCaseField(colDef.field) : colDef.title;
        self.title = colDef.title;
        
        self.aggregationType = $$util.isDefined(colDef.aggregationType) ? colDef.aggregationType : null;
        self.headerCellComponent = colDef.headerCellComponent;
        self.cellComponent = colDef.cellComponent;
        
        self.setupTooltip(self, colDef, 'cellTooltip', function(row, col) {
        	return col.colDef.cellTooltip;
        }, function(row, col) { 
        	return self.grid.getCellValue(row, col); 
        });
        self.setupTooltip(self, 'headerTooltip', function(col) {
            return col.colDef.headerTooltip;
        }, function(col) {
            return col.title;
        });
        self.setupCellClass(self, colDef, 'cellClass');
        self.setupCellClass(self, colDef, 'headerCellClass');
        self.setupCellClass(self, colDef, 'footerCellClass');
        var defaultColDefOptions = {
        	"cellFilter": "", "footerCellFilter": "", "sortCellFiltered": false, "filterCellFiltered": false, "sortingAlgorithm": undefined, 
        	"enableSorting": self.grid.options.enableSorting, "sortDirectionCycle": [null, $$util.constants.ASC, $$util.constants.DESC], 
        	"visible": $$util.isNullOrUndefined(colDef.visible) || colDef.visible, "enableColumnHiding": self.grid.options.enableColumnHiding, 
        	"enableFiltering": self.grid.options.enableFiltering, "suppressExport": false
        }
        Object.keys(defaultColDefOptions).forEach(function(key) {
        	self[key] = self.colDef[key] = typeof colDef[key] !== "undefined" ? colDef[key] : defaultColDefOptions[key];
        });
        
        if (typeof self.suppressRemoveSort === "undefined") {
            self.suppressRemoveSort = typeof colDef.suppressRemoveSort !== "undefined" ? colDef.suppressRemoveSort : false;
        }
        var defaultFilters = [];
        if (colDef.filter) {
        	colDef.filter['inherit'] = true;
            defaultFilters.push(colDef.filter);
        } else if (colDef.filters) {
            defaultFilters = colDef.filters;
        }
        self.setPropOrDefault(colDef, "menuItems", []);
        self.setPropOrDefault(colDef, "groupMenuItems", []);
        self.setPropOrDefault(colDef, (isNew)?"sort":"defaultSort");
        if (isNew) {
            self.setPropOrDefault(colDef, "filter");
            self.setPropOrDefault(colDef, "extraStyle");
            self.setPropOrDefault(colDef, "filters", defaultFilters);
        } else {
            if (self.filters.length === defaultFilters.length) {
                self.filters.forEach(function(filter, i1) {
                	["placeholder", "selectOptions", "flags", "type"].forEach(function (item, i2) {
                        if (typeof defaultFilters[i1][item] !== "undefined") {
                            filter[item] = defaultFilters[i1][item];
                        }
                	});
                });
            }
        }
	};
    GridColumn.prototype.getColClass = function (prefixDot) {
        var cls = $$util.constants.COL_CLASS_PREFIX + this.uid;
        return prefixDot ? "." + cls : cls;
    };
    GridColumn.prototype.getColClassDefinition = function () {
        return "\n .ui-grid-" + this.grid.id + " " + this.getColClass(true) + " { min-width: " + 
        	this.drawnWidth + "px; max-width: " + this.drawnWidth + "px; }";
    };
	GridColumn.prototype.getAggregationText = function () {
		var label = this.colDef.aggregationHideLabel ? "" : this.colDef.aggregationLabel ? this.colDef.aggregationLabel : 
        	this.colDef.aggregationType ? $$i18n['en'].aggregation[this.colDef.aggregationType] : ""; 
        return label;
    };
	GridColumn.prototype.getAggregationValue = function() {
        return this.aggregationValue;
    };
	GridColumn.prototype.getCellValues = function() {
        var self=this, values = [], visibleRows = this.grid.getVisibleRows();
        visibleRows.forEach(function(row) {
            var cellValue = self.grid.getCellValue(row, self);
            var cellNumber = Number(cellValue);
            if (!isNaN(cellNumber)) {
                values.push(cellNumber);
            }
        });
        return values;
    };
    GridColumn.prototype.updateAggregationValue = function() {
    	var self=this;
        if (!self.aggregationType) {
            self.aggregationValue = undefined;
            return;
        }
        var result = 0, visibleRows = self.grid.getVisibleRows();
        if ($$util.isFunction(self.aggregationType)) {
            self.aggregationValue = self.aggregationType(visibleRows, self);
        } else {
            if (self.aggregationType === $$util.constants.aggregation.COUNT) {
                self.aggregationValue = self.grid.getVisibleRowCount();
            } else {
                if (self.aggregationType === $$util.constants.aggregation.SUM) {
                    self.getCellValues().forEach(function(value) {
                        result += value;
                    });
                    self.aggregationValue = result;
                } else {
                    if (self.aggregationType === $$util.constants.aggregation.AVG) {
                        self.getCellValues().forEach(function(value) {
                            result += value;
                        });
                        result = result / self.getCellValues().length;
                        self.aggregationValue = result;
                    } else {
                        if (self.aggregationType === $$util.constants.aggregation.MIN) {
                            self.aggregationValue = Math.min.apply(null, self.getCellValues());
                        } else {
                            if (self.aggregationType === $$util.constants.aggregation.MAX) {
                                self.aggregationValue = Math.max.apply(null, self.getCellValues());
                            } else {
                                self.aggregationValue = "\u00a0";
                            }
                        }
                    }
                }
            }
        }
    };
    GridColumn.prototype.getRenderContainer = function () {
    	return this.grid.renderContainers[
    		(this.renderContainer === null || this.renderContainer === "" || this.renderContainer === undefined) ? "body" : this.renderContainer
    	];
    };
    GridColumn.prototype.unsort = function () {
        var priority = this.sort.priority;
        this.grid.columns.forEach(function(col) {
            if (col.sort && col.sort.priority !== undefined && col.sort.priority > priority) {
                col.sort.priority -= 1;
            }
        });
        this.sort = {};
        this.grid.api.core.raise.sortChanged(this.grid, this.grid.getColumnSorting());
    };
    
	
    /* Data Grid Java script Column Menu API */
    const GridColumnMenu = function (grid) {
        this.grid = grid;
    };
    GridColumnMenu.prototype.getColumnElementPosition = function(column, $columnElm) {
        var positionData = {};
        positionData.left = $columnElm.offsetLeft;
        positionData.top = $columnElm.offsetTop;
        positionData.parentLeft = $columnElm.offsetParent.offsetLeft;
        positionData.parentTop = $columnElm.offsetParent.offsetTop;
        positionData.offset = 0;
        if (column.grid.options.offsetLeft) {
            positionData.offset = column.grid.options.offsetLeft;
        }
        positionData.height = $$util.$$element.elementHeight($columnElm, true);
        positionData.width = $$util.$$element.elementWidth($columnElm, true);
        return positionData;
    };
    GridColumnMenu.prototype.repositionMenu = function(column, positionData, $menuElm, $columnMenuElm, $columnElm) {
        var renderContainerElm = $$util.$$element.closestElement($columnElm, ".ui-grid-render-container"),
            renderContainerOffset = renderContainerElm.getBoundingClientRect().left - this.grid.$el.getBoundingClientRect().left,
            containerScrollLeft = renderContainerElm.querySelectorAll(".ui-grid-viewport")[0].scrollLeft;
        var myWidth = $$util.$$element.elementWidth($menuElm, true),
            paddingRight = column.lastMenuPaddingRight ? column.lastMenuPaddingRight : this.lastMenuPaddingRight ? this.lastMenuPaddingRight : 10;
        if ($menuElm.length !== 0) {
            var mid = $menuElm[0].querySelectorAll(".ui-grid-menu-items");
            if (mid.length !== 0) {
                paddingRight = parseInt($$util.$$element.getStyles($menuElm[0])["paddingRight"], 10);
                this.lastMenuPaddingRight = paddingRight;
                column.lastMenuPaddingRight = paddingRight;
            }
        }
        if (positionData) {
            var left = positionData.left + renderContainerOffset - containerScrollLeft + positionData.parentLeft + positionData.width + paddingRight;
            if (left < positionData.offset + myWidth) {
                left = Math.max(positionData.left - containerScrollLeft + positionData.parentLeft - paddingRight + myWidth, positionData.offset + myWidth);
            }
            $columnMenuElm.style["left"] = left + "px";
            $columnMenuElm.style["top"] = positionData.top + positionData.parentTop + positionData.height + "px";
        }
    };
    GridColumnMenu.prototype.sortColumn = function(event, dir) {
        event.stopPropagation();
        var self=this;
        self.grid.sortColumn(self.grid.columnMenuScope.col, dir, true).then(function() {
            self.grid.refresh();
            self.grid.columnMenuScope.hideColumnMenu();
        }, $$util.noop);
    };
    GridColumnMenu.prototype.isSortable = function() {
        return Boolean(this.grid.options.enableSorting && typeof this.grid.columnMenuScope.col !== "undefined" && 
        		this.grid.columnMenuScope.col && this.grid.columnMenuScope.col.enableSorting);
    };
    GridColumnMenu.prototype.isActiveSort = function(direction) {
        return Boolean(typeof this.grid.columnMenuScope.col !== "undefined" && typeof this.grid.columnMenuScope.col.sort !== "undefined" && 
        		typeof this.grid.columnMenuScope.col.sort.direction !== "undefined" && this.grid.columnMenuScope.col.sort.direction === direction);
    };
    GridColumnMenu.prototype.unsortColumn = function() {
        this.grid.columnMenuScope.col.unsort();
        this.grid.columnMenuScope.hideColumnMenu();
        this.grid.refresh();
    };
    GridColumnMenu.prototype.suppressRemoveSort = function() {
        return Boolean(this.grid.columnMenuScope.col && this.grid.columnMenuScope.col.suppressRemoveSort);
    };
    GridColumnMenu.prototype.hideable = function() {
        return !(typeof this.grid.columnMenuScope.col !== "undefined" && this.grid.columnMenuScope.col && 
        		this.grid.columnMenuScope.col.colDef && this.grid.columnMenuScope.col.colDef.enableColumnHiding === false);
    };
    GridColumnMenu.prototype.hideColumn = function() {
    	var self=this;
        this.grid.columnMenuScope.col.colDef.visible = false;
        this.grid.columnMenuScope.col.visible = false;
        this.grid.queueGridRefresh();
        this.grid.columnMenuScope.hideColumnMenu();
        this.grid.api.core.notifyDataChange($$util.constants.dataChange.COLUMN);
        this.grid.api.core.raise.columnVisibilityChanged(this.grid.columnMenuScope.col);
    };
    GridColumnMenu.prototype.getMenuItems = function() {
    	var self=this;
        return [{ //Sort Ascending
            title: function() { return $$i18n['en'].sort.ascending; },
            icon: "ui-icon-sort-asc",
            action: function(e) {
                e.stopPropagation();
                self.sortColumn(e, $$util.constants.ASC);
            },
            active: function() { return self.isActiveSort($$util.constants.ASC); }, 
            shown: function() { return self.isSortable(); }
        }, { //Sort Descending
            title: function() { return $$i18n['en'].sort.descending; },
            icon: "ui-icon-sort-desc",
            action: function(e) {
                e.stopPropagation();
                self.sortColumn(e, $$util.constants.DESC);
            },
            active: function() { return self.isActiveSort($$util.constants.DESC); }, 
            shown: function() { return self.isSortable(); }
        }, { //Remove Sort
            title: function() { return $$i18n['en'].sort.remove; },
            icon: "ui-icon-cancel",
            action: function(e) {
                e.stopPropagation();
                self.unsortColumn();
            },
            shown: function() {
                return self.isSortable() && typeof self.grid.columnMenuScope.col !== "undefined" && 
                  (typeof self.grid.columnMenuScope.col.sort !== "undefined" && typeof self.grid.columnMenuScope.col.sort.direction !== "undefined") && 
                	self.grid.columnMenuScope.col.sort.direction !== null && !self.suppressRemoveSort();
            }
        }, { //Hide Column
            title: function() { return $$i18n['en'].column.hide; },
            icon: "ui-icon-cancel",
            action: function(e) {
                e.stopPropagation();
                self.hideColumn();
            },
            shown: function() { return self.hideable(); }
        }];
    };
    
    
	/* Data Grid Java script Grid API */
	const Grid = function (options) {
        options = typeof options !== "undefined" ? options : {};
        
        this.options = {};
        this.id = $$util.getId();
        this.options["columnDefs"] = options["columnDefs"] || [];
        this.options["baseColumnDefs"] = this.options["columnDefs"].map(a => Object.assign({}, a));
        this.options["data"] = options["data"] || [];
        
        const defaultGridOptions = {
        	"title":"", "autoSelect": {tab: null, field: null}, "columnViews": [], "showColumnView": "Default", 
        	"excludeProperties": ["$$hashKey"], "showHeader": true, "headerRowHeight": (!options.showHeader)?0:30, "minRowsToShow": 10, 
    		"excessRows": 4, "excessColumns": 4, "rowHeight": (typeof options.rowHeight === "string")?parseInt(options.rowHeight):30, 
    		"rowIdentity": function(row) { return $$util.hashKey(row); }, "getRowIdentity":  function(row) { row.$$hashKey; },
    		"rowEquality": function(dataA, dataB) { return dataA === dataB; }, "enableGridFooter": false, 
    		"gridFooterHeight": 30, "autoResize": false, "enableColumnFooter": false, "columnFooterHeight": 30, 
    		"columnWidth": 50, "maxVisibleColumnCount": 200, "minimumColumnSize": 30, "onChangeApi": $$util.noop, 
    		"virtualizationThreshold": 20, "columnVirtualizationThreshold": 10, "scrollThreshold": 4, "scrollDebounce": 300, 
    		"contextMenuData": (options.contextMenuData)?options.contextMenuData:{metadata: {}, options: undefined}, "enableMinHeightCheck": true, 
    		"enableColumnPinning": false, "enableSorting": true, "useExternalSorting": false, "enableFiltering": false, 
    		"useExternalFiltering": false, "enableRowHashing": true, "enableFocusRowOnRowHeaderClick": false, 
    		"enablePagination": false, "enablePaginationControls": true, "paginationPageSizes": [10, 50, 100], "paginationCurrentPage": 1, 
    		"enablePageLinks": false, "paginationTotalItems": 0, "useExternalPagination": false, "useCustomPagination": false, 
    		"enableColumnHiding": true, "enableColumnMenu": true, "enableColumnResizing": false, "enableColumnMoving": false, 
    		"enableHorizontalScrollbar": $$util.constants.scrollbars.ALWAYS, "enableVerticalScrollbar": $$util.constants.scrollbars.ALWAYS, 
    		"enableColumnGrouping": false, "groupingShowCounts": true, "groupingNullLabel": "Null", "enableGroupHeaderSelection": false, 
    		"treeIndent": 10, "treeRowHeaderBaseWidth": 30, "showTreeRowHeader": true, "showTreeExpandNoChildren": true, 
    		"treeRowHeaderAlwaysVisible": true, "treeCustomAggregations": {}, "enableExpandAll": true, 
    		"enableRowSelection": false, "enableRowHeaderSelection": true, "multiSelect": true, "noUnselect": false, 
    		"enableFullRowSelection": !options.enableRowHeaderSelection, "enableFocusRowOnRowHeaderClick": true || !options.enableRowHeaderSelection, 
    		"enableSelectRowOnClick": true, "enableSelectAll": false, "enableSelectionBatchEvent": true, "selectionRowHeaderWidth": 30, 
    		"enableFooterTotalSelected": true, "isRowSelectable": $$util.noop, 
    		"enableExportData": false, "exporterColumnWidth": 200, "exportAllData": true, "exportVisibleData": true, "exportSelectedData": true, 
    		"exportAsCsv": true, "exportAsPdf": true, "exportAsExcel": true, "exporterAllDataFn": null, 
        	"exporterCsvFilename": 'download.csv', "exporterCsvColumnSeparator": ",", "exporterExcelFilename": 'download.xlsx', 
        	"exporterExcelSheetName": "Sheet1", "exporterOlderExcelCompatibility": false, "exporterIsExcelCompatible": false, 
        	"exporterExcelHeader": function( grid, workbook, sheet, docDefinition ) { return null; }, "exporterColumnScaleFactor": 10,
        	"exporterExcelCustomFormatter": function( grid, workbook, docDefinition ) { return docDefinition; }, 
    		"exporterPdfFilename": 'download.pdf', "exporterPdfDefaultStyle": { fontSize: 11 }, "exporterPdfTableStyle": { margin: [0, 5, 0, 15] }, 
        	"exporterPdfTableHeaderStyle": { bold: true, fontSize: 12, color: 'black' }, "exporterPdfHeader": null, "exporterPdfFooter": null, 
        	"exporterPdfShowDateInFooter" : true, "exporterPdfShowPageNosInFooter" : true, "exporterPdfOrientation": 'landscape', 
        	"exporterPdfPageSize": 'A4', "exporterPdfMaxGridWidth": 720, "exporterPdfCustomFormatter": function ( docDef ) { return docDef; }, 
        	"exporterFieldFormatCallback": function( grid, row, col, value ) { return null; }, "exporterFieldApplyFilters": false, 
        	"exporterHeaderFilter": function ( title ) { return title; }, "exporterHeaderFilterUseField": false, 
        	"headerComponent": (options.headerComponent) ? options.headerComponent : undefined, 
    		"rowComponent": (options.rowComponent) ? options.rowComponent : undefined, 
    		"rowExpandableOptions": undefined, "expandableRowHeight": 150, "expandableRowHeaderWidth": 40, "showExpandAllButton": true,
    		"enableExpandableRows": $$util.isFunction(options.rowExpandableOptions)? true : false, "enableRowEdit": false, 
    	};
        
	    var self = this;
        Object.keys(defaultGridOptions).forEach(function(key) {
        	self.options[key] = typeof options[key] !== "undefined" ? options[key] : defaultGridOptions[key];
        });
		if ($$util.isNullOrUndefined(self.options.paginationPageSize)) {
			self.options.paginationPageSize = (self.options.paginationPageSizes.length > 0) ? self.options.paginationPageSizes[0] : 0;
		}
		self.options['enableFiltering'] = (self.options['useExternalFiltering'])? true : self.options['enableFiltering'];
		if (self.options['columnViews'] && self.options['columnViews'].length) {
			let selected = self.options.columnViews.filter(function(view) {
				return (view.selected)?true:false;
			});
			let columns = (selected.length && selected[0].columns) ? selected[0].columns : self.options['columnViews'][0].columns;
			self.options.columnDefs = self.options.baseColumnDefs.filter (function (colDef) {
				return columns.indexOf(colDef.field) !== -1;
			});
		}
        
        self.headerHeight = self.options.headerRowHeight;
        self.gridHeight = self.gridWidth = self.footerHeight = self.columnFooterHeight = 0;
        self.calculateFooterHeight();
        
	    const initProps = {"rows": [], "rowBuilders": [], "rowProcessors": [], "columns": [], "columnBuilders": [], "columnProcessors": [], 
	    	"rowHeaderColumns": [], "styleComputations": [], "renderContainers": {}, "dataChangeCallbacks": {}, "cellValueGetterCache": {}, 
	    	"verticalScrollSyncCallBackFns": {}, "horizontalScrollSyncCallBackFns": {}, "expandable": {}, "rtl": false, "isScrollingVertically": false, 
	    	"isScrollingHorizontally": false, "disableScrolling": false, "scrollDirection": $$util.constants.scrollDirection.NONE};
        Object.keys(initProps).forEach(function(key) {
        	self[key] = initProps[key];
        });
        self.renderContainers.body = new GridContainer(self, "body");
        self.expandable.expandedAll = false;
        
        self.flagScrollingVertically = function(scrollEvent) {
            if (!self.isScrollingVertically && !self.isScrollingHorizontally) {
                self.api.core.raise.scrollBegin(scrollEvent);
            }
            self.isScrollingVertically = true;
            $$util.debounce(function (scrollEvent) {
	                self.isScrollingVertically = false;
	                self.api.core.raise.scrollEnd(scrollEvent);
	                self.scrollDirection = $$util.constants.scrollDirection.NONE;
	            }, (self.options.scrollDebounce === 0 || !scrollEvent.withDelay) ? 
	            		0 : self.options.scrollDebounce
            );
        };
        self.flagScrollingHorizontally = function(scrollEvent) {
            if (!self.isScrollingVertically && !self.isScrollingHorizontally) {
                self.api.core.raise.scrollBegin(scrollEvent);
            }
            self.isScrollingHorizontally = true;
            $$util.debounce( function (scrollEvent) {
	                self.isScrollingHorizontally = false;
	                self.api.core.raise.scrollEnd(scrollEvent);
	                self.scrollDirection = $$util.constants.scrollDirection.NONE;
	            }, (self.options.scrollDebounce === 0 || !scrollEvent.withDelay) ? 
	            		0 : self.options.scrollDebounce
            );
        };
        self.scrollbarHeight = self.scrollbarWidth = 0;
        if (self.options.enableHorizontalScrollbar !== $$util.constants.scrollbars.NEVER) {
            self.scrollbarHeight = $$util.$$element.getScrollbarWidth();
        }
        if (self.options.enableVerticalScrollbar !== $$util.constants.scrollbars.NEVER) {
            self.scrollbarWidth = $$util.$$element.getScrollbarWidth();
        }
        
        self.api = new GridApi(self);
        self.api.setupEvent("core", "renderingComplete");
        self.api.setupEvent("core", "columnVisibilityChanged");
        self.api.setupEvent("core", "columnViewChanged");
        self.api.setupEvent("core", "sortChanged");
        self.api.setupEvent("core", "filterChanged");
        self.api.setupEvent("core", "clearAllFilters");
        self.api.setupEvent("core", "rowVisibilityChanged");
        self.api.setupEvent("core", "rowsRendered");
        self.api.setupEvent("core", "canvasHeightChanged");
        self.api.setupEvent("core", "gridDimensionChanged");
        self.api.setupEvent("core", "scrollBegin");
        self.api.setupEvent("core", "scrollEnd");
        
        var methods = {
        	"refresh": self.refresh, "refreshRows": self.refreshRows, "queueRefresh": self.queueRefresh, "queueGridRefresh": self.queueGridRefresh, 
        	"addRowHeaderColumn": self.addRowHeaderColumn, "handleWindowResize": self.handleWindowResize, "notifyDataChange": self.notifyDataChange, 
        	"setRowInvisible": GridRow.prototype.setRowInvisible, "clearRowInvisible": GridRow.prototype.clearRowInvisible, 
        	"getVisibleRows": self.getVisibleRows, "scrollToIfNecessary": function(row, col) { return self.scrollToIfNecessary(row, col); }, 
        	"scrollTo": function(rowData, colDef) { return self.scrollTo(rowData, colDef); }, "clearAllFilters": self.clearAllFilters
        };
        Object.keys(methods).forEach(function(method) {
        	self.api["core"][method] = $$util.createMethodWrapper(self, methods[method]);
        });
        self.setupDataChangeCallback(self.columnRefreshCallback, [$$util.constants.dataChange.COLUMN]);
        self.setupDataChangeCallback(self.rowRefreshCallback, [$$util.constants.dataChange.EDIT]);
        self.setupDataChangeCallback(self.calculateFooterHeight, [$$util.constants.dataChange.OPTIONS]);
        self.setupStyleComputations({
            priority: 20, fn: self.getFooterStyles
        });
        self.columnMenu = new GridColumnMenu(self);
	};
    Grid.prototype.isRTL = function() {
        return this.rtl;
    };
    Grid.prototype.calculateFooterHeight = function() {
        if (!(this.options.enableGridFooter || this.options.enableColumnFooter)) {
            return 0;
        }
        var height = 0;
        if (this.options.enableColumnFooter) {
            height += this.options.columnFooterHeight;
        }
        this.columnFooterHeight = height;
        if (this.options.enableGridFooter) {
            height += this.options.gridFooterHeight;
        }
        this.footerHeight = height;
    };
    Grid.prototype.setupStyleComputations = function (styleComputationInfo) {
        this.styleComputations.push(styleComputationInfo);
    };
    Grid.prototype.getFooterStyles = function() {
        var style = " .ui-grid-" + this.id + " .ui-grid-footer-aggregates-row { height: " + this.options.columnFooterHeight + "px; }\n";
        style += " .ui-grid-" + this.id + " .ui-grid-footer-info { height: " + this.options.gridFooterHeight + "px; }";
        return style;
    };
    Grid.prototype.updateCanvasHeight = function () {
        var self = this;
        for (var containerId in self.renderContainers) {
            if (self.renderContainers.hasOwnProperty(containerId)) {
                var container = self.renderContainers[containerId];
                container.canvasHeightShouldUpdate = true;
            }
        }
    };
    Grid.prototype.getCellTitleValue = function (row, col) {
        if (!col.cellTitleGetterCache) {
            var custom_filter = col.cellFilter ? " | " + col.cellFilter : "";
            if (typeof row.data["$$" + col.uid] !== "undefined") {
                col.cellTitleGetterCache = $$util.parse(row.data["$$" + col.uid].rendered + custom_filter);
            } else {
                if (!col.colDef.objectBinding && typeof col.field !== "undefined") {
                    var colField = col.field.replace(/(')|(\\)/g, "\\$&");
                    col.cellTitleGetterCache = $$util.parse("data['" + colField + "']" + custom_filter);
                } else {
                    col.cellTitleGetterCache = $$util.parse(row.getQualifiedColField(col) + custom_filter);
                }
            }
        }
        var rowWithCol = Object.assign({}, row, { col: col });
        return col.cellTitleGetterCache(rowWithCol);
    };
    Grid.prototype.getCellValue = function (row, col, skipFilter) {
    	var result = null;
        if (typeof row.data["$$" + col.uid] !== "undefined") {
        	result = row.data["$$" + col.uid].rendered;
        } else if (typeof col.field !== "undefined") {
            if (typeof col.colDef.value === "function") {
            	result = col.colDef.value(row.data[col.field]);
            } else if (!col.colDef.objectBinding) {
            	result = row.data[col.field];
            } else {
                if (!col.cellValueGetterCache) {
                    col.cellValueGetterCache = row.getQualifiedColField(col);
                }
                result = $$util.parse(row, col.cellValueGetterCache)
            }
        }
        if (!skipFilter && col.cellFilter) {
        	if (typeof col.cellFilter === 'function') {
        		result  = col.cellFilter(result);
        	} else if (col.cellFilter === 'date') {
            	const options = {  year: 'numeric', month: 'long', day: 'numeric' }
            	result = new Date(result).toLocaleDateString('en', options);
        	}
        }
        return result;
    };
    Grid.prototype.getColumnDefsFromData = function (data, excludeProperties) {
        if (!data || typeof data[0] === "undefined" || data[0] === undefined) {
            return [];
        }
        excludeProperties = $$util.isUndefined(excludeProperties)?[]:excludeProperties;
        var item = data[0], columnDefs = [];
        Object.keys(item).forEach(function(key) {
            if (excludeProperties.indexOf(key) === -1) {
                columnDefs.push({
                    field: key
                });
            }
        });
        return columnDefs;
    };
    Grid.prototype.setupRowOrColumnProcessor = function (ctx, processor, priority) {
        if (!$$util.isFunction(processor) || [$$util.constants.ROW, $$util.constants.COLUMN].indexOf(ctx) === -1) {
            throw new Error("Invalid access to " + ctx + " processor: " + processor);
        }
    	var processors = (ctx == $$util.constants.ROW)?this.rowProcessors:this.columnProcessors;
        processors.push({ processor: processor, priority: priority });
        processors.sort(function (a, b) {
            return a.priority - b.priority;
        });
    };
    
	/* Data Grid Java script Row Hash Map API */
    const RowHashMap = function (grid) {
    	this.grid = grid;
    };
    RowHashMap.prototype = {
        put: function(key, value) {
            this[this.grid.options.rowIdentity(key)] = value;
        },
        get: function(key) {
            return this[this.grid.options.rowIdentity(key)];
        },
        remove: function(key) {
            var value = this[key = this.grid.options.rowIdentity(key)];
            delete this[key];
            return value;
        }
    };
    Grid.prototype.createRowHashMap = function () {
        var hashMap = new RowHashMap(this);
        return hashMap;
    };
    Grid.prototype.getRow = function (rowData, lookInRows) {
        var self = this;
        lookInRows = typeof lookInRows === "undefined" ? self.rows : lookInRows;
        var rows = lookInRows.filter(function(row) {
            return self.options.rowEquality(row.data, rowData);
        });
        return rows.length > 0 ? rows[0] : null;
    };
    Grid.prototype.setupRowBuilder = function (rowBuilder) {
        this.rowBuilders.push(rowBuilder);
    };
    Grid.prototype.processRowBuilders = function (row) {
        var self = this;
        self.rowBuilders.forEach(function(builder) {
            builder.call(self, row, self.options);
        });
        return row;
    };
    Grid.prototype.processRowProcessors = function (rows) {
        var self = this, nonProcessedRows = rows.slice(0);
        if (self.rowProcessors.length === 0) {
            return new Promise(function(resolve, reject) {
    			resolve(nonProcessedRows);
    		});
        }
    	return new Promise(function(resolve, reject) {
    		var startProcessor = function (i, rowsToProcess) {
                var processor = self.rowProcessors[i].processor;
                return new Promise(function(spResolve, spReject) {
                	spResolve(processor.call(self, rowsToProcess, self.columns));
        		}).then(function (processedRows) {
        			if (!processedRows || !$$util.isArray(processedRows)) {
                        throw new Error("Processor at index " + i + " did not return " + (!processedRows) ? 
                        	"a set of renderable rows" : "an array");
        			}
                    i++;
                    if (i <= self.rowProcessors.length - 1) {
                        return startProcessor(i, processedRows);
                    } else {
                    	resolve(processedRows);
                    }
                }, $$util.error);
            }
            startProcessor(0, nonProcessedRows);
    	});
    };
    Grid.prototype.buildRows = function (rawData) {
        var self = this, oldRows = self.rows.slice(0), oldRowHash = self.rowHashMap || self.createRowHashMap();
        var allRowsSelected = true;
        self.rowHashMap = self.createRowHashMap();
        self.rows.length = 0;
        rawData.forEach(function(dataObj, i) {
            var newRow, oldRow;
            dataObj['id'] = i;
            oldRow = (self.options.enableRowHashing) ? oldRowHash.get(dataObj) : self.getRow(dataObj, oldRows);
            if (oldRow) {
                newRow = oldRow;
                newRow.data = dataObj;
            }
            if (!newRow) {
                newRow = self.processRowBuilders(new GridRow(self, dataObj, i));
            }
            newRow['id'] = i;
            self.rows.push(newRow);
            self.rowHashMap.put(dataObj, newRow);
            if (!newRow.isSelected) {
                allRowsSelected = false;
            }
        });
        if (self.selection && self.rows.length) {
            self.selection.selectAll = allRowsSelected;
        }
        self.processColDefs();
        var p1 = self.processRowProcessors(self.rows).then(function(rowObjs) {
            self.setVisibleRows(rowObjs);
        }, $$util.noop);
        var p2 = self.processColumnProcessors(self.columns).then(function(colObjs) {
            self.setVisibleColumns(colObjs);
        }, $$util.noop);
    	$$util.logDebug("In Build Rows...");
        return Promise.all([p1, p2]).then(function() {
            /*$$util.logDebug("GridRows: ", self.rows);*/
        }, $$util.noop);
    };
    Grid.prototype.rowRefreshCallback = function (grid) {
        grid.queueGridRefresh();
    };
    
    Grid.prototype.setupColumnBuilder = function (columnBuilder) {
        this.columnBuilders.push(columnBuilder);
    };
    Grid.prototype.processColumnProcessors = function (columns) {
        var self = this, nonProcessedCols = columns.slice(0);
        if (self.columnProcessors.length === 0) {
            return new Promise(function(resolve, reject) {
    			resolve(nonProcessedCols);
    		});
        }
    	return new Promise(function(resolve, reject) {
    		var startProcessor = function (i, columnsToProcess) {
                var processor = self.columnProcessors[i].processor;
                return new Promise(function(spResolve, spReject) {
                	spResolve(processor.call(self, columnsToProcess, self.rows));
        		}).then(function (processedColumns) {
        			if (!processedColumns || !$$util.isArray(processedColumns)) {
        				throw "Processor at index " + i + " did not return " + (!processedColumns) ? "a set of renderable rows" : "an array";
        			}
                    i++;
                    if (i <= self.columnProcessors.length - 1) {
                        return startProcessor(i, nonProcessedCols);
                    } else {
                    	resolve(nonProcessedCols);
                    }
                }, $$util.error);
            }
            startProcessor(0, nonProcessedCols);
    	});
    };
    Grid.prototype.getColumn = function (field) {
        var columns = this.columns.filter(function(column) {
            return column.colDef.field === field;
        });
        return columns.length > 0 ? columns[0] : null;
    };
    Grid.prototype.processColDefs = function() {
        var self = this;
        var firstRow = self.rows.length > 0 ? self.rows[0] : null;
        self.options.columnDefs.forEach(function(colDef, index) {
            if (!colDef.type) {
            	var col = self.getColumn(colDef.field);
            	col = (col)?col:new GridColumn(self, colDef, index);
                if (firstRow) {
                    colDef.type = $$util.evaluateType(self.getCellValue(firstRow, col, true));
                } else {
                    colDef.type = "string";
                }
            }
        });
    };
    Grid.prototype.getColDef = function (field) {
        var colDefs = this.options.columnDefs.filter(function(colDef) {
            return colDef.field === field;
        });
        return colDefs.length > 0 ? colDefs[0] : null;
    };
    Grid.prototype.buildColumns = function (opts) {
        var self = this, promises = [], headerOffset = self.rowHeaderColumns.length;
        var options = Object.assign({}, { orderByColumnDefs: false }, opts);
        for (var i = 0; i < self.columns.length; i++) {
            if (!self.getColDef(self.columns[i].field)) {
                self.columns.splice(i, 1);
                i--;
            }
        }
        for (var j = self.rowHeaderColumns.length - 1; j >= 0; j--) {
            self.columns.unshift(self.rowHeaderColumns[j]);
        }
        self.options.columnDefs.forEach(function(colDef, index) {
            if (!colDef.field && !colDef.field) {
                throw new Error("colDef.field is required");
            }
            var col = self.getColumn(colDef.field);
            if (!col) {
                col = new GridColumn(self, colDef, $$util.nextUid());
                self.columns.splice(index + headerOffset, 0, col);
            } else {
                col.updateColumnDef(colDef, false);
            }
            self.columnBuilders.forEach(function(builder) {
                promises.push(builder.call(self, colDef, col, self.options));
            });
        });
        if (!!options.orderByColumnDefs) {
            var columnCache = self.columns.slice(0);
            var len = Math.min(self.options.columnDefs.length, self.columns.length);
            for (i = 0; i < len; i++) {
                if (self.columns[i + headerOffset].field !== self.options.columnDefs[i].field) {
                    columnCache[i + headerOffset] = self.getColumn(self.options.columnDefs[i].field);
                } else {
                    columnCache[i + headerOffset] = self.columns[i + headerOffset];
                }
            }
            self.columns.length = 0;
            Array.prototype.splice.apply(self.columns, [0, 0].concat(columnCache));
        }
    	$$util.logDebug("In Build Columns...");
        return Promise.all(promises).then(function() {
            if (self.rows.length > 0) {
                self.processColDefs();
            }
            //$$util.logDebug("GridColumns: ", self.columns);
        }, $$util.noop);
    };
    Grid.prototype.columnRefreshCallback = function (grid, options) {
        grid.buildColumns(options);
        grid.queueGridRefresh();
    };
    
    Grid.prototype.hasLeftContainer = function() {
        return this.renderContainers.left !== undefined;
    };
    Grid.prototype.hasLeftContainerColumns = function() {
        return this.hasLeftContainer() && this.renderContainers.left.renderedColumns.length > 0;
    };
    Grid.prototype.createLeftContainer = function() {
        if (!this.hasLeftContainer()) {
            this.renderContainers.left = new GridContainer(this, "left", {
                disableColumnOffset: true
            });
        }
    };
    Grid.prototype.hasRightContainer = function() {
        return this.renderContainers.right !== undefined;
    };
    Grid.prototype.hasRightContainerColumns = function() {
        return this.hasRightContainer() && this.renderContainers.right.renderedColumns.length > 0;
    };
    Grid.prototype.createRightContainer = function() {
        if (!this.hasRightContainer()) {
            this.renderContainers.right = new GridContainer(this, "right", {
                disableColumnOffset: true
            });
        }
    };
    Grid.prototype.isRowHeaderColumn = function (column) {
        return this.rowHeaderColumns.indexOf(column) !== -1;
    };
    Grid.prototype.addRowHeaderColumn = function (colDef, order, stopColumnBuild) {
        var self = this;
        if (order === undefined) {
            order = 0;
        }
        var rowHeaderCol = new GridColumn(self, colDef, $$util.nextUid());
        rowHeaderCol.isRowHeader = true;
        if (self.isRTL()) {
            self.createRightContainer();
            rowHeaderCol.renderContainer = "right";
        } else {
            self.createLeftContainer();
            rowHeaderCol.renderContainer = "left";
        }
        rowHeaderCol.enableSorting = rowHeaderCol.enableFiltering = rowHeaderCol.enableColumnHiding = false;
        rowHeaderCol.headerPriority = order;
        self.rowHeaderColumns.push(rowHeaderCol);
        self.rowHeaderColumns = self.rowHeaderColumns.sort(function(a, b) {
            return a.headerPriority - b.headerPriority;
        });
        if (!stopColumnBuild) {
            self.buildColumns().then(function() {
                self.queueGridRefresh();
            }, $$util.noop);
        }
    };
    Grid.prototype.getRowHeaderDataColumns = function () {
        var self = this, cols = [];
        self.columns.forEach(function(col) {
            if (self.rowHeaderColumns.indexOf(col) === -1) {
                cols.push(col);
            }
        });
        return cols;
    };
    Grid.prototype.setupDataChangeCallback = function (callback, types) {
        var self = this, uid = $$util.nextUid();
        types = (!types) ? [$$util.constants.dataChange.ALL] : types;
        if (!Array.isArray(types)) {
        	$$util.logError("Types expected to be an array or null, value passed: " + types);
        }
        this.dataChangeCallbacks[uid] = {
            callback: callback,
            types: types
        };
        return function() {
            delete self.dataChangeCallbacks[uid];
        };
    };
    Grid.prototype.callDataChangeCallbacks = function (type, options) {
    	var self=this;
    	Object.keys(this.dataChangeCallbacks).forEach(function(uid){
    		var callback = self.dataChangeCallbacks[uid];
            if (callback.types.indexOf($$util.constants.dataChange.ALL) !== -1 || 
            		callback.types.indexOf(type) !== -1 || type === $$util.constants.dataChange.ALL) {
                callback.callback(self, options);
            }
    	});
    };
    Grid.prototype.notifyDataChange = function (type) {
        var constants = $$util.constants.dataChange;
        if (type === $$util.constants.dataChange.ALL || type === $$util.constants.dataChange.COLUMN || type === $$util.constants.dataChange.EDIT || 
        		type === $$util.constants.dataChange.ROW || type === $$util.constants.dataChange.OPTIONS) {
            this.callDataChangeCallbacks(type);
        } else {
            $$util.logError("Type was not recognised for a data change, so no action taken, Type: " + type);
        }
    };
    Grid.prototype.setVisibleRows = function (rows) {
        var self = this;
        for (var i in self.renderContainers) {
            var container = self.renderContainers[i];
            container.canvasHeightShouldUpdate = true;
            if (typeof container.visibleRowCache === "undefined") {
                container.visibleRowCache = [];
            } else {
                container.visibleRowCache.length = 0;
            }
        }
        for (var ri = 0; ri < rows.length; ri++) {
            var row = rows[ri];
            var targetContainer = typeof row.renderContainer !== "undefined" && row.renderContainer ? row.renderContainer : "body";
            if (row.visible) {
                self.renderContainers[targetContainer].visibleRowCache.push(row);
            }
        }
        self.api.core.raise.rowVisibilityChanged(this.api);
        self.api.core.raise.rowsRendered(this.api);
    };
    Grid.prototype.setVisibleColumns = function (columns) {
        var self = this;
        for (var i in self.renderContainers) {
            var container = self.renderContainers[i];
            container.visibleColumnCache.length = 0;
        }
        for (var ci = 0; ci < columns.length; ci++) {
            var column = columns[ci];
            if (column.visible) {
                if (typeof column.renderContainer !== "undefined" && column.renderContainer) {
                    self.renderContainers[column.renderContainer].visibleColumnCache.push(column);
                } else {
                    self.renderContainers.body.visibleColumnCache.push(column);
                }
            }
        }
    };
    Grid.prototype.buildStyles = function () {
        var self = this;
        self.customStyles = "";
        self.styleComputations.sort(function(a, b) {
        	return (a.priority === null) ? 1 : (b.priority === null) ? -1 : 
        		(a.priority === null && b.priority === null) ? 0 : a.priority - b.priority;
        }).forEach(function(info) {
            var result = info.fn.call(self);
            if ($$util.isString(result)) {
                self.customStyles += "\n" + result;
            }
        });
    };
    Grid.prototype.refreshCanvas = function(styles) {
        var self = this, containerHeadersToRecalc = [];
        for (var containerId in self.renderContainers) {
            if (self.renderContainers.hasOwnProperty(containerId)) {
                var container = self.renderContainers[containerId];
                if (container.canvasWidth === null || isNaN(container.canvasWidth)) {
                    continue;
                }
                if (container.header || container.headerCanvas) {
                    container.explicitHeaderHeight = container.explicitHeaderHeight || null;
                    container.explicitHeaderCanvasHeight = container.explicitHeaderCanvasHeight || null;
                    containerHeadersToRecalc.push(container);
                }
            }
        }
        if (styles) {
            self.buildStyles();
        }
        return new Promise(function(resolve, reject) {
        	if (containerHeadersToRecalc.length > 0) {
        		setTimeout(() => {
                    var buildStyles = false;
                    var maxHeaderHeight = 0, maxHeaderCanvasHeight = 0;
                    var i, container, getHeight = function(oldVal, newVal) {
                        if (oldVal !== newVal) {
                            buildStyles = true;
                        }
                        return newVal;
                    };
                    for (i = 0; i < containerHeadersToRecalc.length; i++) {
                        container = containerHeadersToRecalc[i];
                        if (container.canvasWidth === null || isNaN(container.canvasWidth)) {
                            continue;
                        }
                        if (container.header) {
                            var headerHeight = container.headerHeight = getHeight(container.headerHeight, 
                            		$$util.$$element.outerElementHeight(container.header));
                            var topBorder = $$util.$$element.getBorderSize(container.header, "top");
                            var bottomBorder = $$util.$$element.getBorderSize(container.header, "bottom");
                            var innerHeaderHeight = parseInt(headerHeight - topBorder - bottomBorder, 10);
                            innerHeaderHeight = innerHeaderHeight < 0 ? 0 : innerHeaderHeight;
                            container.innerHeaderHeight = innerHeaderHeight;
                            if (!container.explicitHeaderHeight && innerHeaderHeight > maxHeaderHeight) {
                                maxHeaderHeight = innerHeaderHeight;
                            }
                        }
                        if (container.headerCanvas) {
                            var headerCanvasHeight = container.headerCanvasHeight = getHeight(container.headerCanvasHeight, 
                            		parseInt($$util.$$element.outerElementHeight(container.headerCanvas), 10));
                            if (!container.explicitHeaderCanvasHeight && headerCanvasHeight > maxHeaderCanvasHeight) {
                                maxHeaderCanvasHeight = headerCanvasHeight;
                            }
                        }
                    }
                    for (i = 0; i < containerHeadersToRecalc.length; i++) {
                        container = containerHeadersToRecalc[i];
                        if (maxHeaderHeight > 0 && typeof container.headerHeight !== "undefined" && container.headerHeight !== null && 
                        		(container.explicitHeaderHeight || container.headerHeight < maxHeaderHeight)) {
                            container.explicitHeaderHeight = getHeight(container.explicitHeaderHeight, maxHeaderHeight);
                        }
                        if (maxHeaderCanvasHeight > 0 && typeof container.headerCanvasHeight !== "undefined" && container.headerCanvasHeight !== null && 
                        		(container.explicitHeaderCanvasHeight || container.headerCanvasHeight < maxHeaderCanvasHeight)) {
                            container.explicitHeaderCanvasHeight = getHeight(container.explicitHeaderCanvasHeight, maxHeaderCanvasHeight);
                        }
                    }
                    if (styles && buildStyles) {
                        self.buildStyles();
                    }
                    resolve();
        		}, 0)
	        } else {
        		setTimeout(() => { resolve(); }, 0)
	        }
		});
    };
    Grid.prototype.redrawCanvas = function (isRefresh) {
        var self = this;
        for (var i in self.renderContainers) {
            var container = self.renderContainers[i],
                prevScrollTop = isRefresh || container.prevScrollTop > 0 ? container.prevScrollTop : null, 
                prevScrollLeft = isRefresh || container.prevScrollLeft > 0 ? container.prevScrollLeft : null, 
                prevScrolltopPercentage = isRefresh || prevScrollTop > 0 ? null : container.prevScrolltopPercentage,
                prevScrollleftPercentage = isRefresh || prevScrollLeft > 0 ? null : container.prevScrollleftPercentage;
            container.adjustRows(prevScrollTop, prevScrolltopPercentage);
            container.adjustColumns(prevScrollLeft, prevScrollleftPercentage);
        }
    };
    Grid.prototype.refresh = function (isRefresh) {
        var self = this;
        var p1 = self.processRowProcessors(self.rows).then(function(rowObjs) {
            self.setVisibleRows(rowObjs);
        }, $$util.noop);
        var p2 = self.processColumnProcessors(self.columns).then(function(colObjs) {
            self.setVisibleColumns(colObjs);
        }, $$util.noop);
        return Promise.all([p1, p2]).then(function() {
            self.refreshCanvas(true);
            self.redrawCanvas(isRefresh);
        }, $$util.noop);
    };
    Grid.prototype.refreshRows = function () {
        var self = this;
        return self.processRowProcessors(self.rows).then(function(rowObjs) {
            self.setVisibleRows(rowObjs);
            self.redrawCanvas();
            self.refreshCanvas(true);
        }, $$util.noop);
    };
    Grid.prototype.queueRefresh = function () {
        var self = this;
        if (self.refreshCanceller) {
        	clearTimeout(self.refreshCanceller);
        }
        self.refreshCanceller = new Promise(function(resolve, reject) {
            setTimeout(function() {
                self.refreshCanvas(true);
    			resolve("Refreshed");
            }, 0);
		}).then(function() {
            self.refreshCanceller = null;
        }, $$util.noop);
        return self.refreshCanceller;
    };
    Grid.prototype.queueGridRefresh = function () {
        var self = this;
        if (self.refreshGridCanceller) {
        	clearTimeout(self.refreshGridCanceller);
        }
        self.refreshGridCanceller = new Promise(function(resolve, reject) {
            setTimeout(function() {
                self.refresh(true);
    			resolve("Refreshed");
            }, 0);
		}).then(function() {
            self.refreshGridCanceller = null;
        }, $$util.noop);
        return self.refreshGridCanceller;
    };
    Grid.prototype.handleWindowResize = function (event) {
        var self = this;
        self.gridWidth = $$util.$$element.elementWidth(self.elm);
        self.gridHeight = $$util.$$element.elementHeight(self.elm);
        return self.queueRefresh();
    };
    Grid.prototype.getVisibleRows = function () {
        return this.renderContainers.body.visibleRowCache;
    };
    Grid.prototype.getVisibleRowCount = function () {
        return this.renderContainers.body.visibleRowCache.length;
    };
    Grid.prototype.adjustGridHeight = function() {
        this.gridWidth = $$util.$$element.elementWidth(this.$el);
        this.gridHeight = $$util.$$element.elementHeight(this.$el);
        this.canvasWidth = this.gridWidth;
        if (this.gridHeight - this.scrollbarHeight <= this.options.rowHeight && this.options.enableMinHeightCheck) {
            var scrollbarHeight = 0, contentHeight = this.options.minRowsToShow * this.options.rowHeight, 
            	headerHeight = this.options.showHeader ? this.options.headerRowHeight : 0;
            if (this.options.enableHorizontalScrollbar === $$util.constants.scrollbars.ALWAYS) {
                scrollbarHeight = $$util.$$element.getScrollbarWidth();
            }
            var footerHeight = this.calculateFooterHeight(), newHeight = headerHeight + contentHeight + scrollbarHeight + footerHeight;
            this.$el.style["height"] = newHeight + "px";
            this.gridHeight = $$util.$$element.elementHeight(this.$el);
        }
        this.refreshCanvas(true);
	};
    Grid.prototype.renderingComplete = function() {
        if ($$util.isFunction(this.options.onChangeApi)) {
            this.options.onChangeApi(this.api);
        }
        this.api.core.raise.renderingComplete(this.api);
    };
    
    Grid.prototype.refreshData = function(data) {
    	var self=this, promises = [];
        var hasColumns = this.columns.length > (this.rowHeaderColumns ? this.rowHeaderColumns.length : 0);
        if (!hasColumns && this.options.columnDefs.length === 0 && data.length > 0) {
            this.getColumnDefsFromData(data);
        }
        if (!hasColumns && (this.options.columnDefs.length > 0 || data.length > 0)) {
            promises.push(this.buildColumns());
        }
        Promise.all(promises).then(function() {
            self.buildRows(data).then(function() {
            	self.adjustGridHeight();
                self.redrawCanvas(true);
                self.refreshCanvas(true);
                self.callDataChangeCallbacks($$util.constants.dataChange.ROW);
                self.showRenderContainer = true;
            }, $$util.noop);
        }, $$util.noop);
    };
    
	/* Data Grid Java script Scroll API */
    Grid.prototype.getViewportWidth = function () {
        return this.gridWidth;
    };
    Grid.prototype.getViewportHeight = function () {
    	return this.gridHeight - this.headerHeight - this.footerHeight;
    };
    Grid.prototype.getScrollLeft = function (element, scrollLeft) {
        if (typeof element.length !== "undefined" && element.length) {
            element = element[0];
        }
        scrollLeft = (scrollLeft)?scrollLeft:element.scrollLeft;
        if (this.isRTL()) {
            switch ($$util.$$element.rtlScrollType()) {
                case "default":
                    return element.scrollWidth - element.clientWidth - scrollLeft;
                case "negative":
                    return Math.abs(scrollLeft);
                case "reverse":
                    return scrollLeft;
            }
        }
        return scrollLeft;
    },
    Grid.prototype.addVerticalScrollSync = function(containerId, callBackFn) {
        this.verticalScrollSyncCallBackFns[containerId] = callBackFn;
    };
    Grid.prototype.addHorizontalScrollSync = function(containerId, callBackFn) {
        this.horizontalScrollSyncCallBackFns[containerId] = callBackFn;
    };
    Grid.prototype.scrollContainers = function(sourceContainerId, scrollEvent) {
        if (scrollEvent.y) {
            var verts = ["body", "left", "right"];
            this.flagScrollingVertically(scrollEvent);
            if (sourceContainerId === "body") {
                verts = ["left", "right"];
            } else {
                if (sourceContainerId === "left") {
                    verts = ["body", "right"];
                } else {
                    if (sourceContainerId === "right") {
                        verts = ["body", "left"];
                    }
                }
            }
            for (var i = 0; i < verts.length; i++) {
                var id = verts[i];
                if (this.verticalScrollSyncCallBackFns[id]) {
                    this.verticalScrollSyncCallBackFns[id](scrollEvent);
                }
            }
        }
        if (scrollEvent.x) {
            var horizs = ["body", "bodyheader", "bodyfooter"];
            this.flagScrollingHorizontally(scrollEvent);
            if (sourceContainerId === "body") {
                horizs = ["bodyheader", "bodyfooter"];
            }
            for (var j = 0; j < horizs.length; j++) {
                var idh = horizs[j];
                if (this.horizontalScrollSyncCallBackFns[idh]) {
                    this.horizontalScrollSyncCallBackFns[idh](scrollEvent);
                }
            }
        }
    };
    
	/* Java script Scroll Event API */
	const ScrollEvent = function (grid, sourceRowContainer, sourceColContainer, source) {
        var self = this;
        self.grid = grid;
        self.source = source;
        self.withDelay = true;
        self.sourceRowContainer = sourceRowContainer;
        self.sourceColContainer = sourceColContainer;
        self.newScrollLeft = null;
        self.newScrollTop = null;
        self.x = null;
        self.y = null;
        self.verticalScrollLength = -9999999;
        self.horizontalScrollLength = -999999;
    };
    ScrollEvent.prototype.getNewScrollLeft = function(colContainer, viewport) {
        var self = this;
        if (!self.newScrollLeft) {
            var scrollWidth = colContainer.getCanvasWidth() - colContainer.getViewportWidth();
            var oldScrollLeft = self.grid.getScrollLeft(viewport), scrollXPercentage;
            if (typeof self.x.percentage !== "undefined" && self.x.percentage !== undefined) {
                scrollXPercentage = self.x.percentage;
            } else {
                if (typeof self.x.pixels !== "undefined" && self.x.pixels !== undefined) {
                    scrollXPercentage = self.x.percentage = (oldScrollLeft + self.x.pixels) / scrollWidth;
                } else {
                    throw new Error("No percentage or pixel value provided for scroll event X axis");
                }
            }
            return Math.max(0, scrollXPercentage * scrollWidth);
        }
        return self.newScrollLeft;
    };
    ScrollEvent.prototype.getNewScrollTop = function(rowContainer, viewport) {
        var self = this;
        if (!self.newScrollTop) {
            var scrollLength = rowContainer.getVerticalScrollLength(), scrollYPercentage;
            var oldScrollTop = (viewport && viewport.length)?viewport[0].scrollTop:0;
            if (typeof self.y.percentage !== "undefined" && self.y.percentage !== undefined) {
                scrollYPercentage = self.y.percentage;
            } else {
                if (typeof self.y.pixels !== "undefined" && self.y.pixels !== undefined) {
                    scrollYPercentage = self.y.percentage = (oldScrollTop + self.y.pixels) / scrollLength;
                } else {
                    throw new Error("No percentage or pixel value provided for scroll event Y axis");
                }
            }
            return Math.max(0, scrollYPercentage * scrollLength);
        }
        return self.newScrollTop;
    };
    ScrollEvent.prototype.atTop = function(scrollTop) {
        return this.y && (this.y.percentage === 0 || this.verticalScrollLength < 0) && scrollTop === 0;
    };
    ScrollEvent.prototype.atBottom = function(scrollTop) {
        return this.y && (this.y.percentage === 1 || this.verticalScrollLength === 0) && scrollTop > 0;
    };
    ScrollEvent.prototype.atLeft = function(scrollLeft) {
        return this.x && (this.x.percentage === 0 || this.horizontalScrollLength < 0) && scrollLeft === 0;
    };
    ScrollEvent.prototype.atRight = function(scrollLeft) {
        return this.x && (this.x.percentage === 1 || this.horizontalScrollLength === 0) && scrollLeft > 0;
    };
    ScrollEvent.prototype.getScrollX = function (horizScrollPixels, horizScrollLength, prevScrollleftPercentage) {
        var scrollLeftPercentage = horizScrollPixels / horizScrollLength;
        scrollLeftPercentage = scrollLeftPercentage > 1 ? 1 : scrollLeftPercentage;
        if (scrollLeftPercentage !== prevScrollleftPercentage) {
            return {
                percentage: scrollLeftPercentage
            };
        }
        return undefined;
    };
    ScrollEvent.prototype.getScrollY = function (scrollPixels, scrollLength, prevScrolltopPercentage) {
        var scrollTopPercentage = scrollPixels / scrollLength;
        scrollTopPercentage = scrollTopPercentage <= 1 ? scrollTopPercentage : 1;
        if (scrollTopPercentage !== prevScrolltopPercentage) {
            return {
                percentage: scrollTopPercentage
            };
        }
        return undefined;
    };
    ScrollEvent.Sources = {
        ViewPortScroll: "ViewPortScroll",
        RenderContainerMouseWheel: "RenderContainerMouseWheel",
        RenderContainerTouchMove: "RenderContainerTouchMove",
        Other: 99
    };
    
    Grid.prototype.scrollToIfNecessary = function(gridRow, gridCol) {
        var self = this;
        var scrollEvent = new ScrollEvent(self, "uiGrid.scrollToIfNecessary");
        var visRowCache = self.renderContainers.body.visibleRowCache;
        var visColCache = self.renderContainers.body.visibleColumnCache;
        var topBound = self.renderContainers.body.prevScrollTop < 0 ? 0 : self.renderContainers.body.prevScrollTop;
        var leftBound = self.renderContainers.body.prevScrollLeft;
        var bottomBound = self.renderContainers.body.prevScrollTop + self.gridHeight - 
        	self.renderContainers.body.headerHeight - self.scrollbarHeight - self.footerHeight;
        var rightBound = self.renderContainers.body.prevScrollLeft + Math.ceil(self.renderContainers.body.getViewportWidth());
        if (gridRow !== null) {
            var seekRowIndex = visRowCache.indexOf(gridRow);
            var scrollLength = self.renderContainers.body.getCanvasHeight() - self.renderContainers.body.getViewportHeight();
            var scrollPixels, pixelsToSeeRow = seekRowIndex * self.options.rowHeight;
            pixelsToSeeRow = pixelsToSeeRow < 0 ? 0 : pixelsToSeeRow;
            if (pixelsToSeeRow < Math.floor(topBound)) {
                scrollPixels = self.renderContainers.body.prevScrollTop - (topBound - pixelsToSeeRow);
                if (gridCol && gridCol.colDef && gridCol.colDef.enableCellEditOnFocus) {
                    scrollPixels = scrollPixels - self.scrollbarHeight - self.footerHeight;
                }
                scrollEvent.y = scrollEvent.getScrollY(scrollPixels, scrollLength, self.renderContainers.body.prevScrolltopPercentage);
            } else {
                if (pixelsToSeeRow > Math.ceil(bottomBound)) {
                    scrollPixels = pixelsToSeeRow - bottomBound + self.renderContainers.body.prevScrollTop;
                    scrollEvent.y = scrollEvent.getScrollY(scrollPixels + self.options.rowHeight, scrollLength, 
                    		self.renderContainers.body.prevScrolltopPercentage);
                }
            }
        }
        if (gridCol !== null) {
            var seekColumnIndex = visColCache.indexOf(gridCol), columnLeftEdge = 0;
            var horizScrollLength = self.renderContainers.body.getCanvasWidth() - self.renderContainers.body.getViewportWidth();
            for (var i = 0; i < seekColumnIndex; i++) {
                var col = visColCache[i];
                columnLeftEdge += col.drawnWidth;
            }
            columnLeftEdge = columnLeftEdge < 0 ? 0 : columnLeftEdge;
            var horizScrollPixels, columnRightEdge = columnLeftEdge + gridCol.drawnWidth;
            columnRightEdge = columnRightEdge < 0 ? 0 : columnRightEdge;
            if (columnLeftEdge < leftBound) {
                horizScrollPixels = self.renderContainers.body.prevScrollLeft - (leftBound - columnLeftEdge);
                scrollEvent.x = scrollEvent.getScrollX(horizScrollPixels, horizScrollLength, self.renderContainers.body.prevScrollleftPercentage);
            } else {
                if (columnRightEdge > rightBound) {
                    horizScrollPixels = columnRightEdge - rightBound + self.renderContainers.body.prevScrollLeft;
                    scrollEvent.x = scrollEvent.getScrollX(horizScrollPixels, horizScrollLength, self.renderContainers.body.prevScrollleftPercentage);
                }
            }
        }
        return new Promise(function(resolve, reject) {
            if (scrollEvent.y || scrollEvent.x) {
                scrollEvent.withDelay = false;
                self.scrollContainers("", scrollEvent);
                var dereg = self.api.core.on.scrollEnd(function() {
                    resolve(scrollEvent);
                    dereg();
                });
            } else {
                resolve();
            }
        });
    };
    Grid.prototype.scrollTo = function (rowData, colDef) {
        var gridRow = null, gridCol = null;
        if (rowData !== null && typeof rowData !== "undefined") {
            gridRow = this.getRow(rowData);
        }
        if (colDef !== null && typeof colDef !== "undefined" && typeof colDef.field !== "undefined") {
            gridCol = this.getColumn(colDef.field);
        }
        return this.scrollToIfNecessary(gridRow, gridCol);
    };
    
	
    /* Java script Data Grid Column Pinning API */
    const $$pinning = {
    	setupColumnPinning: function (grid) {
        	var self=this;
        	self.grid = grid;
        	grid.options.hidePinLeft = grid.options.enableColumnPinning && grid.options.hidePinLeft;
        	grid.options.hidePinRight = grid.options.enableColumnPinning && grid.options.hidePinRight;
        	grid.pinColumn = function(col, container) {
    			if (container === $$util.constants.NONE) {
    				col.renderContainer = null;
    				col.colDef.pinnedLeft = col.colDef.pinnedRight = false;
    			} else {
    				col.renderContainer = container;
    				if (container === $$util.constants.LEFT) {
    					grid.createLeftContainer();
    				} else if (container === $$util.constants.RIGHT) {
    					grid.createRightContainer();
    				}
    			}
    			grid.refresh(true).then(function() {
    				grid.api.pinning.raise.columnPinned( col.colDef, container );
    			});
    		};
        	grid.setupColumnBuilder(function pinningColumnBuilder(colDef, col, options) {
        		colDef.enableColumnPinning = colDef.enableColumnPinning === undefined ? options.enableColumnPinning : colDef.enableColumnPinning;
        		colDef.hidePinLeft = colDef.hidePinLeft === undefined ? options.hidePinLeft : colDef.hidePinLeft;
        		colDef.hidePinRight = colDef.hidePinRight === undefined ? options.hidePinRight : colDef.hidePinRight;
        		if (colDef.pinnedLeft) {
        			col.renderContainer = 'left';
        			col.grid.createLeftContainer();
        		} else if (colDef.pinnedRight) {
        			col.renderContainer = 'right';
        			col.grid.createRightContainer();
        		}
        		if (!colDef.enableColumnPinning) {
        			return;
        		}
        		var pinColumnLeftAction = {
        			name: 'ui.grid.pinning.pinLeft', title: $$i18n['en'].pinning.pinLeft, icon: 'ui-icon-pin-left',
        			shown: function () {
        				return typeof(this.context.col.renderContainer) === 'undefined' || 
        					!this.context.col.renderContainer || this.context.col.renderContainer !== 'left';
        			},
        			action: function () {
        				grid.api.pinning.pinColumn(this.context.col, $$util.constants.LEFT);
        			}
        		};
        		var pinColumnRightAction = {
        			name: 'ui.grid.pinning.pinRight', title: $$i18n['en'].pinning.pinRight, icon: 'ui-icon-pin-right',
        			shown: function () {
        				return typeof(this.context.col.renderContainer) === 'undefined' || 
        					!this.context.col.renderContainer || this.context.col.renderContainer !== 'right';
        			},
        			action: function () {
        				grid.api.pinning.pinColumn(this.context.col, $$util.constants.RIGHT);
        			}
        		};
        		var removePinAction = {
        			name: 'ui.grid.pinning.unpin', title: $$i18n['en'].pinning.unpin, icon: 'ui-icon-unpin',
        			shown: function () {
        				return typeof(this.context.col.renderContainer) !== 'undefined' && 
        					this.context.col.renderContainer !== null && this.context.col.renderContainer !== 'body';
        			},
        			action: function () {
        				grid.api.pinning.pinColumn(this.context.col, $$util.constants.NONE);
        			}
        		};
        		if (!colDef.hidePinLeft && !$$util.arrayContainsObjectWithProperty(col.menuItems, 'name', 'ui.grid.pinning.pinLeft')) {
        			col.menuItems.push(pinColumnLeftAction);
        		}
        		if (!colDef.hidePinRight && !$$util.arrayContainsObjectWithProperty(col.menuItems, 'name', 'ui.grid.pinning.pinRight')) {
        			col.menuItems.push(pinColumnRightAction);
        		}
        		if (!$$util.arrayContainsObjectWithProperty(col.menuItems, 'name', 'ui.grid.pinning.unpin')) {
        			col.menuItems.push(removePinAction);
        		}
        	});
        	grid.api.setupEvent("pinning", "columnPinned");
        	grid.api["pinning"]["pinColumn"] = $$util.createMethodWrapper(grid, grid.pinColumn);
        }
    };
    Grid.prototype.setupColumnPinning = function (grid) {
		$$pinning.setupColumnPinning(grid);
    };
    
    
	/* Java script Data Grid Row Selection API */
    const $$selection = {
    	enableRowSelection: function (grid) {
        	grid.selection = {
    			selectedCount: 0,
    			lastSelectedRow: null,
    			focusedRow: null,
    			selectAll: false
    		};
    		if (grid.options.enableRowHeaderSelection) {
    			grid.addRowHeaderColumn({
    				field: 'rowSelectionCol', title: '', 
    				width: grid.options.selectionRowHeaderWidth,
    				minWidth: 10,
    				enableColumnMoving: false,
    				enableColumnResizing: false,
    				enableColumnMenu: false,
    				suppressExport: true,
    				allowCellFocus: true
    			}, 15);
    		}
        	grid.api.setupEvent("selection", "rowFocusChanged");
        	grid.api.setupEvent("selection", "rowSelectionChanged");
        	grid.api.setupEvent("selection", "rowSelectionChangedBatch");
        	
    		grid.selection.getSelectedRows = function () {
    			return grid.rows.filter(function (row) {
    				return row.isSelected;
    			});
    		};
    		grid.selection.raiseSelectionEvent = function (row, changedRows, evt) {
    			if (!grid.options.enableSelectionBatchEvent) {
    				grid.api.selection.raise.rowSelectionChanged(row, evt);
    			} else {
    				changedRows.push(row);
    			}
    		};
    		grid.selection.raiseSelectionBatchEvent = function (changedRows, evt) {
    			if (changedRows.length > 0) {
    				grid.api.selection.raise.rowSelectionChangedBatch(changedRows, evt);
    			}
    		};
    		grid.selection.toggleTreeNodeSelection = function (row, status) {
    			if (row.treeNode && row.treeNode.parentRow) {
    				row.treeNode.parentRow.setSelected(status);
    				if (row.treeNode.parentRow.treeNode) {
    					grid.selection.toggleTreeNodeSelection(row.treeNode.parentRow, status);
    				}
    			}
    		};
    		grid.selection.clearSelectedRows = function (evt) {
    			var changedRows = [];
    			grid.selection.getSelectedRows().forEach(function (row) {
    				if (row.isSelected && row.enableSelection !== false && grid.options.isRowSelectable(row) !== false) {
    					row.setSelected(false);
    					if (row.treeNode) grid.selection.toggleTreeNodeSelection(row, false);
    					grid.selection.raiseSelectionEvent(row, changedRows, evt);
    				}
    			});
    			grid.selection.selectAll = false;
    			grid.selection.selectedCount = 0;
    			grid.selection.raiseSelectionBatchEvent(changedRows, evt);
    		};
        	grid.selection.toggleRowSelection = function (row, evt, multiSelect, noUnselect) {
    			var selected = row.isSelected, selectedRows;
    			if ( row.enableSelection === false ) {
    				return;
    			}
    			if (!multiSelect) {
    				if (selected) {
    					grid.selection.clearSelectedRows(evt);
    				} else {
    					selectedRows = grid.selection.getSelectedRows();
    					if (selectedRows.length > 1) {
    						selected = false;
    						grid.selection.clearSelectedRows(evt);
    					}
    				}
    			}
    			if (selected) {
    				if (row.isSelected === true) {
    					grid.selection.lastSelectedRow = row;
    				}
    				selectedRows = grid.selection.getSelectedRows();
    				grid.selection.selectAll = grid.rows.length === selectedRows.length;
    				grid.api.selection.raise.rowSelectionChanged(row, evt);
    			}
    		};
    		
        	grid.api["selection"]["toggleRowSelection"] = $$util.createMethodWrapper(grid, function (rowData, evt) {
    			var row = grid.getRow(rowData);
    			if (row !== null) {
    				grid.selection.toggleRowSelection(row, evt, grid.options.multiSelect, grid.options.noUnselect);
    			}
    		});
        	grid.api["selection"]["selectRow"] = $$util.createMethodWrapper(grid, function (rowData, evt) {
    			var row = grid.getRow(rowData);
    			if (row !== null && !row.isSelected) {
    				grid.selection.toggleRowSelection(row, evt, grid.options.multiSelect, grid.options.noUnselect);
    			}
    		});
        	grid.api["selection"]["selectRowByVisibleIndex"] = $$util.createMethodWrapper(grid, function (rowNum, evt) {
    			var row = grid.renderContainers.body.visibleRowCache[rowNum];
    			if (row !== null && typeof (row) !== 'undefined' && !row.isSelected) {
    				grid.selection.toggleRowSelection(row, evt, grid.options.multiSelect, grid.options.noUnselect);
    			}
    		});
        	grid.api["selection"]["unSelectRow"] = $$util.createMethodWrapper(grid, function (rowData, evt) {
    			var row = grid.getRow(rowData);
    			if (row !== null && row.isSelected) {
    				grid.selection.toggleRowSelection(row, evt, grid.options.multiSelect, grid.options.noUnselect);
    			}
    		});
        	grid.api["selection"]["unSelectRowByVisibleIndex"] = $$util.createMethodWrapper(grid, function (rowNum, evt) {
    			var row = grid.renderContainers.body.visibleRowCache[rowNum];
    			if (row !== null && typeof (row) !== 'undefined' && row.isSelected) {
    				grid.selection.toggleRowSelection(row, evt, grid.options.multiSelect, grid.options.noUnselect);
    			}
    		});
        	grid.api["selection"]["selectAllRows"] = $$util.createMethodWrapper(grid, function (evt) {
    			if (grid.options.multiSelect !== false) {
    				var changedRows = [];
    				grid.rows.forEach(function (row) {
    					if (!row.isSelected && row.enableSelection !== false && grid.options.isRowSelectable(row) !== false) {
    						row.setSelected(true);
    						grid.selection.raiseSelectionEvent(row, changedRows, evt);
    					}
    				});
    				grid.selection.selectAll = true;
    				grid.selection.raiseSelectionBatchEvent(changedRows, evt);
    			}
    		});
        	grid.api["selection"]["selectAllVisibleRows"] = $$util.createMethodWrapper(grid, function (evt) {
    			if (grid.options.multiSelect !== false) {
    				var changedRows = [];
    				grid.rows.forEach(function(row) {
    					if (row.visible) {
    						if (!row.isSelected && row.enableSelection !== false && grid.options.isRowSelectable(row) !== false) {
    							row.setSelected(true);
    							if (row.treeNode) grid.selection.toggleTreeNodeSelection(row, true);
    							grid.selection.raiseSelectionEvent(row, changedRows, evt);
    						}
    					} else if (row.isSelected) {
    						row.setSelected(false);
    						grid.selection.raiseSelectionEvent(row, changedRows, evt);
    					}
    				});
    				grid.selection.selectAll = true;
    				grid.selection.raiseSelectionBatchEvent(changedRows, evt);
    			}
    		});
        	grid.api["selection"]["clearSelectedRows"] = $$util.createMethodWrapper(grid, function (evt) {
    			grid.selection.clearSelectedRows(evt);
    		});
        	grid.api["selection"]["getSelectedRows"] = $$util.createMethodWrapper(grid, function () {
    			return grid.selection.getSelectedRows().map(function (row) {
    				return row.data;
    			}).filter(function (rowData) {
    				return rowData.hasOwnProperty('$$hashKey') || !$$util.isObject(rowData);
    			});
    		});
        	grid.api["selection"]["getSelectedGridRows"] = $$util.createMethodWrapper(grid, function () {
    			return grid.selection.getSelectedRows();
    		});
        	grid.api["selection"]["getSelectedCount"] = $$util.createMethodWrapper(grid, function () {
    			return grid.selection.selectedCount;
    		});
        	grid.api["selection"]["setMultiSelect"] = $$util.createMethodWrapper(grid, function (multiSelect) {
    			grid.options.multiSelect = multiSelect;
    		});
        	grid.api["selection"]["getSelectAllState"] = $$util.createMethodWrapper(grid, function () {
    			return grid.selection.selectAll;
    		});
        	
    		var isRowProcessorSetup = false;
    		var updateOptions = function () {
    			if (grid.options.isRowSelectable !== $$util.noop && isRowProcessorSetup !== true) {
    				grid.setupRowOrColumnProcessor($$util.constants.ROW, function (rows) {
    					rows.forEach(function (row) {
    						row.enableSelection = grid.options.isRowSelectable(row);
    					});
    					return rows;
    				}, 300);
    				isRowProcessorSetup = true;
    			}
    		};
    		updateOptions();
    		
    		grid.selection.dataChangeRowSelectionDereg = grid.setupDataChangeCallback(
    				updateOptions, [$$util.constants.dataChange.OPTIONS]);
        }
    };
    Grid.prototype.enableRowSelection = function (grid) {
    	$$selection.enableRowSelection(grid);
    };
    
    
	/* Java script Row Sort Functions */
	const $$sort = {
		colSortFnCache: {},
		evaluateSortFn: function (type) {
	        switch (type) {
	            case "number":
	                return $$sort.sortNumber;
	            case "numberStr":
	                return $$sort.sortNumberStr;
	            case "boolean":
	                return $$sort.sortBool;
	            case "string":
	                return $$sort.sortAlpha;
	            case "date":
	                return $$sort.sortDate;
	            case "object":
	                return $$sort.basicSort;
	            default:
	                throw new Error("No sorting function found for type: " + type);
	        }
	    },
	    handleNulls: function (a, b) {
	        if (!a && a !== 0 && a !== false || !b && b !== 0 && b !== false) {
	            if (!a && a !== 0 && a !== false && (!b && b !== 0 && b !== false)) {
	                return 0;
	            } else {
	                if (!a && a !== 0 && a !== false) {
	                    return 1;
	                } else {
	                    if (!b && b !== 0 && b !== false) {
	                        return -1;
	                    }
	                }
	            }
	        }
	        return null;
	    },
	    basicSort: function (a, b) {
	        var nulls = $$sort.handleNulls(a, b);
	        if (nulls !== null) {
	            return nulls;
	        }
	        if (a === b) {
	            return 0;
	        }
	        if (a < b) {
	            return -1;
	        }
	        return 1;
	    },
	    sortNumber: function (a, b) {
	        var nulls = $$sort.handleNulls(a, b);
	        return (nulls !== null) ? nulls : a - b;
	    },
	    sortNumberStr: function (a, b) {
	        var nulls = $$sort.handleNulls(a, b);
	        if (nulls !== null) {
	            return nulls;
	        }
	        var numA = parseFloat(a.replace(/[^0-9.-]/g, ""));
	        var numB = parseFloat(b.replace(/[^0-9.-]/g, ""));
	        var badA = isNaN(numA), badB = isNaN(numB);
	        if (badA || badB) {
	            return (badA && badB) ? 0 : (badA ? 1 : -1);
	        }
	        return numA - numB;
	    },
	    sortAlpha: function (a, b) {
	        var nulls = $$sort.handleNulls(a, b);
	        if (nulls !== null) {
	            return nulls;
	        }
	        var strA = a.toString().toLowerCase(), strB = b.toString().toLowerCase();
	        return strA === strB ? 0 : strA.localeCompare(strB);
	    },
	    sortDate: function (a, b) {
	        var nulls = $$sort.handleNulls(a, b);
	        if (nulls !== null) {
	            return nulls;
	        }
	        var timeA = (a instanceof Date) ? a.getTime() : new Date(a).getTime();
	        var timeB = (b instanceof Date) ? b.getTime() : new Date(b).getTime();
	        return timeA === timeB ? 0 : (timeA < timeB ? -1 : 1);
	    },
	    sortBool: function (a, b) {
	        var nulls = $$sort.handleNulls(a, b);
	        if (nulls !== null) {
	            return nulls;
	        }
	        if ((a && b) || (!a && !b)) {
	            return 0;
	        }
	        return a ? 1 : -1;
	    },
	    getSortFn: function (grid, col, rows) {
	        var sortFn, item;
	        if ($$sort.colSortFnCache[col.colDef.field]) {
	            sortFn = $$sort.colSortFnCache[col.colDef.field];
	        } else {
	            if (col.sortingAlgorithm !== undefined) {
	                sortFn = col.sortingAlgorithm;
	                $$sort.colSortFnCache[col.colDef.field] = col.sortingAlgorithm;
	            } else {
	                if (col.sortCellFiltered && col.cellFilter) {
	                    sortFn = $$sort.sortAlpha;
	                    $$sort.colSortFnCache[col.colDef.field] = sortFn;
	                } else {
	                    sortFn = $$sort.evaluateSortFn(col.colDef.type);
	                    if (sortFn) {
	                        $$sort.colSortFnCache[col.colDef.field] = sortFn;
	                    } else {
	                        sortFn = $$sort.sortAlpha;
	                    }
	                }
	            }
	        }
	        return sortFn;
	    },
	    prioritySort: function (a, b) {
	        if (a.sort && a.sort.priority !== undefined && b.sort && b.sort.priority !== undefined) {
	            if (a.sort.priority < b.sort.priority) {
	                return -1;
	            }
	            if (a.sort.priority === b.sort.priority) {
	                return 0;
	            }
	            return 1;
	        }
	        if (a.sort && a.sort.priority !== undefined) {
	            return -1;
	        }
	        if (b.sort && b.sort.priority !== undefined) {
	            return 1;
	        }
	        return 0;
	    },
	    getCellValues: function (grid, rowA, rowB, col) {
	        var propA, propB;
	        if (col.sortCellFiltered) {
	            propA = grid.getCellTitleValue(rowA, col);
	            propB = grid.getCellTitleValue(rowB, col);
	        } else {
	            propA = grid.getCellValue(rowA, col);
	            propB = grid.getCellValue(rowB, col);
	        }
	        return [propA, propB];
	    },
	    sort: function (grid, rows, columns) {
	        if (!rows) {
	            return;
	        }
	        if (grid.options.useExternalSorting) {
	            return rows;
	        }
	        var sortCols = [], defaultSortCols = [];
	        columns.forEach(function(col) {
	            if (col.sort && !col.sort.ignoreSort && col.sort.direction && 
	            		(col.sort.direction === $$util.constants.ASC || col.sort.direction === $$util.constants.DESC)) {
	                sortCols.push({
	                    col: col,
	                    sort: col.sort
	                });
	            } else {
	                if (col.defaultSort && col.defaultSort.direction && 
	                		(col.defaultSort.direction === $$util.constants.ASC || col.defaultSort.direction === $$util.constants.DESC)) {
	                    defaultSortCols.push({
	                        col: col,
	                        sort: col.defaultSort
	                    });
	                }
	            }
	        });
	        sortCols = sortCols.sort($$sort.prioritySort);
	        defaultSortCols = defaultSortCols.sort($$sort.prioritySort);
	        sortCols = sortCols.concat(defaultSortCols);
	        if (sortCols.length === 0) {
	            return rows;
	        }
	        var col, direction;
	        rows.forEach(function (row, idx) {
	            row.data.$$uiGridIndex = idx;
	        });
	        var r = rows.slice(0), rowSortFn = function(rowA, rowB) {
	            var tem = 0, idx = 0, sortFn;
	            while (tem === 0 && idx < sortCols.length) {
	                col = sortCols[idx].col;
	                direction = sortCols[idx].sort.direction;
	                sortFn = $$sort.getSortFn(grid, col, r);
	                var props = $$sort.getCellValues(grid, rowA, rowB, col);
	                tem = sortFn(props[0], props[1], rowA, rowB, direction, col);
	                idx++;
	            }
	            if (tem === 0) {
	                return rowA.data.$$uiGridIndex - rowB.data.$$uiGridIndex;
	            }
	            return (direction === $$util.constants.ASC) ? tem : 0 - tem;
	        };
	        var newRows = rows.sort(rowSortFn);
	        rows.forEach(function(row, idx) {
	            delete row.data.$$uiGridIndex;
	        });
	        return newRows;
		}
	};
	
	/* Data Grid Java script Row Sort API */
    Grid.prototype.getColumnSorting = function () {
        var self = this, sortedCols = [], myCols;
        myCols = self.columns.slice(0);
        myCols.sort($$sort.prioritySort).forEach(function(col) {
            if (col.sort && typeof col.sort.direction !== "undefined" && col.sort.direction && 
            		(col.sort.direction === $$util.constants.ASC || col.sort.direction === $$util.constants.DESC)) {
                sortedCols.push(col);
            }
        });
        return sortedCols;
    };
    Grid.prototype.removeSortOfColumn = function (column, grid) {
        grid.columns.forEach(function(col) {
            if (col.sort && col.sort.priority !== undefined && col.sort.priority > column.sort.priority) {
                col.sort.priority -= 1;
            }
        });
        column.sort = {};
    };
    Grid.prototype.getNextColumnSortPriority = function () {
        var self = this, p = 0;
        self.columns.forEach(function(col) {
            if (col.sort && col.sort.priority !== undefined && col.sort.priority >= p) {
                p = col.sort.priority + 1;
            }
        });
        return p;
    };
    Grid.prototype.resetColumnSorting = function (excludeCol) {
        var self = this;
        self.columns.forEach(function(col) {
            if (col !== excludeCol && !col.suppressRemoveSort) {
                col.sort = {};
            }
        });
    };
    Grid.prototype.sortColumn = function (column, directionOrAdd, add) {
        var self = this, direction = null;
        if (typeof column === "undefined" || !column) {
            throw new Error("No column parameter provided");
        }
        if (typeof directionOrAdd === "boolean") {
            add = directionOrAdd;
        } else {
            direction = directionOrAdd;
        }
        if (!add) {
            self.resetColumnSorting(column);
            column.sort.priority = undefined;
            column.sort.priority = self.getNextColumnSortPriority();
        } else if (column.sort.priority === undefined) {
            column.sort.priority = self.getNextColumnSortPriority();
        }
        if (!direction) {
            var i = column.sortDirectionCycle.indexOf(column.sort && column.sort.direction ? column.sort.direction : null);
            i = (i + 1) % column.sortDirectionCycle.length;
            if (column.colDef && column.suppressRemoveSort && !column.sortDirectionCycle[i]) {
                i = (i + 1) % column.sortDirectionCycle.length;
            }
            if (column.sortDirectionCycle[i]) {
                column.sort.direction = column.sortDirectionCycle[i];
            } else {
                self.removeSortOfColumn(column, self);
            }
        } else {
            column.sort.direction = direction;
        }
        self.api.core.raise.sortChanged(self, self.getColumnSorting());
        return new Promise(function(resolve, reject) {
			resolve(column);
		});
    };
    Grid.prototype.sortByColumn = function (renderableRows) {
        return $$sort.sort(this, renderableRows, this.columns);
    };
    
    
	/* Java script Row Search Functions */
	const $$search = {
		getValue: function (filter) {
	        if (typeof filter.value === "undefined") {
	            return filter.value;
	        }
	        var value = filter.value;
	        if (typeof value === "string") {
	            value = value.trim();
	        }
	        return value;
	    },
	    stripValue: function (filter) {
	        var value = $$search.getValue(filter);
	        if (typeof value === "string") {
	            return value.replace(/(^\*|\*$)/g, "").replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	        } else {
	            return value;
	        }
	    },
	    getCondition: function (filter) {
	        if (typeof filter.value === "undefined" || !filter.value) {
	            return $$util.constants.filter.CONTAINS;
	        }
	        var value = $$search.getValue(filter);
	        if (/\*/.test(value)) {
	            var regexpFlags = "";
	            if (!filter.flags || !filter.flags.caseSensitive) {
	                regexpFlags += "i";
	            }
	            var reText = value.replace(/(\\)?\*/g, function($0, $1) {
	                return $1 ? $0 : "[\\s\\S]*?";
	            });
	            return new RegExp("^" + reText + "$", regexpFlags);
	        } else if (filter.type && filter.type == 'select') {
	        	return $$util.constants.filter.EQUALS;
	        } else {
	            return $$util.constants.filter.CONTAINS;
	        }
	    },
	    setupFilters: function (filters) {
	        var newFilters = [];
	        for (var i = 0; i < filters.length; i++) {
	            var filter = filters[i];
	            if (filter.noValue || !$$util.isNullOrUndefined(filter.value)) {
	                var newFilter = {}, regexpFlags = "";
	                if (!filter.flags || !filter.flags.caseSensitive) {
	                    regexpFlags += "i";
	                }
	                if (!$$util.isNullOrUndefined(filter.value)) {
	                    if (filter.rawValue) {
	                        newFilter.value = filter.value;
	                    } else {
	                        newFilter.value = $$search.stripValue(filter);
	                    }
	                }
	                newFilter.noValue = filter.noValue;
	                newFilter.condition = filter.condition || $$search.getCondition(filter);
	                newFilter.flags = Object.assign({}, {caseSensitive: false, date: false}, filter.flags);
	                if (newFilter.condition === $$util.constants.filter.STARTS_WITH) {
	                    newFilter.startswithRE = new RegExp("^" + newFilter.value, regexpFlags);
	                }
	                if (newFilter.condition === $$util.constants.filter.ENDS_WITH) {
	                    newFilter.endswithRE = new RegExp(newFilter.value + "$", regexpFlags);
	                }
	                if (newFilter.condition === $$util.constants.filter.CONTAINS) {
	                    newFilter.containsRE = new RegExp(newFilter.value, regexpFlags);
	                }
	                if (newFilter.condition === $$util.constants.filter.EQUALS) {
	                    newFilter.equalsRE = new RegExp("^" + newFilter.value + "$", regexpFlags);
	                }
	                newFilters.push(newFilter);
	            }
	        }
	        return newFilters;
	    },
	    runColumnFilter: function (grid, row, column, filter) {
	        var value = filter.value;
	        if (filter.value == '') return true;
	        var cellValue = (column.filterCellFiltered) ? grid.getCellTitleValue(row, column) : grid.getCellValue(row, column);
	        if (typeof cellValue === "number" && typeof value === "string") {
	            var tempFloat = parseFloat(value.replace(/\\\./, ".").replace(/\\\-/, "-"));
	            if (!isNaN(tempFloat)) {
	                value = tempFloat;
	            }
	        }
	        if (filter.flags.date === true) {
	            cellValue = new Date(cellValue);
	            value = new Date(value.replace(/\\/g, ""));
	        }
	        var result = (filter.condition instanceof RegExp) ? filter.condition.test(cellValue) : 
	        	(typeof filter.condition === "function") ? filter.condition(value, cellValue, row, column) : 
	        	filter.startswithRE ? filter.startswithRE.test(cellValue) : filter.endswithRE ? filter.endswithRE.test(cellValue) : 
	        	filter.containsRE ? filter.containsRE.test(cellValue) : filter.equalsRE ? filter.equalsRE.test(cellValue) : 
	        	(filter.condition === $$util.constants.filter.NOT_EQUAL) ? !(new RegExp("^" + value + "$").exec(cellValue)) : 
	        	(filter.condition === $$util.constants.filter.GREATER_THAN) ? cellValue > value : 
	        	(filter.condition === $$util.constants.filter.GREATER_THAN_OR_EQUAL) ? cellValue >= value : 
	        	(filter.condition === $$util.constants.filter.LESS_THAN) ? cellValue < value : 
	        	(filter.condition === $$util.constants.filter.LESS_THAN_OR_EQUAL) ? cellValue <= value : true;
        	return result;
	    },
	    searchColumn: function (grid, row, column, filters) {
	        if (grid.options.useExternalFiltering) {
	            return true;
	        }
	        for (var i = 0; i < filters.length; i++) {
	            var filter = filters[i];
	            if (!$$util.isNullOrUndefined(filter.value) && filter.value !== "" || filter.noValue) {
	                var ret = $$search.runColumnFilter(grid, row, column, filter);
	                if (!ret) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    },
	    search: function (grid, rows, columns) {
	        if (!rows) {
	            return;
	        }
	        if (!grid.options.enableFiltering) {
	            return rows;
	        }
	        var filterData = [];
	        var hasValue = function(filters) {
	            var hasValue = false;
	            filters.forEach(function(filter) {
	                if (!$$util.isNullOrUndefined(filter.value) && filter.value !== "" || filter.noValue) {
	                    hasValue = true;
	                }
	            });
	            return hasValue;
	        };
	        for (var i = 0; i < columns.length; i++) {
	            var col = columns[i];
	            if (typeof col.filters !== "undefined" && hasValue(col.filters)) {
	                filterData.push({ col: col, filters: $$search.setupFilters(col.filters) });
	            }
	        }
	        if (filterData.length > 0) {
	            for (var i = 0, fdln = filterData.length; i < fdln; i++) {
	                for (var j = 0, rln = rows.length; j < rln; j++) {
		                if (rows[j].visible && !$$search.searchColumn(grid, rows[j], filterData[i].col, filterData[i].filters)) {
		                	rows[j].visible = false;
		                }
	                }
	            }
	            if (grid.api.core.raise.rowVisibilityChanged) {
	                grid.api.core.raise.rowVisibilityChanged();
	            }
	        }
	        return rows;
	    }
	};
    
	/* Data Grid Java script Row Search API */
    Grid.prototype.searchRows = function (renderableRows) {
        return $$search.search(this, renderableRows, this.columns);
    };
    Grid.prototype.clearAllFilters = function clearAllFilters(refreshRows, clearConditions, clearFlags) {
    	refreshRows = (refreshRows === undefined) ? true : refreshRows;
    	clearConditions = (clearConditions === undefined) ? false : clearConditions;
    	clearFlags = (clearFlags === undefined) ? false : clearFlags;
        this.columns.forEach(function(column) {
            column.filters.forEach(function(filter) {
                filter.value = (filter.type == 'select')? '' : undefined;
                if (clearConditions) {
                    filter.condition = undefined;
                }
                if (clearFlags) {
                    filter.flags = undefined;
                }
            });
        });
        if (this.options.useExternalFiltering) {
        	this.api.core.raise.clearAllFilters(this);
        } else if (refreshRows) {
            return this.refreshRows();
        }
    };
    
    
	/* Java script Data Grid Tree Row Expand/Collapse API */
    const $$tree = {
		allExpandedRecursive: function( treeNode ) {
			if ( treeNode.children && treeNode.children.length > 0 ) {
				if ( treeNode.state === "collapsed" ) {
					return false;
				}
				var allExpanded = true;
				treeNode.children.forEach( function( node ) {
					if ( !$$tree.allExpandedRecursive( node ) ) {
						allExpanded = false;
					}
				});
				return allExpanded;
			}
			return true;
		},
		allExpanded: function( tree ) {
			var allExpanded = true;
			tree.forEach(function( node ) {
				if ( !$$tree.allExpandedRecursive( node ) ) {
					allExpanded = false;
				}
			});
			return allExpanded;
		},
		setAllNodes: function (grid, treeNode, targetState) {
			if ( typeof(treeNode.state) !== 'undefined' && treeNode.state !== targetState ) {
				treeNode.state = targetState;
				if ( targetState === "expanded" ) {
					grid.api.treeBase.raise.rowExpanded(treeNode.row);
				} else {
					grid.api.treeBase.raise.rowCollapsed(treeNode.row);
				}
			}
			// set all child nodes
			if ( treeNode.children ) {
				treeNode.children.forEach(function( childNode ) {
					$$tree.setAllNodes(grid, childNode, targetState);
				});
			}
		},
		renderTree: function( nodeList ) {
			var renderableRows = [];
			nodeList.forEach( function ( node ) {
				if ( node.row.visible ) {
					renderableRows.push( node.row );
				}
				if ( node.state === "expanded" && node.children && node.children.length > 0 ) {
					renderableRows = renderableRows.concat( $$tree.renderTree( node.children ) );
				}
			});
			return renderableRows;
		},
		setParentsVisible: function( node ) {
			while ( node.parentRow ) {
				node.parentRow.visible = true;
				node = node.parentRow.treeNode;
			}
		},
		fixFilterRecursive: function( nodes, parentsVisible) {
			nodes.forEach(function( node ) {
				if ( node.row.visible && !parentsVisible ) {
					$$tree.setParentsVisible( node );
					parentsVisible = true;
				}
				if ( node.children && node.children.length > 0 ) {
					if ( $$tree.fixFilterRecursive( node.children, ( parentsVisible && node.row.visible ) ) ) {
						parentsVisible = true;
					}
				}
			});
			return parentsVisible;
		},
		fixFilter: function( grid ) {
			var parentsVisible;
			grid.treeBase.tree.forEach( function( node ) {
				if ( node.children && node.children.length > 0 ) {
					parentsVisible = node.row.visible;
					$$tree.fixFilterRecursive( node.children, parentsVisible );
				}
			});
		},
		sortRecursive: function( grid, treeList ) {
			var rows = treeList.map( function( node ) {
				return node.row;
			});
			rows = $$sort.sort( grid, rows, grid.columns );
			
			var treeNodes = rows.map( function( row ) {
				return row.treeNode;
			});
			treeNodes.forEach( function( node ) {
				if ( node.state === "expanded" && node.children && node.children.length > 0 ) {
					node.children = $$tree.sortRecursive( grid, node.children );
				}
			});
			return treeNodes;
		},
		sortTree: function( grid ) {
			grid.columns.forEach( function( column ) {
				if ( column.sort && column.sort.ignoreSort ) {
					delete column.sort.ignoreSort;
				}
			});
			grid.treeBase.tree = $$tree.sortRecursive( grid, grid.treeBase.tree );
		},
		buildAggregationObject: function( column ) {
			var newAggregation = { col: column };
			if ( column.treeAggregation && column.treeAggregation.type ) {
				newAggregation.type = column.treeAggregation.type;
			}
			if ( column.treeAggregation && column.treeAggregation.label ) {
				newAggregation.label = column.treeAggregation.label;
			}
			return newAggregation;
		},
		addOrUseNode: function( grid, row, parents, aggregationBase ) {
			var newAggregations = [];
			aggregationBase.forEach( function(aggregation) {
				newAggregations.push($$tree.buildAggregationObject(aggregation.col));
			});
			var newNode = { state: "collapsed", row: row, parentRow: null, aggregations: newAggregations, children: [] };
			if ( row.treeNode ) {
				newNode.state = row.treeNode.state;
			}
			if ( parents.length > 0 ) {
				newNode.parentRow = parents[parents.length - 1];
			}
			row.treeNode = newNode;
			if ( parents.length === 0 ) {
				grid.treeBase.tree.push( newNode );
			} else {
				parents[parents.length - 1].treeNode.children.push( newNode );
			}
		},
		aggregate: function( grid, row, parents ) {
			if (parents.length === 0 && row.treeNode && row.treeNode.aggregations) {
				row.treeNode.aggregations.forEach(function(aggregation) {
					// Calculate aggregations for footer even if there are no grouped rows
					if (typeof(aggregation.col.treeFooterAggregation) !== 'undefined') {
						var fieldValue = grid.getCellValue(row, aggregation.col);
						var numValue = Number(fieldValue);
						if (aggregation.col.treeAggregationFn) {
							aggregation.col.treeAggregationFn(aggregation.col.treeFooterAggregation, fieldValue, numValue, row);
						} else {
							aggregation.col.treeFooterAggregation.value = undefined;
						}
					}
				});
			}
			parents.forEach( function( parent, index ) {
				if (parent.treeNode.aggregations) {
					parent.treeNode.aggregations.forEach( function( aggregation ) {
						var fieldValue = grid.getCellValue(row, aggregation.col);
						var numValue = Number(fieldValue);
						aggregation.col.treeAggregationFn(aggregation, fieldValue, numValue, row);
						if (index === 0 && typeof(aggregation.col.treeFooterAggregation) !== 'undefined') {
							if (aggregation.col.treeAggregationFn) {
								aggregation.col.treeAggregationFn(aggregation.col.treeFooterAggregation, fieldValue, numValue, row);
							} else {
								aggregation.col.treeFooterAggregation.value = undefined;
							}
						}
					});
				}
			});
		},
		setCurrentState: function( parents ) {
			var currentState = "expanded";
			parents.forEach( function(parent) {
				if ( parent.treeNode.state === "collapsed" ) {
					currentState = "collapsed";
				}
			});
			return currentState;
		},
		finaliseAggregation: function(row, aggregation) {
			if ( aggregation.col.treeAggregationUpdateEntity && typeof(row) !== 'undefined' && 
					typeof(row.data[ '$$' + aggregation.col.uid ]) !== 'undefined' ) {
				$$util.extend( aggregation, row.data[ '$$' + aggregation.col.uid ]);
			}
			if ( typeof(aggregation.col.treeAggregationFinalizerFn) === 'function' ) {
				aggregation.col.treeAggregationFinalizerFn( aggregation );
			}
			if ( typeof(aggregation.col.customTreeAggregationFinalizerFn) === 'function' ) {
				aggregation.col.customTreeAggregationFinalizerFn( aggregation );
			}
			if ( typeof(aggregation.rendered) === 'undefined' ) {
				aggregation.rendered = aggregation.label ? aggregation.label + aggregation.value : aggregation.value;
			}
		},
		finaliseAggregations: function( row ) {
			if ( row == null || typeof(row.treeNode.aggregations) === 'undefined' ) {
				return;
			}
			row.treeNode.aggregations.forEach( function( aggregation ) {
				$$tree.finaliseAggregation(row, aggregation);
				if ( aggregation.col.treeAggregationUpdateEntity ) {
					var aggregationCopy = {};
					Object.keys(aggregation).forEach(function( key ) {
						if ( aggregation.hasOwnProperty(key) && key !== 'col' ) {
							aggregationCopy[key] = aggregation[key];
						}
					});
					row.data[ '$$' + aggregation.col.uid ] = aggregationCopy;
				}
			});
		},
		treeFooterAggregationType: function( rows, column ) {
			$$tree.finaliseAggregation(undefined, column.treeFooterAggregation);
			if ( typeof(column.treeFooterAggregation.value) === 'undefined' || column.treeFooterAggregation.rendered === null ) {
				// No aggregation performed, Might be this is a grouped column
				return '';
			}
			return column.treeFooterAggregation.rendered;
		},
		getAggregations: function( grid ) {
			var aggregateArray = [];
			grid.columns.forEach( function(column) {
				if ( typeof(column.treeAggregationFn) !== 'undefined' ) {
					aggregateArray.push( $$tree.buildAggregationObject(column) );
					if ( grid.options.enableColumnFooter && typeof(column.colDef.aggregationType) === 'undefined' && column.treeAggregation ) {
						// Add aggregation object for footer
						column.treeFooterAggregation = $$tree.buildAggregationObject(column);
						column.aggregationType = $$tree.treeFooterAggregationType;
					}
				}
			});
			return aggregateArray;
		},
		createTree: function( grid, renderableRows ) {
			var currentLevel = -1, parentsCache = {}, parents = [], currentState;
			grid.treeBase.tree = [];
			grid.treeBase.numberLevels = 0;
			
			var self=this, aggregations = $$tree.getAggregations( grid );
			renderableRows.forEach( function createNode( row ) {
				if ( !row.internalRow && row.treeLevel !== row.data.$$treeLevel ) {
					row.treeLevel = row.data.$$treeLevel;
				}
				if ( row.treeLevel <= currentLevel ) {
					//pop any levels that aren't parents of this level, formatting the aggregation at the same time
					while ( row.treeLevel <= currentLevel ) {
						var lastParent = parents.pop();
						$$tree.finaliseAggregations( lastParent );
						currentLevel--;
					}
					// reset our current state based on the new parent, set to expanded if this is a level 0 node
					if ( parents.length > 0 ) {
						currentState = $$tree.setCurrentState(parents);
					} else {
						currentState = "expanded";
					}
				}
				// If row header as parent exists in parentsCache
				if (typeof row.treeLevel !== 'undefined' && row.treeLevel !== null && row.treeLevel >= 0 && parentsCache.hasOwnProperty(row.uid)) {
					parents.push(parentsCache[row.uid]);
				}
				// aggregate if this is a leaf node
				if ( ( typeof(row.treeLevel) === 'undefined' || row.treeLevel === null || row.treeLevel < 0 ) && row.visible  ) {
					$$tree.aggregate( grid, row, parents );
				}
				// add this node to the tree
				if (!parentsCache.hasOwnProperty(row.uid)) {
					$$tree.addOrUseNode(grid, row, parents, aggregations);
				}
				if ( typeof(row.treeLevel) !== 'undefined' && row.treeLevel !== null && row.treeLevel >= 0 ) {
					if (!parentsCache.hasOwnProperty(row.uid)) {
						parentsCache[row.uid] = row;
						parents.push(row);
					}
					currentLevel++;
					currentState = $$tree.setCurrentState(parents);
				}
				// update the tree number of levels, so we can set header width if we need to
				if ( grid.treeBase.numberLevels < row.treeLevel + 1) {
					grid.treeBase.numberLevels = row.treeLevel + 1;
				}
			});
			// finalize remaining aggregations
			while ( parents.length > 0 ) {
				var lastParent = parents.pop();
				$$tree.finaliseAggregations( lastParent );
			}
			return grid.treeBase.tree;
		},
		updateRowHeaderWidth: function( grid ) {
			var rowHeader = grid.getColumn("expandCollapseCol"),
			newWidth = grid.options.treeRowHeaderBaseWidth + grid.options.treeIndent * Math.max(grid.treeBase.numberLevels - 1, 0);
			if ( rowHeader && newWidth !== rowHeader.width ) {
				rowHeader.width = newWidth;
				grid.queueRefresh();
			}
			var newVisibility = true;
			if ( grid.options.showTreeRowHeader === false ) {
				newVisibility = false;
			}
			if ( grid.options.treeRowHeaderAlwaysVisible === false && grid.treeBase.numberLevels <= 0 ) {
				newVisibility = false;
			}
			if ( rowHeader  && rowHeader.visible !== newVisibility ) {
				rowHeader.visible = newVisibility;
				rowHeader.colDef.visible = newVisibility;
				grid.queueGridRefresh();
			}
		},
    	setupGridTree: function(grid) {
			var self=this;
			grid.treeBase = {};
			grid.treeBase.numberLevels = 0;
			grid.treeBase.expandAll = false;
	        grid.treeBase.tree = [];
    		
	        grid.setupRowOrColumnProcessor( $$util.constants.ROW, function( renderableRows ) {
				if (renderableRows.length === 0) {
					$$tree.updateRowHeaderWidth( grid );
					return renderableRows;
				}
				grid.treeBase.tree = $$tree.createTree( grid, renderableRows );
				$$tree.updateRowHeaderWidth( grid );
				grid.columns.forEach( function( column ) {
					if ( column.sort ) {
						column.sort.ignoreSort = true;
					}
        		});
				$$tree.sortTree( grid );
				$$tree.fixFilter( grid );
				return $$tree.renderTree( grid.treeBase.tree );
			}, 450);
	        
			grid.addRowHeaderColumn({
				field: "expandCollapseCol", title: '', 
				width:  grid.options.treeRowHeaderBaseWidth,
				visible: grid.options.treeRowHeaderAlwaysVisible,
				minWidth: 10,
				enableColumnResizing: false,
				enableColumnMenu: false,
				suppressExport: true,
				allowCellFocus: true
			}, 5);
			
	    	grid.api.setupEvent("treeBase", "rowExpanded");
	    	grid.api.setupEvent("treeBase", "rowCollapsed");
			
	    	grid.api["treeBase"]["toggleRowTreeState"] = $$util.createMethodWrapper(grid, function (row) {
				if ( typeof(row.treeLevel) === 'undefined' || row.treeLevel === null || row.treeLevel < 0 ) {
					return;
				}
				if (row.treeNode.state === "expanded") {
					grid.api.treeBase.collapseRow(row);
				} else {
					grid.api.treeBase.expandRow(row, false);
				}
				grid.queueGridRefresh();
	    	});
	    	grid.api["treeBase"]["expandRow"] = $$util.createMethodWrapper(grid, function (row, recursive) {
				if ( recursive ) {
					var parents = [];
					while ( row && typeof(row.treeLevel) !== 'undefined' && row.treeLevel !== null && 
							row.treeLevel >= 0 && row.treeNode.state !== "expanded" ) {
						parents.push(row);
						row = row.treeNode.parentRow;
					}
					if ( parents.length > 0 ) {
						row = parents.pop();
						while ( row ) {
							row.treeNode.state = "expanded";
							grid.api.treeBase.raise.rowExpanded(row);
							row = parents.pop();
						}
						grid.treeBase.expandAll = $$tree.allExpanded(grid.treeBase.tree);
						grid.queueGridRefresh();
					}
				} else {
					if ( typeof(row.treeLevel) === 'undefined' || row.treeLevel === null || row.treeLevel < 0 ) {
						return;
					}
					if ( row.treeNode.state !== "expanded" ) {
						row.treeNode.state = "expanded";
						grid.api.treeBase.raise.rowExpanded(row);
						grid.treeBase.expandAll = $$tree.allExpanded(grid.treeBase.tree);
						grid.queueGridRefresh();
					}
				}
	    	});
	    	grid.api["treeBase"]["expandRowChildren"] = $$util.createMethodWrapper(grid, function (row) {
				if ( typeof(row.treeLevel) === 'undefined' || row.treeLevel === null || row.treeLevel < 0 ) {
					return;
				}
				$$tree.setAllNodes(grid, row.treeNode, "expanded");
				grid.treeBase.expandAll = $$tree.allExpanded(grid.treeBase.tree);
				grid.queueGridRefresh();
	    	});
	    	grid.api["treeBase"]["expandAllRows"] = $$util.createMethodWrapper(grid, function () {
				grid.treeBase.tree.forEach( function( node ) {
					$$tree.setAllNodes( grid, node, "expanded");
				});
				grid.treeBase.expandAll = true;
				grid.queueGridRefresh();
	    	});
	    	grid.api["treeBase"]["collapseRow"] = $$util.createMethodWrapper(grid, function (row) {
				if ( typeof(row.treeLevel) === 'undefined' || row.treeLevel === null || row.treeLevel < 0 ) {
					return;
				}
				if ( row.treeNode.state !== "collapsed" ) {
					row.treeNode.state = "collapsed";
					grid.treeBase.expandAll = false;
					grid.api.treeBase.raise.rowCollapsed(row);
					grid.queueGridRefresh();
				}
	    	});
	    	grid.api["treeBase"]["collapseRowChildren"] = $$util.createMethodWrapper(grid, function (row) {
				if ( typeof(row.treeLevel) === 'undefined' || row.treeLevel === null || row.treeLevel < 0 ) {
					return;
				}
				$$tree.setAllNodes(grid, row.treeNode, "collapsed");
				grid.treeBase.expandAll = false;
				grid.queueGridRefresh();
	    	});
	    	grid.api["treeBase"]["collapseAllRows"] = $$util.createMethodWrapper(grid, function () {
				grid.treeBase.tree.forEach( function( node ) {
					$$tree.setAllNodes( grid, node, "collapsed");
				});
				grid.treeBase.expandAll = false;
				grid.queueGridRefresh();
	    	});
	    	grid.api["treeBase"]["getRowChildren"] = $$util.createMethodWrapper(grid, function (row) {
        		return row.treeNode.children.map( function( childNode ) {
        			return childNode.row;
        		});
	    	});
    	}
    };
    
    
	/* Java script Data Grid Column Grouping API */
    const $$grouping = {
    	enableColumnGrouping: function (grid) {
            var self=this;
    		grid.grouping = {};
    		grid.grouping.groupingHeaderCache = {};
        	
    		self.groupedFinalizerFn = function( aggregation ) {
    			var col = this;
    			if ( typeof(aggregation.groupVal) !== 'undefined') {
    				aggregation.rendered = aggregation.groupVal;
    				if ( col.grid.options.groupingShowCounts && col.colDef.type !== 'date' && col.colDef.type !== 'object' ) {
    					aggregation.rendered += (' (' + aggregation.value + ')');
    				}
    			} else {
    				aggregation.rendered = null;
    			}
    		};
    		self.getGrouping = function( grid ) {
    			var groupArray = [], aggregateArray = [];
    			// get all the grouping
    			grid.columns.forEach(function(column) {
    				if ( column.grouping ) {
    					if ( typeof(column.grouping.priority) !== 'undefined' && column.grouping.priority >= 0) {
    						groupArray.push({ field: column.field, col: column, priority: column.grouping.priority, grouping: column.grouping });
    					}
    				}
    				if ( column.treeAggregation && column.treeAggregation.type ) {
    					aggregateArray.push({ field: column.field, col: column, aggregation: column.treeAggregation });
    				}
    			});
    			// sort grouping into priority order
    			groupArray.sort( function(a, b) {
    				return a.priority - b.priority;
    			});
    			// renumber the priority in case it was somewhat messed up, then remove the grouping reference
    			groupArray.forEach( function( group, index) {
    				group.grouping.priority = index;
    				group.priority = index;
    				delete group.grouping;
    			});
    			return { grouping: groupArray, aggregations: aggregateArray };
    		};
    		self.insertGroupHeader = function( grid, renderableRows, rowIndex, processingState, stateIndex ) {
    			// set the value that caused the end of a group into the header row and the processing state
    			var col = processingState[stateIndex].col, newValue = grid.getCellValue(renderableRows[rowIndex], col), newDisplayValue = newValue;
    			if ( typeof(newValue) === 'undefined' || newValue === null ) {
    				newDisplayValue = grid.options.groupingNullLabel;
    			}
    			function getKeyAsValueForCacheMap(key) {
    				return $$util.isObject(key) ? JSON.stringify(key) : key;
    			}
    			var cacheItem = grid.grouping.oldGroupingHeaderCache;
    			for ( var i = 0; i < stateIndex; i++ ) {
    				if ( cacheItem && cacheItem[getKeyAsValueForCacheMap(processingState[i].currentValue)] ) {
    					cacheItem = cacheItem[getKeyAsValueForCacheMap(processingState[i].currentValue)].children;
    				}
    			}
    			var headerRow;
    			if ( cacheItem && cacheItem[getKeyAsValueForCacheMap(newValue)]) {
    				headerRow = cacheItem[getKeyAsValueForCacheMap(newValue)].row;
    				headerRow.data = {};
    			} else {
    				headerRow = new GridRow( grid, {}, null );
    			}
    			headerRow.data['$$' + processingState[stateIndex].col.uid] = { groupVal: newDisplayValue };
    			headerRow.treeLevel = stateIndex;
    			headerRow.groupHeader = true;
    			headerRow.internalRow = true;
    			headerRow.enableCellEdit = false;
    			headerRow.enableSelection = grid.options.enableGroupHeaderSelection;
    			processingState[stateIndex].initialised = true;
    			processingState[stateIndex].currentValue = newValue;
    			processingState[stateIndex].currentRow = headerRow;
    			
    			// set all processing states below this one to not be initialised - change of this state means all those need to start again
    			for ( var i = stateIndex + 1; i < processingState.length; i++) {
    				processingState[i].initialised = false;
    				processingState[i].currentRow = null;
    				processingState[i].currentValue = null;
    			}
    			// insert our new header row
    			renderableRows.splice(rowIndex, 0, headerRow);
    			// add our new header row to the cache
    			cacheItem = grid.grouping.groupingHeaderCache;
    			for ( i = 0; i < stateIndex; i++ ) {
    				cacheItem = cacheItem[getKeyAsValueForCacheMap(processingState[i].currentValue)].children;
    			}
    			cacheItem[getKeyAsValueForCacheMap(newValue)] = { row: headerRow, children: {} };
    		};
    		self.initialiseProcessingState = function( grid ) {
    			var processingState = [];
    			var columnSettings = self.getGrouping( grid );
    			columnSettings.grouping.forEach( function( groupItem, index) {
    				processingState.push({ fieldName: groupItem.field, col: groupItem.col, initialised: false, currentValue: null, currentRow: null });
    			});
    			return processingState;
    		};
    		
    		grid.setupRowOrColumnProcessor( $$util.constants.ROW, function groupRows( renderableRows ) {
    			var grid = renderableRows[0].grid;
    			if (renderableRows.length === 0) {
    				return renderableRows;
    			}
    			grid.grouping.oldGroupingHeaderCache = grid.grouping.groupingHeaderCache || {};
    			grid.grouping.groupingHeaderCache = {};
    			var processingState = self.initialiseProcessingState( grid );
    			
    			// processes each of the fields we are grouping by, checks if the value has changed and inserts a groupHeader
    			var updateProcessingState = function( groupFieldState, stateIndex ) {
    				var fieldValue = grid.getCellValue(row, groupFieldState.col);
    				// look for change of value - and insert a header
    				if ( !groupFieldState.initialised || $$sort.getSortFn(grid, groupFieldState.col, renderableRows)
    						(fieldValue, groupFieldState.currentValue) !== 0 ) {
    					self.insertGroupHeader( grid, renderableRows, i, processingState, stateIndex );
    					i++;
    				}
    			};
    			// use a for loop because it's tolerant of the array length changing whilst we go - we can
    			// manipulate the iterator when we insert groupHeader rows
    			for (var i = 0; i < renderableRows.length; i++ ) {
    				var row = renderableRows[i];
    				if ( row.visible ) {
    					processingState.forEach( updateProcessingState );
    				}
    			}
    			delete grid.grouping.oldGroupingHeaderCache;
    			return renderableRows;
    		}, 400);
    		
    		grid.setupRowOrColumnProcessor( $$util.constants.COLUMN, function moveGroupColumns( columns ) {
    			var grid = columns[0].grid;
    			if ( grid.options.moveGroupColumns === false) {
    				return columns;
    			}
    			columns.forEach(function(column, index) {
    				// position used to make stable sort in moveGroupColumns
    				column.groupingPosition = index;
    			});
    			columns.sort(function(a, b) {
    				var a_group, b_group;
    				if (a.isRowHeader) {
    					a_group = a.headerPriority;
    				} else if ( typeof(a.grouping) === 'undefined' || typeof(a.grouping.priority) === 'undefined' || a.grouping.priority < 0) {
    					a_group = null;
    				} else {
    					a_group = a.grouping.priority;
    				}
    				if (b.isRowHeader) {
    					b_group = b.headerPriority;
    				} else if ( typeof(b.grouping) === 'undefined' || typeof(b.grouping.priority) === 'undefined' || b.grouping.priority < 0) {
    					b_group = null;
    				}	else {
    					b_group = b.grouping.priority;
    				}
    				// groups get sorted to the top
    				if ( a_group !== null && b_group === null) { return -1; }
    				if ( b_group !== null && a_group === null) { return 1; }
    				if ( a_group !== null && b_group !== null) {return a_group - b_group; }
    				
    				return a.groupingPosition - b.groupingPosition;
    			});
    			columns.forEach( function(column) {
    				delete column.groupingPosition;
    			});
    			
    			return columns;
    		}, 400);
    		
    		self.nativeAggregations = function() {
    			return {
    				count: {
    					label: $$i18n['en'].aggregation.count, menuTitle: $$i18n['en'].grouping.count,
    					aggregationFn: function (aggregation, fieldValue, numValue) {
    						if (typeof(aggregation.value) === 'undefined') {
    							aggregation.value = 1;
    						} else {
    							aggregation.value++;
    						}
    					}
    				},
    				sum: {
    					label: $$i18n['en'].aggregation.sum, menuTitle: $$i18n['en'].grouping.sum,
    					aggregationFn: function( aggregation, fieldValue, numValue ) {
    						if (!isNaN(numValue)) {
    							if (typeof(aggregation.value) === 'undefined') {
    								aggregation.value = numValue;
    							} else {
    								aggregation.value += numValue;
    							}
    						}
    					}
    				},
    				min: {
    					label: $$i18n['en'].aggregation.min, menuTitle: $$i18n['en'].grouping.min,
    					aggregationFn: function( aggregation, fieldValue, numValue ) {
    						if (typeof(aggregation.value) === 'undefined') {
    							aggregation.value = fieldValue;
    						} else if (typeof(fieldValue) !== 'undefined' && fieldValue !== null && 
    							(fieldValue < aggregation.value || aggregation.value === null)) {
    								aggregation.value = fieldValue;
    						}
    					}
    				},
    				max: {
    					label: $$i18n['en'].aggregation.max, menuTitle: $$i18n['en'].grouping.max,
    					aggregationFn: function( aggregation, fieldValue, numValue ) {
    						if ( typeof(aggregation.value) === 'undefined' ) {
    							aggregation.value = fieldValue;
    						} else if ( typeof(fieldValue) !== 'undefined' && fieldValue !== null && 
    							(fieldValue > aggregation.value || aggregation.value === null)) {
    								aggregation.value = fieldValue;
    						}
                        }
                      },
                      avg: {
                    	  label: $$i18n['en'].aggregation.avg, menuTitle: $$i18n['en'].grouping.avg,
                    	  aggregationFn: function( aggregation, fieldValue, numValue ) {
                    		  aggregation.count = ( typeof(aggregation.count) === 'undefined' ) ? 1 : aggregation.count + 1;
                    		  if ( isNaN(numValue) ) {
                    			  return;
                    		  }
                    		  if ( typeof(aggregation.value) === 'undefined' || typeof(aggregation.sum) === 'undefined' ) {
                    			  aggregation.value = numValue;
                    			  aggregation.sum = numValue;
                    		  } else {
                    			  aggregation.sum += numValue;
                    			  aggregation.value = Math.ceil((aggregation.sum / aggregation.count) * 100)/100;
                    		  }
                    	  }
                      }
    			};
    		};
    		
    		grid.setupColumnBuilder(function groupingColumnBuilder(colDef, col, gridOptions) {
    			if (colDef.enableColumnGrouping === false) {
    				return;
    			}
    			if ( typeof(col.grouping) === 'undefined' && typeof(colDef.grouping) !== 'undefined') {
    				col.grouping = Object.assign({}, colDef.grouping);
    				if ( typeof(col.grouping.priority) !== 'undefined' && col.grouping.priority > -1 ) {
    					col.treeAggregationFn = self.nativeAggregations()[$$util.constants.aggregation.COUNT].aggregationFn;
    					col.treeAggregationFinalizerFn = self.groupedFinalizerFn;
    				}
    			} else if (typeof(col.grouping) === 'undefined') {
    				col.grouping = {};
    			}
    			if (typeof(col.grouping) !== 'undefined' && typeof(col.grouping.priority) !== 'undefined' && col.grouping.priority >= 0) {
    				col.suppressRemoveSort = true;
    			}
    			
    			var groupColumn = {
    				name: 'ui.grid.grouping.group', title: $$i18n['en'].grouping.group, icon: 'ui-icon-group', entity: '&#xea7b;',
    				shown: function () {
    					return typeof(this.context.col.grouping) === 'undefined' ||
    						typeof(this.context.col.grouping.priority) === 'undefined' ||
    						this.context.col.grouping.priority < 0;
    				},
    				action: function () {
    					this.context.col.grid.api.grouping.groupColumn( this.context.col.field );
    				}
    			};
    			var ungroupColumn = {
    				name: 'ui.grid.grouping.ungroup', title: $$i18n['en'].grouping.ungroup, icon: 'ui-icon-ungroup', entity: '&#xea7c;',
    				shown: function () {
    					return typeof(this.context.col.grouping) !== 'undefined' &&
    						typeof(this.context.col.grouping.priority) !== 'undefined' &&
    						this.context.col.grouping.priority >= 0;
    				},
    				action: function () {
    					this.context.col.grid.api.grouping.ungroupColumn( this.context.col.field );
    				}
    			};
    			
    			if ( col.colDef.groupingShowGroupingMenu !== false ) {
    				if (!$$util.arrayContainsObjectWithProperty(col.groupMenuItems, 'name', 'ui.grid.grouping.group')) {
    					col.groupMenuItems.push(groupColumn);
    				}
    				if (!$$util.arrayContainsObjectWithProperty(col.groupMenuItems, 'name', 'ui.grid.grouping.ungroup')) {
    					col.groupMenuItems.push(ungroupColumn);
    				}
    			}
    			if ( col.colDef.groupingShowAggregationMenu !== false ) {
    				var aggregations = self.nativeAggregations(), treeAggregations = 
    					(gridOptions && gridOptions.treeCustomAggregations)?gridOptions.treeCustomAggregations:{}, 
    					addAggregationMenu = function(type, title) {
    						title = title || $$i18n['en'].grouping[type] || type;
    						var menuItem = {
    							name: 'ui.grid.grouping.aggregate' + type, title: title,
    							shown: function () {
    								return typeof(this.context.col.treeAggregation) === 'undefined' ||
    									typeof(this.context.col.treeAggregation.type) === 'undefined' ||
    									this.context.col.treeAggregation.type !== type;
    							},
    							action: function () {
    								this.context.col.grid.api.grouping.aggregateColumn( this.context.col.field, type);
    							}
    						};
    						if (!$$util.arrayContainsObjectWithProperty(col.groupMenuItems, 'name', 'ui.grid.grouping.aggregate' + type)) {
    							col.groupMenuItems.push(menuItem);
    						}
    					};
    				Object.keys(aggregations).forEach(function(key){
    					addAggregationMenu(key);
    				});
    				Object.keys(treeAggregations).forEach(function(key){
    					addAggregationMenu(key);
    				});
    				if (!$$util.arrayContainsObjectWithProperty(col.groupMenuItems, 'name', 'ui.grid.grouping.aggregateRemove')) {
    					col.groupMenuItems.push({
    						name: 'ui.grid.grouping.aggregateRemove', title: $$i18n['en'].grouping.remove,
    						shown: function () {
    							return typeof(this.context.col.treeAggregationFn) !== 'undefined';
    						},
    						action: function () {
    							this.context.col.grid.api.grouping.aggregateColumn( this.context.col.field, null);
    						}
    					});
    				}
    			}
    			
    			if ( typeof(colDef.customTreeAggregationFn) !== 'undefined' ) {
    				col.treeAggregationFn = colDef.customTreeAggregationFn;
    			}
    			if ( typeof(colDef.treeAggregationType) !== 'undefined' ) {
    				col.treeAggregation = { type: colDef.treeAggregationType };
    				if ( typeof(gridOptions.treeCustomAggregations[colDef.treeAggregationType]) !== 'undefined' ) {
    					col.treeAggregationFn = gridOptions.treeCustomAggregations[colDef.treeAggregationType].aggregationFn;
    					col.treeAggregationFinalizerFn = gridOptions.treeCustomAggregations[colDef.treeAggregationType].finalizerFn;
    					col.treeAggregation.label = gridOptions.treeCustomAggregations[colDef.treeAggregationType].label;
    				} else if ( typeof(self.nativeAggregations()[colDef.treeAggregationType]) !== 'undefined' ) {
    					col.treeAggregationFn = self.nativeAggregations()[colDef.treeAggregationType].aggregationFn;
    					col.treeAggregation.label = self.nativeAggregations()[colDef.treeAggregationType].label;
    				}
    			}
    			if ( typeof(colDef.treeAggregationLabel) !== 'undefined' ) {
    				if (typeof(col.treeAggregation) === 'undefined' ) {
    					col.treeAggregation = {};
    				}
    				col.treeAggregation.label = colDef.treeAggregationLabel;
    			}
    			col.treeAggregationUpdateEntity = colDef.treeAggregationUpdateEntity !== false;
    			if ( typeof(col.customTreeAggregationFinalizerFn) === 'undefined' ) {
    				col.customTreeAggregationFinalizerFn = colDef.customTreeAggregationFinalizerFn;
    			}
    		});
    		
        	$$tree.setupGridTree(grid);
        	
        	grid.api.setupEvent("grouping", "groupingChanged");
        	grid.api.setupEvent("grouping", "aggregationChanged");
    		
    		self.setRowExpandedStates = function( currentNode, expandedStates ) {
    			if ( typeof(expandedStates) === 'undefined' ) {
    				return;
    			}
    			expandedStates.forEach( function( value, key ) {
    				if ( currentNode[key] ) {
    					currentNode[key].row.treeNode.state = value.state;
    					if (value.children && currentNode[key].children) {
    						self.setRowExpandedStates( currentNode[key].children, value.children );
    					}
    				}
    			});
    		};
    		self.getRowExpandedStates = function(treeChildren) {
    			if ( typeof(treeChildren) === 'undefined' ) {
    				return {};
    			}
    			var newChildren = {};
    			treeChildren.forEach( function( value, key ) {
    				newChildren[key] = { state: value.row.treeNode.state };
    				if ( value.children ) {
    					newChildren[key].children = self.getRowExpandedStates( value.children );
    				} else {
    					newChildren[key].children = {};
    				}
    			});
    			return newChildren;
    		};
        	grid.api["grouping"]["getGrouping"] = $$util.createMethodWrapper(grid, function ( expanded ) {
    			var columnSettings = self.getGrouping(grid);
    			columnSettings.grouping.forEach( function( group ) {
    				group.field = group.col.field;
    				delete group.col;
    			});
    			columnSettings.aggregations.forEach( function( aggregation ) {
    				aggregation.field = aggregation.col.field;
    				delete aggregation.col;
    			});
    			columnSettings.aggregations = columnSettings.aggregations.filter( function( aggregation ) {
    				return !aggregation.aggregation.source || aggregation.aggregation.source !== 'grouping';
    			});
    			if ( expanded ) {
    				columnSettings.rowExpandedStates = self.getRowExpandedStates( grid.grouping.groupingHeaderCache );
    			}
    			return columnSettings;
        	});
        	grid.api["grouping"]["groupColumn"] = $$util.createMethodWrapper(grid, function ( colField ) {
        		var column = grid.getColumn(colField);
    			if ( typeof(column.grouping) === 'undefined' ) {
    				column.grouping = {};
    			}
    			// set the group priority to the next number in the hierarchy
    			var existingGrouping = self.getGrouping( grid );
    			column.grouping.priority = existingGrouping.grouping.length;
    			// save sort in order to restore it when column is ungrouped
    			column.previousSort = Object.assign({}, column.sort);
    			// add sort if not present
    			if ( !column.sort ) {
    				column.sort = { direction: $$util.constants.ASC };
    			} else if ( typeof(column.sort.direction) === 'undefined' || column.sort.direction === null ) {
    				column.sort.direction = $$util.constants.ASC;
    			}
    			column.treeAggregation = { type: $$util.constants.aggregation.COUNT, source: 'grouping' };
    			
    			if ( column.colDef && $$util.isFunction(column.colDef.customTreeAggregationFn) ) {
    				column.treeAggregationFn = column.colDef.customTreeAggregationFn;
    			} else {
    				column.treeAggregationFn = self.nativeAggregations()[$$util.constants.aggregation.COUNT].aggregationFn;
    			}
    			column.treeAggregationFinalizerFn = self.groupedFinalizerFn;
    			
    			grid.api.grouping.raise.groupingChanged(column);
    			// Indirectly calls setSortPriorities( grid );
    			grid.api.core.raise.sortChanged(grid, grid.getColumnSorting());
    			grid.queueGridRefresh();
        	});
        	grid.api["grouping"]["ungroupColumn"] = $$util.createMethodWrapper(grid, function ( colField ) {
        		var column = grid.getColumn(colField);
    			if ( typeof(column.grouping) === 'undefined' ) {
    				return;
    			}
    			delete column.grouping.priority;
    			delete column.treeAggregation;
    			delete column.customTreeAggregationFinalizer;
    			
    			if (column.previousSort) {
    				column.sort = column.previousSort;
    				delete column.previousSort;
    			}
    			grid.api.grouping.raise.groupingChanged(column);
    			grid.api.core.raise.sortChanged(grid, grid.getColumnSorting());
    			grid.queueGridRefresh();
        	});
        	grid.api["grouping"]["aggregateColumn"] = $$util.createMethodWrapper(grid, function ( colField, aggregationType, aggregationLabel ) {
        		var column = grid.getColumn(colField);
    			if (typeof(column.grouping) !== 'undefined' && typeof(column.grouping.priority) !== 'undefined' && column.grouping.priority >= 0) {
    				grid.api.grouping.ungroupColumn( column.field );
    			}
    			var aggregationDef = {};
    			if ( typeof(grid.options.treeCustomAggregations[aggregationType]) !== 'undefined' ) {
    				aggregationDef = grid.options.treeCustomAggregations[aggregationType];
    			} else if ( typeof(self.nativeAggregations()[aggregationType]) !== 'undefined' ) {
    				aggregationDef = self.nativeAggregations()[aggregationType];
    			}
    			column.treeAggregation = {
    				type: aggregationType,
    				label: ( typeof aggregationLabel === 'string') ? aggregationLabel :
    					$$i18n['en'].aggregation[aggregationDef.label] || aggregationDef.label
    			};
    			column.treeAggregationFn = aggregationDef.aggregationFn;
    			column.treeAggregationFinalizerFn = aggregationDef.finalizerFn;
    			if (aggregationType === null) column.aggregationType = null;
    			
    			grid.api.grouping.raise.aggregationChanged(column);
    			grid.queueGridRefresh();
        	});
        	grid.api["grouping"]["clearGrouping"] = $$util.createMethodWrapper(grid, function () {
    			var currentGrouping = self.getGrouping(grid);
    			if ( currentGrouping.grouping.length > 0 ) {
    				currentGrouping.grouping.forEach( function( group ) {
    					if (!group.col) {
    						group.col = grid.getColumn(group.field);
    					}
    					grid.api.grouping.ungroupColumn(group.col.field);
    				});
    			}
    			if ( currentGrouping.aggregations.length > 0 ) {
    				currentGrouping.aggregations.forEach( function( aggregation ) {
    					if (!aggregation.col) {
    						aggregation.col = grid.getColumn(aggregation.field);
    					}
    					grid.api.grouping.aggregateColumn(aggregation.col.field, null);
    				});
    			}
        	});
        	grid.api["grouping"]["setGrouping"] = $$util.createMethodWrapper(grid, function (config) {
        		if ( typeof(config) === 'undefined' ) {
        			return;
        		}
        		grid.api.grouping.clearGrouping();
        		if ( config.grouping && config.grouping.length && config.grouping.length > 0 ) {
        			config.grouping.forEach( function( group ) {
        				var col = grid.getColumn(group.field);
        				if ( col ) {
        					grid.api.grouping.groupColumn( grid, col.field );
        				}
        			});
        		}
        		if ( config.aggregations && config.aggregations.length ) {
        			config.aggregations.forEach( function( aggregation ) {
        				var col = grid.getColumn(aggregation.field);
        				if ( col ) {
        					grid.api.grouping.aggregateColumn( grid, col.field, aggregation.aggregation.type );
        				}
        			});
        		}
        		if ( config.rowExpandedStates ) {
        			self.setRowExpandedStates( grid.grouping.groupingHeaderCache, config.rowExpandedStates );
        		}
        	});
        	
    		self.setSortPriorities = function( grid ) {
    			if ( ( typeof(grid) === 'undefined' || typeof(grid.grid) !== 'undefined' ) && typeof(this.grid) !== 'undefined' ) {
    				grid = this.grid;
    			}
    			var groupArray = [], sortArray = [];
    			grid.columns.forEach( function(column, index) {
    				if ( typeof(column.grouping) !== 'undefined' && typeof(column.grouping.priority) !== 'undefined' && column.grouping.priority >= 0) {
    					groupArray.push(column);
    				} else if ( typeof(column.sort) !== 'undefined' && typeof(column.sort.priority) !== 'undefined' && column.sort.priority >= 0) {
    					sortArray.push(column);
    				}
    			});
    			groupArray.sort(function(a, b) { return a.grouping.priority - b.grouping.priority; });
    			groupArray.forEach( function(column, index) {
    				column.grouping.priority = index;
    				column.suppressRemoveSort = true;
    				if ( typeof(column.sort) === 'undefined') {
    					column.sort = {};
    				}
    				column.sort.priority = index;
    			});
    			var i = groupArray.length;
    			sortArray.sort(function(a, b) { return a.sort.priority - b.sort.priority; });
    			sortArray.forEach(function(column) {
    				column.sort.priority = i;
    				column.suppressRemoveSort = column.colDef.suppressRemoveSort;
    				i++;
    			});
    		};
            grid.api.core.on.sortChanged(self.setSortPriorities);
        }
    };
    Grid.prototype.enableColumnGrouping = function (grid) {
    	$$grouping.enableColumnGrouping(grid);
    };
    
    
	/* Java script Grid Data Export API */
    const $$export = {
    	setupGridExport: function (grid) {
            var self=this;
            self.grid = grid;
            self.grid.exporterConstants = {
    		    ALL: 'all', VISIBLE: 'visible', SELECTED: 'selected',
    		    expandCollapseRowHeaderCol: 'expandCollapseCol',
    		    selectionRowHeaderCol: 'rowSelectionCol',
    		};
            self.grid.exporter = {};
            grid.api["exporter"] = {};
            
            self.downloadFileForIE = function (fileName, blob, content) {
                if (navigator.msSaveBlob) { // IE10+
                  return navigator.msSaveOrOpenBlob( blob, fileName);
                }
                if ($$util.isIE()) {
                  var frame = D.createElement('iframe');
                  document.body.appendChild(frame);
                  frame.contentWindow.document.open('text/html', 'replace');
                  frame.contentWindow.document.write( content ? content : blob);
                  frame.contentWindow.document.close();
                  frame.contentWindow.focus();
                  frame.contentWindow.document.execCommand('SaveAs', true, fileName);

                  document.body.removeChild(frame);
                  return true;
                }
            },
            self.downloadPDF = function (fileName, docDefinition) {
                var D = document, a = D.createElement('a'), blob, doc = pdfMake.createPdf(docDefinition);
                doc.getBuffer( function (buffer) {
                  blob = new Blob([buffer]);
                  if (navigator.msSaveBlob || $$util.isIE()) {
                  	return $$export.downloadFileForIE(fileName, blob);
                  }
                });
            },
            self.downloadFile = function (fileName, csvContent, columnSeparator, exporterOlderExcelCompatibility, exporterIsExcelCompatible) {
                var D = document, a = D.createElement('a'), strMimeType = 'application/octet-stream;charset=utf-8', rawFile;
                if (exporterIsExcelCompatible) {
                    csvContent = 'sep=' + columnSeparator + '\r\n' + csvContent;
                }
                if (navigator.msSaveBlob || $$util.isIE()) {
                	return $$export.downloadFileForIE(fileName, new Blob( 
                		[exporterOlderExcelCompatibility ? "\uFEFF" : '', content], { type: strMimeType } ), csvContent);
                }
                if ('download' in a) { // html5 A[download]
                  var blob = new Blob( [exporterOlderExcelCompatibility ? "\uFEFF" : '', csvContent], { type: strMimeType });
                  rawFile = URL.createObjectURL(blob);
                  a.setAttribute('download', fileName);
                } else {
                  rawFile = 'data: ' + strMimeType + ',' + encodeURIComponent(csvContent);
                  a.setAttribute('target', '_blank');
                }
                a.href = rawFile;
                a.setAttribute('style', 'display:none;');
                D.body.appendChild(a);
                setTimeout(function() {
                  if (a.click) {
                    a.click();
                  } else if (document.createEvent) {
                    var eventObj = document.createEvent('MouseEvents');
                    eventObj.initEvent('click', true, true);
                    a.dispatchEvent(eventObj);
                  }
                  D.body.removeChild(a);
                }, 100);
            };
            grid.api["exporter"]["downloadFile"] = function (content) {
            	self.downloadFile (grid.options.exporterExcelFilename, content, grid.options.exporterCsvColumnSeparator,
                        grid.options.exporterOlderExcelCompatibility);
            };
            var getRowsFromNode = function(aNode) {
                var rows = [], nodeKeys = aNode ? Object.keys(aNode) : ['children'];
                if (nodeKeys.length > 1 || nodeKeys[0] != 'children') {
                  rows.push(aNode);
                }
                if (aNode && aNode.children && aNode.children.length > 0) {
                    for (var i = 0; i < aNode.children.length; i++) {
                        rows = rows.concat($$export.getRowsFromNode(aNode.children[i]));
                    }
                }
                return rows;
            };
            self.getDataSorted = function (grid) {
                if (!grid.treeBase || grid.treeBase.numberLevels === 0) {
                  return grid.rows;
                }
                var rows = [];
                for (var i = 0; i< grid.treeBase.tree.length; i++) {
                  var nodeRows = $$export.getRowsFromNode(grid.treeBase.tree[i]);
                  for (var j = 0; j<nodeRows.length; j++) {
                    rows.push(nodeRows[j].row);
                  }
                }
                return rows;
            };
            grid.api["exporter"]["getData"] = function (grid, rowTypes, colTypes, applyCellFilters, type="AV") {
                var data = [], rows, columns;
                switch ( rowTypes ) {
                  case grid.exporterConstants.ALL:
                    rows = $$export.getDataSorted(grid, rowTypes, colTypes, applyCellFilters);
                    break;
                  case grid.exporterConstants.VISIBLE:
                    rows = grid.getVisibleRows();
                    break;
                  case grid.exporterConstants.SELECTED:
                    if ( grid.api.selection ) {
                      rows = grid.api.selection.getSelectedGridRows();
                    } else {
                      $til.logError('selection feature must be enabled to allow selected rows to be exported');
                    }
                    break;
                }
                if ( colTypes === grid.exporterConstants.ALL ) {
                  columns = grid.columns;
                } else {
                  var leftColumns = grid.renderContainers.left ? 
                		grid.renderContainers.left.visibleColumnCache.filter( function( column ) { return column.visible; } ) : [];
                  var bodyColumns = grid.renderContainers.body ? 
                		grid.renderContainers.body.visibleColumnCache.filter( function( column ) { return column.visible; } ) : [];
                  var rightColumns = grid.renderContainers.right ? 
                		grid.renderContainers.right.visibleColumnCache.filter( function( column ) { return column.visible; } ) : [];

                  columns = leftColumns.concat(bodyColumns, rightColumns);
                }
                rows.forEach(function( row ) {
                  if (row.suppressExport !== false) {
                    var extractedRow = [], extractedCols = {};
                    columns.forEach( function( gridCol ) {
                      if ( (gridCol.visible || colTypes === grid.exporterConstants.ALL ) &&
                           gridCol.colDef.suppressExport !== true && gridCol.field !== '$$hashKey' ) {
                        var cellValue = applyCellFilters ? grid.getCellTitleValue( row, gridCol ) : grid.getCellValue( row, gridCol ),
                            extension = grid.options.exporterFieldFormatCallback( grid, row, gridCol, cellValue ),
                            extractedField = { value: cellValue };

                        if (extension) {
                          Object.assign(extractedField, extension);
                        }
                        if ( gridCol.colDef.exporterPdfAlign ) {
                          extractedField.alignment = gridCol.colDef.exporterPdfAlign;
                        }
                        if (type === 'AO') {
                        	extractedCols[gridCol.field] = `${cellValue}`;
                        } else if (type === 'AS') {
                        	extractedRow.push(`${cellValue}`);
                        } else {
                            extractedRow.push(extractedField);
                        }
                      }
                    });
                    data.push( (type === 'AO')? extractedCols : extractedRow);
                  }
                });
                return data;
            };
            self.getTitle = function (grid, col) {
                if (grid.options.exporterHeaderFilter) {
                  return grid.options.exporterHeaderFilterUseField ? grid.options.exporterHeaderFilter(col.field) :
                              grid.options.exporterHeaderFilter(col.title);
                }
                return col.title;
            };
            grid.api["exporter"]["getColumnHeaders"] = function (grid, colTypes) {
              var headers = [], columns;
              if ( colTypes === grid.exporterConstants.ALL ) {
                columns = grid.columns;
              } else {
                var leftColumns = grid.renderContainers.left ? grid.renderContainers.left.visibleColumnCache.filter( 
                		function( column ) { return column.visible; } ) : [],
                  bodyColumns = grid.renderContainers.body ? grid.renderContainers.body.visibleColumnCache.filter( 
                		function( column ) { return column.visible; } ) : [],
                  rightColumns = grid.renderContainers.right ? grid.renderContainers.right.visibleColumnCache.filter( 
                		function( column ) { return column.visible; } ) : [];
                columns = leftColumns.concat(bodyColumns, rightColumns);
              }
              columns.forEach( function( gridCol ) {
                if ( gridCol.colDef.suppressExport !== true  && gridCol.field !== '$$hashKey' ) {
                  var headerEntry = {
                    field: gridCol.field,
                    title: $$export.getTitle(grid, gridCol),
                    width: gridCol.drawnWidth ? gridCol.drawnWidth : gridCol.width,
                    align: gridCol.colDef.align ? gridCol.colDef.align : (gridCol.colDef.type === 'number' ? 'right' : 'left')
                  };
                  headers.push(headerEntry);
                }
              });
              return headers;
            };
            self.getAllDataFromServer = function (grid, rowTypes, colTypes) {
                if ( rowTypes === this.grid.exporterConstants.ALL && 
                		grid.rows.length !== grid.options.paginationTotalItems && grid.options.exporterAllDataFn) {
                  return grid.options.exporterAllDataFn()
                    .then(function(allData) {
                      grid.modifyRows(allData);
                    });
                } else {
                  return new Promise(function(resolve, reject) {
                    resolve();
                  });
                }
            };
            
            grid.api["exporter"]["csvExport"] = $$util.createMethodWrapper(grid, function (rowTypes, colTypes) {
            	var grid = this;
                self.getAllDataFromServer(self.grid, rowTypes, colTypes).then(function() {
                  var columnHeaders = grid.options.showHeader ? self.grid.api.exporter.getColumnHeaders(grid, colTypes) : [];
                  var rowData = self.grid.api.exporter.getData(grid, rowTypes, colTypes), seperator = grid.options.exporterCsvColumnSeparator;
                  
                  var formatRowAsCsv = function (separator) {
                      return function (row) {
                          return row.map(function (field) {
                        	  return (field.value == null) ? '' : (typeof(field.value) === 'number') ? field.value : 
                        		  (typeof(field.value) === 'boolean') ? (field.value ? 'TRUE' : 'FALSE') : 
                        			  (typeof(field.value) === 'string') ? '"' + field.value.replace(/"/g,'""') + '"' : 
                        				  (typeof(field.value) === 'object' && !(field.value instanceof Date)) ? 
                        						  '"' + JSON.stringify(field.value).replace(/"/g,'""') + '"' : 
                        							  JSON.stringify(field.value);
                          }).join(separator);
                        };
                  };
                  var bareHeaders = columnHeaders.map(function(header) { return { value: header.title };});
                  var csvContent = bareHeaders.length > 0 ? (formatRowAsCsv(seperator)(bareHeaders) + '\n') : '';
                  csvContent += rowData.map(formatRowAsCsv(seperator)).join('\n');

                  self.downloadFile(grid.options.exporterCsvFilename, csvContent, grid.options.exporterCsvColumnSeparator, 
                		  grid.options.exporterOlderExcelCompatibility, grid.options.exporterIsExcelCompatible);
                });
            });
            grid.api["exporter"]["excelExport"] = $$util.createMethodWrapper(grid, function (rowTypes, colTypes) {
                self.getAllDataFromServer(self.grid, rowTypes, colTypes).then(function() {
                    var columnHeaders = grid.options.showHeader ? self.grid.api.exporter.getColumnHeaders(grid, colTypes) : [];

                    var workbook = new ExcelBuilder.Workbook();
                    var shtName = grid.options.exporterExcelSheetName ? grid.options.exporterExcelSheetName : 'Sheet1';
                    var sheet = new ExcelBuilder.Worksheet({name: shtName});
                    workbook.addWorksheet(sheet);
                    
                    var docDefinition = { styles: {} };
                    if ( grid.options.exporterExcelCustomFormatter ) {
                      docDefinition = grid.options.exporterExcelCustomFormatter( grid, workbook, docDefinition );
                    }
                    if ( grid.options.exporterExcelHeader ) {
                      if ($$util.isFunction( grid.options.exporterExcelHeader )) {
                        grid.options.exporterExcelHeader(grid, workbook, sheet, docDefinition);
                      } else {
                        var headerText = grid.options.exporterExcelHeader.text;
                        var style = grid.options.exporterExcelHeader.style;
                        sheet.data.push([{value: headerText, metadata: {style: docDefinition.styles[style].id}}]);
                      }
                    }
                    
                    var colWidths = [], startIndex = grid.treeBase ? grid.treeBase.numberLevels : (grid.options.enableRowSelection ? 1 : 0);
                    for (var i = startIndex; i < grid.columns.length; i++) {
                      if (grid.columns[i].field !== self.grid.exporterConstants.expandCollapseRowHeaderCol &&
                    		  grid.columns[i].field !== self.grid.exporterConstants.selectionRowHeaderCol) {
                        colWidths.push({width: Math.round(grid.columns[i].drawnWidth / grid.options.exporterColumnScaleFactor)});
                      }
                    }
                    sheet.setColumns(colWidths);

                    var rowData = self.grid.api.exporter.getData(grid, rowTypes, colTypes, grid.options.exporterFieldApplyFilters);
                    var bareHeaders = columnHeaders.map(function(header) {return { value: header.title };});
                    var sheetData = [], headerData = [];
                    for (var i = 0; i < bareHeaders.length; i++) {
                      var style = (columnHeaders[i].align === 'center') ? 'headerCenter' : 
                          (columnHeaders[i].align === 'right') ? 'headerRight' : 'header'
                      var metadata = (docDefinition.styles && docDefinition.styles[style]) ? {style: docDefinition.styles[style].id} : null;
                      headerData.push({value: bareHeaders[i].value, metadata: metadata});
                    }
                    sheetData.push(headerData);

                    var result = rowData.map(function (row) {
                        var values = [];
                        for (var i = 0; i<row.length; i++) {
                          var field = row[i], value = (field.value == null) ? '' : 
                        	  (typeof(field.value) === 'number' || typeof(field.value) === 'string') ? field.value : 
                        		  (typeof(field.value) === 'boolean') ? (field.value ? 'TRUE' : 'FALSE') : JSON.stringify(field.value);
                          values.push({value: value, metadata: row[i].metadata});
                        }
                        return values;
                    });
                    for (var j = 0; j<result.length; j++) {
                      sheetData.push(result[j]);
                    }
                    sheet.setData(sheet.data.concat(sheetData));

                    ExcelBuilder.Builder.createFile(workbook, {type: 'blob'}).then(function(result) {
                      self.downloadFile (grid.options.exporterExcelFilename, result, grid.options.exporterCsvColumnSeparator,
                        grid.options.exporterOlderExcelCompatibility);
                    });
                });
            });
            grid.api["exporter"]["pdfExport"] = $$util.createMethodWrapper(grid, function (rowTypes, colTypes, isPrint) {
                self.getAllDataFromServer(self.grid, rowTypes, colTypes).then(function() {
                    var columnHeaders = self.grid.api.exporter.getColumnHeaders(grid, colTypes),
                    	rowData = self.grid.api.exporter.getData(grid, rowTypes, colTypes), 
                    	baseGridWidth = 0, extraColumns = 0;
                    columnHeaders.forEach(function(value) {
                      if (typeof(value.width) === 'number') {
                        baseGridWidth += value.width;
                      }
                    });
                    columnHeaders.forEach(function(value) {
                      if (value.width === '*') {
                        extraColumns += 100;
                      }
                      if (typeof(value.width) === 'string' && value.width.match(/(\d)*%/)) {
                        var percent = parseInt(value.width.match(/(\d)*%/)[0]);
                        value.width = baseGridWidth * percent / 100;
                        extraColumns += value.width;
                      }
                    });
                    var gridWidth = baseGridWidth + extraColumns;
                    var headerWidths = columnHeaders.map(function( header ) {
                      return header.width === '*' ? header.width : header.width * grid.options.exporterPdfMaxGridWidth / gridWidth;
                    });
                    var headerColumns = columnHeaders.map( function( header ) {
                      return { text: header.title, style: 'tableHeader' };
                    });
                    var stringData = rowData.map(function( row ) {
                        return row.map(function (field) {
                            var result = (field.value == null) ? '' : (typeof(field.value) === 'number') ? field.value.toString() : 
                            	(typeof(field.value) === 'boolean') ? (field.value ? 'TRUE' : 'FALSE') : (typeof(field.value) === 'string') ? 
                            		field.value.replace(/"/g,'""') : (field.value instanceof Date) ? 
                            			JSON.stringify(field.value).replace(/^"/,'').replace(/"$/,'') : (typeof(field.value) === 'object') ? 
                            				field.value : JSON.stringify(field.value).replace(/^"/,'').replace(/"$/,'');
                            if (field.alignment && typeof(field.alignment) === 'string' ) {
                              result = { text: result, alignment: field.alignment };
                            }
                            return result;
                        });
                    });
                    var allData = [headerColumns].concat(stringData);
                    var docDefinition = {
                      pageOrientation: grid.options.exporterPdfOrientation,
                      pageSize: grid.options.exporterPdfPageSize,
                      content: [{ style: 'tableStyle', table: { headerRows: 1, widths: headerWidths, body: allData }, layout: {
              				fillColor: function (rowIndex, node, colIndex) {
              					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
              				}
              			}
                      }],
                      styles: { tableStyle: grid.options.exporterPdfTableStyle, tableHeader: grid.options.exporterPdfTableHeaderStyle },
                      defaultStyle: grid.options.exporterPdfDefaultStyle
                    };
                    if ( grid.options.exporterPdfLayout ) {
                      docDefinition.layout = grid.options.exporterPdfLayout;
                    }
                    if ( grid.options.exporterPdfHeader ) {
                      docDefinition.header =  function (currentPage, pageCount, pageSize) {
                    	return { text: (currentPage === 1) ? grid.options.exporterPdfHeader : '', style: 'headerStyle' };
                      };
                    }
                    docDefinition.footer = function (currentPage, pageCount) {
                        return { alignment: 'center', margin: [0, 8, 0, 0], //[left, top, right, bottom]
                      	  columns:  [
                                { text: (grid.options.exporterPdfShowDateInFooter) ? new Date().toLocaleString().replace(', ', ' ') : '', 
                                		style: 'footerStyle' },
                                { text: (grid.options.exporterPdfFooter) ? grid.options.exporterPdfFooter : '', style: 'footerStyle' },
                                { text: (grid.options.exporterPdfShowPageNosInFooter) ? "Page " + currentPage.toString() + ' of ' + pageCount : '' }
                            ]
                        };
                    };
                    if ( grid.options.exporterPdfCustomFormatter ) {
                      docDefinition = grid.options.exporterPdfCustomFormatter( docDefinition );
                    } else {
                    	docDefinition = function ( docDefinition ) {
                    		docDefinition.styles.headerStyle = { alignment: 'center', fontSize: 15, bold: true, margin: [0, 8, 0, 0] };
                    		docDefinition.styles.footerStyle = { fontSize: 11, bold: true };
                    		return docDefinition;
                    	}
                    }

                    if (isPrint) {
                    	pdfMake.createPdf(docDefinition).print();
                    } else {
                    	if ($$util.isIE() || navigator.appVersion.indexOf('Edge') !== -1) {
                            self.downloadPDF(grid.options.exporterPdfFilename, docDefinition);
                        } else {
                            pdfMake.createPdf(docDefinition).download(grid.options.exporterPdfFilename);
                        }
                    } 
                });
            });
        }
    };
    Grid.prototype.setupGridExport = function (grid) {
    	$$export.setupGridExport(grid);
    };
    
    
    /* Java script Data Grid Pagination API */
    const $$pagination = {
    	setupPagination: function (grid) {
        	var self=this;
        	self.grid = grid;
        	
        	grid.api.setupEvent("pagination", "paginationChanged");
        	
        	grid.api["pagination"]["getPage"] = $$util.createMethodWrapper(grid, function () {
    			return (self.grid.options.enablePagination || self.grid.options.useExternalPagination) ? 
    					self.grid.options.paginationCurrentPage : null;
    		});
        	grid.api["pagination"]["getFirstRowIndex"] = $$util.createMethodWrapper(grid, function () {
    			if (self.grid.options.useCustomPagination) {
    				return self.grid.options.paginationPageSizes.reduce(function(result, size, index) {
    					return index < self.grid.options.paginationCurrentPage - 1 ? result + size : result;
    				}, 0);
    			}
    			return (self.grid.options.paginationCurrentPage - 1) * self.grid.options.paginationPageSize;
    		});
        	grid.api["pagination"]["getLastRowIndex"] = $$util.createMethodWrapper(grid, function () {
    			if (self.grid.options.useCustomPagination) {
    				return self.grid.api.pagination.getFirstRowIndex() + 
    					self.grid.options.paginationPageSizes[self.grid.options.paginationCurrentPage - 1] - 1;
    			}
    			return Math.min(self.grid.options.paginationCurrentPage * self.grid.options.paginationPageSize, self.grid.options.paginationTotalItems) - 1;
    		});
        	grid.api["pagination"]["getTotalPages"] = $$util.createMethodWrapper(grid, function () {
    			if (!self.grid.options.enablePagination && !self.grid.options.useExternalPagination) {
    				return null;
    			}
    			if (self.grid.options.useCustomPagination) {
    				return self.grid.options.paginationPageSizes.length;
    			}
    			return (self.grid.options.paginationTotalItems === 0) ? 1 : 
    				Math.ceil(self.grid.options.paginationTotalItems / self.grid.options.paginationPageSize);
    		});
        	grid.api["pagination"]["nextPage"] = $$util.createMethodWrapper(grid, function () {
    			if (!self.grid.options.enablePagination && !self.grid.options.useExternalPagination) {
    				return;
    			}
    			if (self.grid.options.paginationTotalItems > 0) {
    				self.grid.options.paginationCurrentPage = Math.min(
    						self.grid.options.paginationCurrentPage + 1,
    						self.grid.api.pagination.getTotalPages()
    				);
    			} else {
    				self.grid.options.paginationCurrentPage++;
    			}
    		});
        	grid.api["pagination"]["previousPage"] = $$util.createMethodWrapper(grid, function () {
    			if (!self.grid.options.enablePagination && !self.grid.options.useExternalPagination) {
    				return;
    			}
    			self.grid.options.paginationCurrentPage = Math.max(self.grid.options.paginationCurrentPage - 1, 1);
    		});
        	grid.api["pagination"]["seek"] = $$util.createMethodWrapper(grid, function (page) {
    			if (!self.grid.options.enablePagination && !self.grid.options.useExternalPagination) {
    				return;
    			}
    			if (!$$util.isNumber(page) || page < 1) {
    				throw 'Invalid page number: ' + page;
    			}
    			self.grid.options.paginationCurrentPage = Math.min(page, self.grid.api.pagination.getTotalPages());
    		});
        	
    		grid.setupRowOrColumnProcessor( $$util.constants.ROW, function processPagination( renderableRows ) {
    			if (!self.grid.options.enablePagination || self.grid.options.useExternalPagination) {
    				return renderableRows;
    			}
    			// client side pagination
    			var pageSize = parseInt(self.grid.options.paginationPageSize, 10);
    			var currentPage = parseInt(self.grid.options.paginationCurrentPage, 10);
    			var visibleRows = renderableRows.filter(function (row) { return row.visible; });
    			self.grid.options.paginationTotalItems = visibleRows.length;
    			
    			var firstRow = self.grid.api.pagination.getFirstRowIndex();
    			var lastRow  = self.grid.api.pagination.getLastRowIndex();
    			if (firstRow > visibleRows.length) {
    				currentPage = self.grid.options.paginationCurrentPage = 1;
    				firstRow = (currentPage - 1) * pageSize;
    			}
    			return visibleRows.slice(firstRow, lastRow + 1);
    		}, 500);
        }
    };
    Grid.prototype.setupPagination = function (grid) {
    	$$pagination.setupPagination(grid);
    };
    
    
	/* Java script Data Grid Expandable Rows API */
    const $$expandable = {
		getExpandedRows: function (grid) {
			return grid.rows.filter(function (row) {
				return row.isExpanded;
			});
		},
		toggleRowExpansion: function (grid, row, e) {
			row.isExpanded = !row.isExpanded;
			if ($$util.isUndefined(row.expandedRowHeight)) {
				row.expandedRowHeight = grid.options.expandableRowHeight;
			}
			if (row.isExpanded) {
				row.height = row.grid.options.rowHeight + row.expandedRowHeight;
				grid.expandable.expandedAll = $$expandable.getExpandedRows(grid).length === grid.rows.length;
				row.isRowExpandRendered = false;
			} else {
				row.height = row.grid.options.rowHeight;
				grid.expandable.expandedAll = false;
			}
		},
		enableExpandableRows: function (grid) {
			if (grid.options.enableExpandableRowHeader !== false ) {
				grid.addRowHeaderColumn({
					field: "rowExpandableCol", title: '', 
					width: grid.options.expandableRowHeaderWidth || 30,
					enableColumnResizing: false,
					enableColumnMenu: false,
					suppressExport: true,
					visible: true
				}, 10);
			}
			grid.api["expandable"] = {};
			grid.api["expandable"]["toggleRowExpansion"] = $$util.createMethodWrapper(grid, function (rowData, e) {
				var row = grid.getRow(rowData);
				if (row !== null) $$expandable.toggleRowExpansion(grid, row, e);
			});
			grid.api["expandable"]["expandAllRows"] = $$util.createMethodWrapper(grid, function () {
				grid.renderContainers.body.visibleRowCache.forEach( function(row) {
					if (!row.isExpanded && !row.disableRowExpandable) {
						$$expandable.toggleRowExpansion(grid, row);
					}
				});
				grid.expandable.expandedAll = true;
				grid.queueGridRefresh();
			});
			grid.api["expandable"]["collapseAllRows"] = $$util.createMethodWrapper(grid, function () {
				grid.renderContainers.body.visibleRowCache.forEach( function(row) {
					if (row.isExpanded) {
						$$expandable.toggleRowExpansion(grid, row);
					}
				});
				grid.expandable.expandedAll = false;
				grid.queueGridRefresh();
			});
			grid.api["expandable"]["toggleAllRows"] = $$util.createMethodWrapper(grid, function () {
				if (grid.expandable.expandedAll) {
					grid.api.expandable.collapseAllRows(grid);
				} else {
					grid.api.expandable.expandAllRows(grid);
				}
			});
			grid.api["expandable"]["expandRow"] = $$util.createMethodWrapper(grid, function (rowData) {
				var row = grid.getRow(rowData);
				if (row !== null && !row.isExpanded) $$expandable.toggleRowExpansion(grid, row);
			});
			grid.api["expandable"]["collapseRow"] = $$util.createMethodWrapper(grid, function (rowData) {
				var row = grid.getRow(rowData);
				if (row !== null && row.isExpanded) $$expandable.toggleRowExpansion(grid, row);
			});
			grid.api["expandable"]["getExpandedRows"] = $$util.createMethodWrapper(grid, function () {
				return $$expandable.getExpandedRows(grid).map(function (row) {
					return row.data;
				});
			});
		}
	}
	Grid.prototype.enableExpandableRows = function (grid) {
    	$$expandable.enableExpandableRows(grid);
	};
    
    
	/* Java script Data Grid Row Cell Edit API */
    const $$edit = {
    	enableRowEdit: function (grid) {
    		grid.addRowHeaderColumn({
    			field: "rowEditCol", title: '', 
    			minWidth: 30,
    			width:  50,
    			enableColumnResizing: false,
    			enableColumnMenu: false,
    			suppressExport: true,
    			allowCellFocus: true,
    			visible: true
    		}, 20);
    		
        	grid.api.setupEvent("edit", "rowDataChanged");
        	grid.api.setupEvent("edit", "rowDeleted");
    		
        	grid.api["edit"]["saveRow"] = $$util.createMethodWrapper(grid, function (row) {
        		grid.api.edit.raise.rowDataChanged(row);
        	});
        	grid.api["edit"]["deleteRow"] = $$util.createMethodWrapper(grid, function (row) {
        		grid.api.edit.raise.rowDeleted(row);
        	});
        }
    }
    Grid.prototype.enableRowEdit = function (grid) {
    	$$edit.enableRowEdit(grid);
    };
    
    
	if (typeof exports === 'object') { //CommonJS
	    module.exports = $$util;
	    module.exports = $$i18n;
	    module.exports = ScrollEvent;
	    module.exports = Grid;
	} else if (typeof define === 'function' && define.amd) { //AMD
	    define([], function () {
	        return $$util;
	    });
	    define([], function () {
	        return $$i18n;
	    });
	    define([], function () {
	        return ScrollEvent;
	    });
	    define([], function () {
	        return Grid;
	    });
	} else if (window) { //Browser
	    window.$$util = $$util;
	    window.$$i18n = $$i18n;
	    window.ScrollEvent = ScrollEvent;
	    window.Grid = Grid;
	}
});


/* Tab & Pane Elements */
const uiTab = {
	name: 'ui-tab',
	props: { title: {type: String}, css: {type: String, default: ''}, iconClass: {type: String}, showTitle: {type: Boolean, default: true} },
	template: `<div id="tabs">
		<div :class="[css, 'tabs']">
			<ul><li v-for="tab in tabs" :class="[{\'active\': current === tab}]">
				<a href="javascript:void(0)" :id="getTabName(tab)" :class="css" @click="changeTab(tab)" 
						:style="[tab.disable ? {'pointer-events': 'none'} : {'pointer-events': 'all'}]">
					<i :class="tab.paneIcon" v-if="tab.paneIcon"></i>
					<span class="label" v-if="showTitle">{{ tab.paneTitle }}</span>
				</a>
			</li></ul>
		</div>
	    <div class="panes"><slot></slot></div>
	</div>`,
	data: function() {
		return {
			tabs: [],
			current: null
		};
	}, methods: {
		getTabName: function(tab) {
			tab["id"] = (tab && tab.paneId)?tab.paneId:
				(tab && tab.paneTitle)?tab.paneTitle.split(' ').join(''):'none';
			return tab["id"];
		},
		addPane: function(pane) {
			this.tabs.push(pane);
			if (pane.active === true) {
				this.current = pane;
			}
		},
		changeTab: function(selected) {
			if (this.current === selected) {
				selected.active = false;
				this.current = null;
			} else {
				this.current = selected;
				this.tabs.forEach(function(tab) {
					tab.active = (tab.paneTitle == selected.paneTitle);
				});
			}
		}
	}
};

const uiPane = {
	name: 'ui-pane',
	props: { paneId: { type: String }, paneTitle: { type: String }, paneIcon: { type: String }, selected: { type: Boolean, default: false}, 
		cache: { type: Boolean, default: false }, disable: { type: Boolean, default: false} },
	template: `<div class="pane">
		<div v-if="cache"><div :class="[{\'active\': active}]" v-show="active"><slot></slot></div></div>
		<div v-else><div :class="[{\'active\': active}]" v-if="active"><slot></slot></div></div>
	</div>`,
	data: function() {
		return {
			active: false
		};
	},
	computed: {
		href() {
			return '#' + this.paneTitle.toLowerCase().replace(/ /g, '-');
		}
	},
	created: function() {
		this.active = this.selected;
	},
	mounted: function() {
		this.$parent.addPane(this);
	}
};


/* Context Menu Elements */
let contextMenuRef = Vue.reactive({
	showContextMenu: false,
	position: {x: 0, y: 0, left: "0px", top: "0px"},
	menuContext: {}
});

const uiContextSubMenu = {
	name: 'ui-context-sub-menu',
	props: {position: {default: () => {return {x: 0, y: 0, top: "0px", left: "0px"}}}, pi: {default: 0}, menuContext: {default: {}}, 
		nestedCount: {default: 1}, menuOptions: {required: true}, divider: {default: false}, arrow: {default: false}, 
		itemWidth: {default: 140}, itemHeight: {default: 36}, fontSize: {default: 14}},
	template: `<ul class="ui-context-sub-menu" :style="getPosition" :class="divider?'ui-context-menu-divider':''">
		<li v-for="(item, ci) in menuOptions" :style="getMenuOptionStyle">
			<div @click.stop="item.callback?item.callback(menuContext):callback(item.label)">
				<i v-if="item.icon" :class="item.icon"></i><span>{{item.label}}</span>
			</div>
			<ui-context-sub-menu v-if="item.children && item.children.length > 0" :pi="pi+ci" :menuContext="menuContext" :nestedCount="nestedCount" 
				:position="{x: position.x, y: position.y, left: position.left, top: position.top}" :menuOptions="item.children" 
				:divider="divider" :arrow="arrow" :itemWidth="itemWidth" :itemHeight="itemHeight" :fontSize="fontSize"></ui-context-sub-menu>
		</li>
	</ul>`,
	data: function () {
		return {
		}
	}, computed: {
		getPosition: function() {
			var self=this;
			let ow = document.body.offsetWidth, oh = document.body.offsetHeight
			let mh =  this.position.y + (this.pi+this.menuOptions.length) * this.itemHeight + parseInt(this.position.top);
			this.position.left = this.position.x + this.itemWidth*this.nestedCount >= ow ? '-100%' : '100%';
			this.position.top =  mh > oh ? -(this.menuOptions.length - 1) * this.itemHeight + 'px' : 0;
			return {left: self.position.left, top: self.position.top}
		},
		getMenuOptionStyle: function() {
			return {width: this.itemWidth + 'px', height: this.itemHeight + 'px', 
				lineHeight: this.itemHeight + 'px', fontSize: this.fontSize + 'px'};
		}
	}, mounted: function() {
		var self=this;
	}, methods: {
		callback: function(item) {
			alert("Option Selected :: "+item);
		}
	}
};

const uiContextMenu = {
	name: 'ui-context-menu',
	props: {menuOptions: {required: true}, divider: {default: false}, arrow: {default: false}, 
		itemWidth: {default: 140}, itemHeight: {default: 36}, fontSize: {default: 14}},
	components: {'ui-context-sub-menu': uiContextSubMenu},
	template: `<div class="ui-context-menu" v-if="showContextMenu" :style="{left: position.left, top: position.top}">
		<ul :class="divider?'ui-context-menu-divider':''">
			<li v-for="(item, mi) in menuOptions" :style="getMenuOptionStyle">
				<div @click.stop="item.callback?item.callback(menuContext):callback(item.label)">
					<i v-if="item.icon" :class="item.icon"></i><span>{{item.label}}</span>
				</div>
				<ui-context-sub-menu v-if="item.children && item.children.length > 0" :pi="mi" :menuContext="menuContext" :nestedCount="getNestedCount" 
					:position="{x: position.x, y: position.y, left: position.left, top: '0px'}" :menuOptions="item.children"
					:divider="divider" :arrow="arrow" :itemWidth="itemWidth" :itemHeight="itemHeight" :fontSize="fontSize"></ui-context-sub-menu>
			</li>
		</ul>
	</div>`,
	data: function () {
		return {
			showContextMenu: false,
			position: {x: 0, y: 0, left: "0px", top: "0px"},
			menuContext : {}
		}
	}, computed: {
		getNestedCount: function() {
			var counter = 1, calculateNestedCount = function(items){
				for (i=0; i < items.length; i++) {
					if (items[i].children && items[i].children.length > 0) {
						++counter;
						calculateNestedCount(items[i].children);
					}
				}
			};
			calculateNestedCount(this.menuOptions);
			return counter;
		},
		getMenuOptionStyle: function() {
			return {width: this.itemWidth + 'px', height: this.itemHeight + 'px', 
				lineHeight: this.itemHeight + 'px', fontSize: this.fontSize + 'px'};
		}
	}, beforeMount: function() {
		var self=this;
		Vue.watch(contextMenuRef, function(n, o) {
			self.position = contextMenuRef.position;
			self.menuContext = contextMenuRef.menuContext;
			self.showContextMenu = contextMenuRef.showContextMenu;
		});
	}, methods: {
		callback: function(item) {
			alert("Option Selected :: "+item);
		}
	}
};

const contextMenu = {
	name: 'context-menu',
	mounted: function (el, binding, vnode) {
		if (binding.value && !document.getElementById("ui-context-menu-container")) {
			var menuOptions = (binding.value['options'])? binding.value['options']: undefined;
			if (menuOptions) {
				var props = {};
				var metaData = (binding.value['metadata'])? binding.value['metadata']: {};
				props.menuOptions = menuOptions;
				if (metaData) {
					props.divider = (metaData['divider'])? metaData['divider'] : false;
					props.arrow = (metaData['arrow'])? metaData['arrow'] : false;
					props.itemWidth = (metaData['itemWidth'])? metaData['itemWidth'] : 140;
					props.itemHeight = (metaData['itemHeight'])? metaData['itemHeight'] : 36;
					props.fontSize = (metaData['fontSize'])? metaData['fontSize'] : 14;
				}
				var menuElm = document.createElement("div"), vNode = Vue.h(uiContextMenu, props);
				if (el && el.__vueParentComponent && el.__vueParentComponent.appContext) {
					vNode.appContext = el.__vueParentComponent.appContext
				}
				menuElm.setAttribute('id', 'ui-context-menu-container');
				document.body.appendChild(menuElm);
				Vue.render(vNode, menuElm);
				
				var menuCloseListener = function(e) { 
					contextMenuRef.showContextMenu = false; 
				};
				document.removeEventListener('click', menuCloseListener, true);
				document.addEventListener('click', menuCloseListener, true);
				
				window.removeEventListener('resize', menuCloseListener, true);
				window.addEventListener('resize', menuCloseListener, true);
			}
		}
		
		if (binding.value && binding.value['options']) {
			var menuOpenListener = function (e, context=binding.value['context']) {
				e.stopPropagation();
				e.preventDefault();
				contextMenuRef.menuContext = context;
				contextMenuRef.position.x = e.pageX + 8;
				contextMenuRef.position.y = e.pageY + 4;
				contextMenuRef.position.left = contextMenuRef.position.x + 'px',
				contextMenuRef.position.top =  contextMenuRef.position.y + 'px'
				contextMenuRef.showContextMenu = true;
			};
			el.removeEventListener('contextmenu', menuOpenListener);
			el.addEventListener('contextmenu', menuOpenListener);
		}
	}
};


/* Data Grid UI Elements */
const uiGridPagination = {
	name: 'ui-grid-pagination',
	props: { grid: {type: Object, required: true} },
	template: `<div role="pagination" class="ui-grid-pagination" v-if="grid.options.enablePaginationControls">
		<div role="recordcount" class="record-count">
			<span class="page-from-to-index" v-if="grid.options.paginationTotalItems > 0">
				{{ 1 + grid.api.pagination.getFirstRowIndex() }} - {{ 1 + grid.api.pagination.getLastRowIndex() }} 
				<span style="padding: 0 5px;">{{paginationOf}}</span>
				<span style="padding-right: 5px;">{{grid.options.paginationTotalItems}}</span>
				<span>{{recordsLabel}}</span>
			</span>
		</div>
		<div class="page-links left" v-if="grid.options.enablePageLinks">
			<ul class="ui-grid-pagination-links">
				<li role="menuitem" v-if="boundaryLinks" :class="['pagination-first', {disabled: noPreviousPage()}]">
					<a href :class="{disabled: noPreviousPage()}" @click="selectPage(1, $event)">{{firstText}}</a></li>
				<li role="menuitem" v-if="directionLinks" :class="['pagination-prev', {disabled: noPreviousPage()}]">
					<a href :class="['ui-icon-arrow-left', {disabled: noPreviousPage()}]" 
						@click="selectPage(grid.options.paginationCurrentPage - 1, $event)"></a></li>
				<li role="menuitem" v-if="pages.length > 0" v-for="(page, index) in pages" :key="page.text" 
					:class="['pagination-page', {active: page.active, disabled: !page.active}]">
					<a href @click="selectPage(page.number, $event)" :disabled="!page.active">{{page.text}}</a></li>
				<li role="menuitem" v-if="directionLinks" :class="['pagination-next', {disabled: noNextPage()}]">
					<a href :class="['ui-icon-arrow-right', {disabled: noNextPage()}]" 
						@click="selectPage(grid.options.paginationCurrentPage + 1, $event)"></a></li>
				<li role="menuitem" v-if="boundaryLinks" :class="['pagination-last', {disabled: noLastPage()}]">
					<a href :class="{disabled: noLastPage()}" @click="selectPage(totalPages, $event)">{{lastText}}</a></li>
			</ul>
		</div>
		<div class="ui-grid-pager-panel left" v-else>
			<div role="pagenavigation" class="ui-grid-pager-container">
				<span v-if="grid.options.paginationPageSizes.length <= 1" class="ui-grid-pager-row-count-label">
					{{grid.options.paginationPageSize}}&nbsp;{{sizesLabel}}
				</span>
				<div class="ui-grid-pager-control">
					<button type="button" class="ui-grid-pager-first" @click="gotoFirstPage()" :disabled="noPreviousPage()">
						<div :class="grid.isRTL() ? 'last-triangle' : 'first-triangle'">
							<div :class="grid.isRTL() ? 'last-bar-rtl' : 'first-bar'"></div>
						</div>
					</button>
					<button type="button" class="ui-grid-pager-previous" @click="gotoPreviousPage()" :disabled="noPreviousPage()">
						<div :class="grid.isRTL() ? 'last-triangle prev-triangle' : 'first-triangle prev-triangle'"></div>
					</button>
					<input type="number" class="ui-grid-pager-control-input" v-model.number="grid.options.paginationCurrentPage" 
						min="1" :max="grid.api.pagination.getTotalPages()" step="1" required>
					<span class="ui-grid-pager-max-pages-number" v-if="grid.api.pagination.getTotalPages() > 0">
						/{{ grid.api.pagination.getTotalPages() }} 
					</span>
					<button type="button" class="ui-grid-pager-next" @click="gotoNextPage()" :disabled="noNextPage()">
						<div :class="grid.isRTL() ? 'first-triangle next-triangle' : 'last-triangle next-triangle'"></div>
					</button>
					<button type="button" class="ui-grid-pager-last" @click="gotoLastPage()" :disabled="noLastPage()">
						<div :class="grid.isRTL() ? 'first-triangle' : 'last-triangle'">
							<div :class="grid.isRTL() ? 'first-bar-rtl' : 'last-bar'"></div>
						</div>
					</button>
				</div>
			</div>
		</div>
		<div role="itemsperpage" class="items-per-page">
			<select v-if="grid.options.paginationPageSizes.length > 1 && !grid.options.useCustomPagination && grid.options.paginationTotalItems > 0" 
				v-model="grid.options.paginationPageSize" class="items-per-page-select" @change="paginationChanged">
               	<option class="items-per-page-option" v-for="option in grid.options.paginationPageSizes" 
               		:key="option['key'] || option" :value="option['key'] || option">{{ option['value'] || option }}</option>
			</select>
			<span class="items-per-page-label">{{sizesLabel}}</span>
		</div>
		<div class="clear"></div>
		</div>`,
	data: function () {
		return {
			dataChangeDereg: function() {return null;},
			currentPageDereg: function() {return null;},
			itemsPerPageDereg: function() {return null;},
			totalItemsDereg: function() {return null;},
			maxSizeDereg: function() {return null;},
			sizesLabel: $$i18n['en'].pagination.sizes, //Items per page
			recordsLabel: $$i18n['en'].pagination.records, //Records
			paginationOf: $$i18n['en'].pagination.of, //of
			boundaryLinks: false,
			boundaryLinkNumbers: true,
			directionLinks: true,
			forceEllipses: false,
			firstText: 'First',
			previousText: 'Previous',
			nextText: 'Next',
			lastText: 'Last',
			maxSize: 3,
			rotate: true,
			pages: []
		}
	}, beforeMount: function() {
		this.grid.setupPagination(this.grid);
	}, mounted: function() {
		var self=this;
		self.grid.options.paginationCurrentPage = self.grid.options.paginationCurrentPage || 1;
		self.dataChangeDereg = self.grid.setupDataChangeCallback(function () {
			if (!self.grid.options.useExternalPagination) {
				self.grid.options.paginationTotalItems = self.grid.rows.length;
			}
		}, [$$util.constants.dataChange.ROW]);
		self.currentPageDereg = self.$watch('grid.options.paginationCurrentPage', function (newValues, oldValues) {
			if (newValues === oldValues || oldValues === undefined) { return; }
			self.paginationChanged();
		});
		if (self.grid.options.enablePageLinks) {
			self.itemsPerPageDereg = self.$watch('grid.options.paginationPageSize', function (newValues, oldValues) {
				if (newValues === oldValues || oldValues === undefined) { return; }
				self.grid.options.paginationPageSize = parseInt(newValues, 10);
				self.totalPages = self.grid.api.pagination.getTotalPages();
				self.updatePage();
			});
			self.totalItemsDereg = self.$watch('grid.options.paginationTotalItems', function (newValues, oldValues) {
				if (newValues === oldValues || oldValues === undefined) { return; }
				self.totalPages = self.grid.api.pagination.getTotalPages();
				self.updatePage();
			});
			self.maxSizeDereg = self.$watch('maxSize', function (newValues, oldValues) {
				if (newValues === oldValues || oldValues === undefined) { return; }
				self.maxSize = parseInt(newValues, 10);
				self.grid.options.paginationCurrentPage = parseInt(self.grid.options.paginationCurrentPage, 10) || 1;
			});
			self.totalPages = self.grid.api.pagination.getTotalPages();
			self.pages = self.getPages(self.grid.options.paginationCurrentPage, self.totalPages);
		}
	}, methods: {
		paginationChanged: function () {
			var self=this;
			if (!$$util.isNumber(self.grid.options.paginationCurrentPage) || self.grid.options.paginationCurrentPage < 1) {
				self.grid.options.paginationCurrentPage = 1;
				return;
			}
			if (self.grid.options.paginationTotalItems > 0 && self.grid.options.paginationCurrentPage > self.grid.api.pagination.getTotalPages()) {
				self.grid.options.paginationCurrentPage = self.grid.api.pagination.getTotalPages();
				return;
			}
			self.grid.api.pagination.raise.paginationChanged(self.grid);
			if (!self.grid.options.useExternalPagination) {
				self.grid.queueGridRefresh();
			}
		},
		noNextPage: function () {
			if (this.grid.api.pagination.getTotalPages()) {
				return this.noLastPage();
			} else {
				return this.grid.options.data.length < 1;
			}
		},
		noLastPage: function () {
			var totalPages = this.grid.api.pagination.getTotalPages();
			return !totalPages || this.grid.options.paginationCurrentPage >= totalPages;
		},
		noPreviousPage: function () {
			return this.grid.options.paginationCurrentPage <= 1;
		},
		gotoFirstPage: function () {
			this.grid.api.pagination.seek(1);
		},
		gotoPreviousPage: function () {
			this.grid.api.pagination.previousPage();
		},
		gotoNextPage: function () {
			this.grid.api.pagination.nextPage();
		},
		gotoLastPage: function () {
			this.grid.api.pagination.seek(this.grid.api.pagination.getTotalPages());
		},
		refreshPages: function() {
			this.pages = new Array();
			if (this.grid.options.paginationCurrentPage > 0 && this.grid.options.paginationCurrentPage <= this.totalPages) {
				this.pages = this.getPages(this.grid.options.paginationCurrentPage, this.totalPages);
			}
			if (this.grid.options.useExternalPagination) {
				this.paginationChanged();
			} else {
				this.grid.queueGridRefresh();
			}
		},
		selectPage: function(page, evt) {
			if (evt) { evt.preventDefault(); }
			if (this.grid.options.paginationCurrentPage !== page && page > 0 && page <= this.totalPages) {
				if (evt && evt.target) {
					evt.target.blur();
				}
			}
			if (page < 1 || page > this.totalPages) return;
			this.grid.options.paginationCurrentPage = parseInt(page, 10) || 1;
			this.refreshPages();
		},
		updatePage: function() {
			if (this.grid.options.paginationCurrentPage > this.totalPages) {
				this.selectPage(this.totalPages);
			} else {
		        this.grid.options.paginationCurrentPage = parseInt(this.grid.options.paginationCurrentPage, 10) || 1;
				this.refreshPages();
			}
		},
		getPages: function (currentPage, totalPages) {
			var pages = [];
			// Default page limits
			var startPage = 1, endPage = totalPages;
			var isMaxSized = $$util.isDefined(this.maxSize) && this.maxSize < totalPages;
			// recompute if maxSize
			if (isMaxSized) {
				if (this.rotate) {
					// Current page is displayed in the middle of the visible ones
					startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
					endPage = startPage + this.maxSize - 1;
					// Adjust if limit is exceeded
					if (endPage > this.totalPages) {
						endPage = this.totalPages;
						startPage = endPage - this.maxSize + 1;
					}
				} else {
					// Visible pages are paginated with maxSize
					startPage = (Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize + 1;
					// Adjust last page if limit is exceeded
					endPage = Math.min(startPage + this.maxSize - 1, totalPages);
				}
			}
			// Add page number links
			for (var number = startPage; number <= endPage; number++) {
				var page = { number: number, text: number+'', active: number === currentPage };
				pages.push(page);
			}
			// Add links to move between page sets
			if (isMaxSized && this.maxSize > 0 && (!this.rotate || this.forceEllipses || this.boundaryLinkNumbers)) {
				if (startPage > 1) {
					if (!this.boundaryLinkNumbers || startPage > 3) { //need ellipsis for all options unless range is too close to beginning
						var previousPageSet = { number: startPage - 1, text: '...', active: false };
						pages.unshift(previousPageSet);
					}
					if (this.boundaryLinkNumbers) {
						if (startPage === 3) { //need to replace ellipsis when the links would be sequential
							var secondPageLink = { number: 2, text: '2', active: false };
							pages.unshift(secondPageLink);
						}
						//add the first page
						var firstPageLink = { number: 1, text: '1', active: false };
						pages.unshift(firstPageLink);
					}
				}
				if (endPage < totalPages) {
					if (!this.boundaryLinkNumbers || endPage < totalPages - 2) { //need ellipsis for all options unless range is too close to end
						var nextPageSet = { number: endPage + 1, text: '...', active: false };
						pages.push(nextPageSet);
					}
					if (this.boundaryLinkNumbers) {
						if (endPage === totalPages - 2) { //need to replace ellipsis when the links would be sequential
							var secondToLastPageLink = { number: totalPages - 1, text: totalPages - 1, active: false };
							pages.push(secondToLastPageLink);
						}
						//add the last page
						var lastPageLink = { number: totalPages, text: totalPages, active: false };
						pages.push(lastPageLink);
					}
				}
			}
			return pages;
		}
	}, beforeUnmount: function() {
		this.dataChangeDereg();
		this.currentPageDereg();
		if (this.grid.options.enablePageLinks) {
			this.itemsPerPageDereg();
			this.totalItemsDereg();
			this.maxSizeDereg();
		}
	}
};


const uiGridColumnMenuItem = {
	name: 'ui-grid-column-menu-item',
	props: { grid: {type: Object, required: true}, name: {type: [String, Function], required: true}, icon: {type: String}, 
		action: {type: Function}, shown: {type: Function}, active: {type: Function}, context: {type: Object}, 
		leaveOpen: {type: Boolean}, screenReaderOnly: {type: Boolean} },
	template: `<button type="button" tabindex="0" v-if="itemShown()" @focus="focus=true" @blur="focus=false" @click="itemAction($event, title)" 
		:class="['ui-grid-menu-item', { 'ui-grid-menu-item-active': itemActive(), 'ui-grid-sr-only': (!focus && screenReaderOnly) }]">
		<i :class="icon">&nbsp;</i> {{ label() }}
	</button>`,
	emits: [ 'hide-column-menu', 'focus', 'blur' ], 
	data: function () {
		return {
			focus: false
		}
	}, methods: {
		getContext: function(ctx) {
            var self=this, context = {grid: self.grid};
            if (ctx) { context.context = ctx; }
            return context;
		},
		itemActive: function() {
			return (this.active)?this.active.call():false;
		},
		itemShown: function() {
            return (typeof this.shown === "undefined" || this.shown === undefined || 
            		this.shown === null) ? false : this.shown.call(this.getContext(this.context));
        },
        itemAction: function(event, title) {
            event.stopPropagation();
            if (typeof this.action === "function") {
    			var context = this.getContext(this.context);
                this.action.call(context, event, title);
                if (!this.leaveOpen) {
                    this.$emit("hide-column-menu");
                }
            }
        },
        label: function() {
            return (typeof this.name === "function") ? this.name.call() : this.name;
        }
	}
};


const uiGridColumnMenu = {
	name: 'ui-grid-column-menu',
	props: { grid: {type: Object, required: true} },
	components: {
		'ui-grid-column-menu-item': uiGridColumnMenuItem
	},
	template: `<div class="ui-grid-column-menu" v-if="showMenu">
		<div class="ui-grid-menu">
			<component is="style">{{menuStyles}}</component>
			<div class="ui-grid-menu-container">
				<div class="ui-grid-menu-items" @hide-column-menu="hideColumnMenu">
					<ul role="menuItems" class="ui-grid-menu-items">
						<li role="menuItem" v-for="item in columnMenuItems">
							<ui-grid-column-menu-item :grid="grid" :action="item.action" :name="item.title" :active="item.active" 
								:icon="item.icon" :shown="item.shown" :context="item.context" :leaveOpen="item.leaveOpen" 
									:screenReaderOnly="item.screenReaderOnly"></ui-grid-column-menu-item>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			showMenu: false, 
			columnMenuItems: [], 
			menuStyles: ""
		}
	}, beforeMount: function() {
		this.grid.columnMenuScope = this;
	}, mounted: function() {
		var self=this;
        var setupMenuHeight = function(gridHeight) {
        	var id = self.grid.id, height = gridHeight - self.grid.headerHeight - 20;
        	self.menuStyles = `.ui-grid-${id} .ui-grid-menu-items {max-height: ${height}px; }`;
        };
        setupMenuHeight(self.grid.gridHeight);
        self.grid.api.core.on.gridDimensionChanged(function(oldGridHeight, oldGridWidth, newGridHeight, newGridWidth) {
        	setupMenuHeight(newGridHeight);
        });
        self.autoHide = (typeof self.autoHide === "undefined" || self.autoHide === undefined)?true:false;
        if (self.autoHide) {
    		window.addEventListener('resize', self.hideColumnMenu);
        }
	}, methods: {
		showColumnMenu: function(column, $columnElement) {
			var self=this;
			self.col = column;
	    	self.columnMenuItems = self.grid.columnMenu.getMenuItems();
	        self.col.menuItems.forEach(function(item) {
	            if (typeof item.context === "undefined" || !item.context) {
	                item.context = {};
	            }
	            item.context.col = self.col;
	        	self.columnMenuItems.push(item);
	        });
	        if (self.showMenu) {
	        	self.hideColumnMenu(undefined, true);
	            setTimeout(function() {
	            	self.showMenu = true;
	            });
	        } else {
		        self.showMenu = true;
	        }
            setTimeout(function() {
                var menuElm = self.$el.querySelectorAll(".ui-grid-menu-container");
                var colElementPosition = self.grid.columnMenu.getColumnElementPosition(column, $columnElement);
                self.grid.columnMenu.repositionMenu(column, colElementPosition, menuElm, self.$el, $columnElement);
            });
            document.removeEventListener("click", self.hideColumnMenu);
            setTimeout(function() {
                document.addEventListener("click", self.hideColumnMenu);
            });
		}, 
		hideColumnMenu: function(e, hts) {
			var self=this;
        	self.showMenu = false;
			if (hts) {
		        setTimeout(function() {
		        	self.showMenu = true;
		        }, 100);
			}
	        document.removeEventListener("click", this.hideColumnMenu);
		}
	}, beforeUnmount: function() {
		window.removeEventListener('resize', this.hideColumnMenu);
        document.removeEventListener("click", this.hideColumnMenu);
	}
};


const uiGridColumnFooter = {
	name: 'ui-grid-column-footer',
	props: { grid: {type: Object, required: true}, colContainer: {type: Object, required: true} },
	template: `<div class="ui-grid-footer-panel ui-grid-footer-aggregates-row">
		<div class="ui-grid-footer ui-grid-footer-viewport">
			<div class="ui-grid-footer-canvas">
				<div class="ui-grid-footer-cell-wrapper" :style="colContainer.headerCellWrapperStyle()">
					<div class="ui-grid-footer-cell-row">
						<div class="ui-grid-cell-contents ui-grid-footer-cell ui-grid-clearfix" 
							:class="[getColClass(col), col.footerCellClass? col.footerCellClass(grid, col) : '']"
							v-for="(col, colIndex) in colContainer.renderedColumns" :col-index="colIndex">
							<div role="footercell" class="ui-grid-footer-cell ui-grid-clearfix">
								{{ col.getAggregationText() + ( col.getAggregationValue() || col.footerCellFilter ) }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			dataChangeDereg: function() {return null;}
		}
	}, mounted: function() {
		this.grid.footerViewport = this.$el.querySelector(".ui-grid-footer-viewport");
		this.$el.classList.add(`ui-grid-${this.grid.id}`);
		this.grid.footer = this.$el;
	}, methods: {
		getColClass: function(col) {
	        col.updateAggregationValue();
	        this.grid.api.core.on.rowsRendered(col.updateAggregationValue);
			return col.getColClass(false);
		}
	}, beforeUnmount: function() {
		this.dataChangeDereg();
	}
};

const uiGridRowCellEdit = {
	name: 'ui-grid-row-cell-edit',
	props: { grid: {type: Object, required: true}, row: {type: Object, required: true}, col: {type: Object, required: true} }, 
	template: `<div class="ui-grid-cell-edit-container">
		<div class="ui-grid-cell-edit-buttons" v-if="col.field == 'rowEditCol'">
			<i v-if="!row.groupHeader && row.rowEdit != true && row.rowDelete != true" 
				class="ui-icon-delete mr5" @click="showMessage(row)"></i>
			<i v-if="!row.groupHeader && row.rowEdit != true && row.rowDelete != true" 
				class="ui-icon-pencil" @click="editRow(row)"></i>
				
			<i v-if="!row.groupHeader && row.rowEdit != true && row.rowDelete" 
				class="ui-icon-cancel ui-icon-cancel-delete mr3" @click="cancelRowDelete(row)"></i>
			<i v-if="!row.groupHeader && row.rowEdit != true && row.rowDelete" 
				class="ui-icon-ok  ui-icon-delete-ok" @click="deleteRow(row)"></i>
			
			<i v-if="!row.groupHeader && row.rowEdit == true && row.rowDelete != true" 
				class="ui-icon-cancel ui-icon-cancel-edit mr3" @click="cancelRowEdit(row)"></i>
			<i v-if="!row.groupHeader && row.rowEdit == true && row.rowDelete != true" 
				class="ui-icon-save" @click="saveRowData(row)"></i>
		</div>
		<div role="celledit" class="ui-grid-cell-edit-element-container" v-else-if="row.rowEdit === true && col.field != 'rowSelectionCol' && 
			col.field != 'expandCollapseCol' && col.field != 'rowExpandableCol' && col.colDef.cellEdit !== false && !isValueCallback()">
			<component v-if="col.colDef.cellEditComponent" :grid="grid" :row="row" :col="col" :is="col.colDef.cellEditComponent"></component>
			<div class="ui-grid-cell-edit-elements" v-else>
				<div class="ui-grid-radio-cell-container" v-if="col.colDef.radioOptions && col.colDef.radioOptions.length > 0">
					<span class="ui-grid-radio-cell" v-for="(option, index) in col.colDef.radioOptions">
						<input :id="createElmID('rwrd', row, index)" type="radio" :value="option" v-model="cellEditModel" />
						<label :for="createElmID('rwrd', row, index)"></label> {{option}}
					</span>
				</div>
				<div class="ui-grid-boolean-cell-container" v-else-if="col.colDef.type && col.colDef.type == 'boolean'">
					<input :id="createElmID('rwcb', row)" class="ui-grid-boolean-cell" type="checkbox" :true-value="col.colDef.trueValue" 
						:false-value="col.colDef.falseValue" v-model="cellEditModel" />
					<label :for="createElmID('rwcb', row)"></label>
				</div>
				<div class="ui-grid-select-cell-container" v-else-if="col.colDef.selectOptions && col.colDef.selectOptions.length > 0">
					<select class="ui-grid-select-cell" v-model="cellEditModel">
						<option v-for="option in col.colDef.selectOptions" :key="option['key'] || option" 
							:value="option['key'] || option">{{option['value'] || option}}</option>
					</select>
				</div>
				<div class="ui-grid-numeric-cell-container" v-else-if="col.colDef.type && col.colDef.type === 'number'">
					<input class="ui-grid-numeric-cell" type="number" v-model.number="cellEditModel" />
				</div>
				<div class="ui-grid-input-cell-container" v-else>
					<input class="ui-grid-input-cell" type="text" v-model.trim="cellEditModel" />
				</div>
			</div>
		</div>
		<div v-else class="ui-grid-cell-contents">
			<span class="ui-grid-cell-content">{{grid.getCellValue(row, col)}}</span>
		</div>
	</div>`,
	data: function () {
		return {
			rowData: null
		}
	}, setup: function (props) {
		if (props.col.colDef.cellEditComponent) {
			props.col.colDef.cellEditComponent['props'] = { grid: {type: Object, required: true}, 
					row: {type: Object, required: true}, col: {type: Object, required: true}};
			props.col.colDef.cellEditComponent = $$util.getRawComponent(props.col.colDef.cellEditComponent);
		}
	}, computed: {
		cellEditModel: {
			set: function(value) {
				if (this.col.objectBinding) {
					var path = 'data.'+this.col.field, keys = path.split('.');
					$$util.setNestedObjectData(this.row, keys, value);
				} else {
					this.row.data[this.col.field] = value;
				}
			},
			get: function() {
				return this.grid.getCellValue(this.row, this.col);
			}
		}
	}, methods: {
		isValueCallback: function() {
			return typeof this.col.colDef.value === "function";
		},
		createElmID: function(label, row, index) {
			return (index) ? `${label}-${row.id}-${index}` : `${label}-${row.id}`;
		},
	    isObject: function(option) {
	    	return $$util.isObject(option);
	    },
	    editRow: function(row) {
		    if (row && row.data && $$util.isObject(row.data)) {
		    	this.rowData = Object.assign({}, row.data);
		    	row.rowEdit = true;
		    }
	    },
	    cancelRowEdit: function(row) {
	    	var self=this;
		    if (row && row.data && $$util.isObject(row.data)) {
		    	row.data = Object.assign({}, self.rowData);
		    	row.rowEdit = false;
		    }
	    },
	    saveRowData: function(row) {
    		this.grid.api.edit.raise.rowDataChanged(row);
	    	row.rowEdit = false;
	    },
	    showMessage: function (row) {
	    	row.rowDelete = true;
	    },
	    cancelRowDelete: function(row) {
	    	row.rowDelete = false;
	    },
	    deleteRow: function (row) {
	    	this.grid.options.data = this.grid.options.data.filter(function(obj) {
	            return obj.id !== row.id;
	        });
    		this.grid.api.edit.raise.rowDeleted(row);
	    	row.rowDelete = false;
	    }
	}
};


const uiGridRowCell = {
	name: 'ui-grid-row-cell',
	props: { grid: {type: Object, required: true}, row: {type: Object, required: true}, col: {type: Object, required: true}, 
		rowIndex: {type: Number, required: true}, colIndex: {type: Number, required: true} },
	components: {'ui-grid-row-cell-edit': uiGridRowCellEdit},
	template: `<div role="rowCellContents" :class="['ui-grid-row-cells', col.cellClass ? col.cellClass(grid, row, col, rowIndex, colIndex) : '']">
		<div class="ui-grid-tree-row-header-buttons" :class="{'ui-grid-tree-header': row.treeLevel > -1 }" v-if="col.field == 'expandCollapseCol'">
			<div class="ui-grid-cell-contents" tabindex="0" @click="treeButtonClick(row, $event)">
				<i :class="treeButtonClass(row)" :style="{'padding-left': grid.options.treeIndent * row.treeLevel + 'px'}"></i>
			</div>
		</div>
		<div class="ui-grid-row-header-cell ui-grid-expandable-buttons-cell" v-if="col.field == 'rowExpandableCol'">
			<div class="ui-grid-cell-contents">
				<i class="clickable" v-if="!(row.groupHeader==true || row.disableRowExpandable)" 
					:class="{ 'ui-icon-plus' : !row.isExpanded, 'ui-icon-minus' : row.isExpanded }" 
					@click="grid.api.expandable.toggleRowExpansion(row.data, $event)"></i>
			</div>
		</div>
		<div class="ui-grid-cell-contents ui-grid-selection-cell" v-if="col.field == 'rowSelectionCol'">
			<div role="selection" class="ui-grid-disable-selection ui-grid-selection-row-header-buttons">
				<input role="checkbox" type="checkbox" :id="row.uid" :name="row.uid" v-model="row.isSelected" 
					:class="{'ui-grid-row-selected': row.isSelected}" @change="selectionChanged(row, $event)" />
				<label :class="{'disabled': !row.enableSelection}" :for="row.uid"></label>
			</div>
		</div>
		<ui-grid-row-cell-edit :grid="grid" :row="row" :col="col" v-if="grid.options.enableRowEdit"></ui-grid-row-cell-edit>
		<div role="cellContents" class="ui-grid-cell-edit" v-if="col.field != 'rowSelectionCol' && col.field != 'expandCollapseCol' && 
			col.field != 'rowEditCol' && col.field != 'rowExpandableCol' && row.rowEdit == true && !grid.options.enableRowEdit">
			<input type="text" class="ui-grid-cell-content" v-model="row.data[col.field]" />
		</div>			
		
		<div role="cellContents" :title="(col.cellTooltip)?col.cellTooltip(row, col):''" 
			v-if="col.field != 'rowSelectionCol' && col.field != 'expandCollapseCol' && col.field != 'rowExpandableCol' && 
				col.field != 'rowEditCol' && row.rowEdit != true" @click="selectCell(row, $event)" 
				:class="['ui-grid-cell-contents', {'ui-grid-clear-cell': col.cellComponent}]">
			<component v-if="col.cellComponent" :grid="grid" :row="row" :col="col" :is="col.cellComponent"></component>
			<span v-else class="ui-grid-cell-content">{{grid.getCellValue(row, col)}}</span>
		</div>			
	</div>`,
	data: function () {
		return {
			dataChangeDereg: function(){ return null },
			rowWatchDereg: function(){ return null }
		}
	}, setup: function (props) {
		if (props.col.cellComponent) {
			props.col.cellComponent['props'] = {grid: {type: Object, required: true}, 
				row: {type: Object, required: true}, col: {type: Object, required: true}};
			props.col.cellComponent = $$util.getRawComponent(props.col.cellComponent);
		}
	}, methods: {
		toggleTreeNodeSelection: function (node, isSelected, evt) {
    		for (var i = 0; i < node.children.length; i++) {
    			var treeNode = node.children[i];
    			treeNode.row.setSelected(isSelected);
    			this.grid.selection.toggleRowSelection(treeNode.row, evt, 
    					this.grid.options.multiSelect, this.grid.options.noUnselect);
    			if (treeNode.children && treeNode.children.length > 0) {
    				this.toggleTreeNodeSelection(treeNode, isSelected, evt);
    			}
    		}
		},
	    selectCell: function (row, evt) {
	    	evt.stopPropagation();
	    	if (this.grid.options.enableRowSelection && this.grid.options.enableFullRowSelection) {
		    	if (evt.ctrlKey || evt.metaKey || this.grid.options.enableSelectRowOnClick) {
		    		row.isSelected = !row.isSelected;
		    		if (!row.isSelected) this.grid.api.selection.raise.rowSelectionChanged(row, evt);
		    		this.grid.selection.toggleRowSelection(row, evt, this.grid.options.multiSelect, this.grid.options.noUnselect);
		    	}
		    	row.setFocused(!row.isFocused) && this.grid.api.selection.raise.rowFocusChanged(row, evt);
	    	}
		},
	    selectionChanged: function (row, evt) {
	    	evt.stopPropagation();
	    	
	    	var self=this;
    		if (!row.isSelected) self.grid.api.selection.raise.rowSelectionChanged(row, evt);
    		self.grid.selection.toggleRowSelection(row, evt, self.grid.options.multiSelect, self.grid.options.noUnselect);
	    	if (row.groupHeader) {
	    		self.toggleTreeNodeSelection(row.treeNode, row.isSelected, evt);
	    	}
	    	self.grid.options.enableFocusRowOnRowHeaderClick && row.setFocused(!row.isFocused) && 
	    		self.grid.api.selection.raise.rowFocusChanged(row, evt);
	    },
	    treeButtonClass: function(row) {
	    	if ( ( this.grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || 
	    			( row.treeNode.children && row.treeNode.children.length > 0 ) ) {
	    		if (row.treeNode.state === 'expanded' ) {
	    			return 'ui-icon-minus';
	    		}
	    		if (row.treeNode.state === 'collapsed' ) {
	    			return 'ui-icon-plus';
	    		}
	    	}
	    },
	    treeButtonClick: function(row, evt) {
	    	evt.stopPropagation();
	    	this.grid.api.treeBase.toggleRowTreeState(row, evt);
	    }
	}, beforeUnmount: function() {
		this.dataChangeDereg();
		this.rowWatchDereg();
	}
};


const uiGridExpandableRow = {
	name: "ui-grid-expandable-row", 
	props: { options: {type: Function, required: true}, row: {type: Object, required: true}, width: {type: String}, height: {type: String} }, 
	template: `<div class="ui-grid-row-expandable-container">
		<component is="style">
		    .ui-grid-{{ grid.id }} .ui-grid-row, .ui-grid-{{ grid.id }} .ui-grid-cell {
		      height: {{ grid.options.rowHeight }}px;
		    }
		    .ui-grid-{{ grid.id }} .ui-grid-row:last-child .ui-grid-cell {
		      border-bottom-width: {{ (((grid.getVisibleRowCount() * grid.options.rowHeight) < grid.getViewportHeight()) && '1') || '0' }}px;
		    }
		    {{ grid.verticalScrollbarStyles }} {{ grid.horizontalScrollbarStyles }} 
		    {{ grid.customStyles }}
		</component>
		<div id="uiGridRowExpandableGrid" class="ui-grid-row-expandable-grid">
			<component :grid="grid" :is="getRenderContainerComponent"></component>
		</div>
	</div>`,
	data: function () {
		return {
			unwatchFns: [],
			colContainer: null,
			grid: null
		}
	}, computed: {
		getRenderContainerComponent: function() {
			return {
				props: { grid: {type: Object, required: true} }, 
				components: {
					'ui-grid-render-container': uiGridRenderContainer
				},
				template: `<div class="ui-grid-contents-wrapper">
					<ui-grid-render-container v-if="grid.showRenderContainer" :grid="grid" containerId="body" rowContainerName="body" 
						colContainerName="body" :isScrollHorizontal="true" :enableHorizontalScrollbar="grid.options.enableHorizontalScrollbar" 
						:isScrollVertical="true" :enableVerticalScrollbar="grid.options.enableVerticalScrollbar"></ui-grid-render-container>
				</div>`, 
			};
		}
	}, beforeMount: function() {
		var self=this;
        this.grid = new Grid({
        	enableColumnMoving: false,
        	enableColumnResizing: false,
        	suppressExport: true,
        	enableColumnMenu: false,
        	columnDefs: [{field: "loading...", enableSorting: false}],
        	data: []
        });
		if (typeof this.options === 'function') {
			this.row.setRowExpandableOptions = function(options) {
				self.row.isRowExpandRendered = true;
                self.grid.options.columnDefs = options.columnDefs;
                self.grid.callDataChangeCallbacks($$util.constants.dataChange.COLUMN);
                self.grid.options.data = options.data;
				self.grid.refreshData(options.data);
			}
			this.options(this.row);
		}
        this.colContainer = this.grid.renderContainers["body"];
        this.grid.setupRowOrColumnProcessor($$util.constants.ROW, function (rows) {
            rows.forEach(function(row) {
                row.evaluateRowVisibility(true);
            });
            return rows;
        }, 50);
        this.grid.setupRowOrColumnProcessor( $$util.constants.COLUMN, function (columns) {
            columns.forEach(function(column) {
                column.visible = $$util.isDefined(column.colDef.visible) ? column.colDef.visible : true;
            });
            return columns;
        }, 50);
        this.grid.setupRowOrColumnProcessor( $$util.constants.ROW, this.grid.searchRows, 100);
        this.grid.setupRowOrColumnProcessor( $$util.constants.ROW, this.grid.sortByColumn, 200);
	}, mounted: function() {
		var self=this;
        self.grid.$el = self.$el.querySelector(".ui-expandable-grid");;
        if (this.width) self.$el.style.width = this.width;
        if (this.height) self.grid.$el.style.height = this.height;
        self.grid.$el.classList.add("ui-grid-" + self.grid.id);
        self.grid.refreshData(self.grid.options.data);
        
        self.gridResize = function () {
            if (!$$util.isVisible(self.grid.$el)) {
                return;
            }
            self.grid.gridWidth = $$util.$$element.elementWidth(self.grid.$el);
            self.grid.gridHeight = $$util.$$element.elementHeight(self.grid.$el);
            self.grid.refreshCanvas(true);
        }
        window.addEventListener('resize', self.gridResize);
        
    	var unwatchStyles = self.$watch(function() {
            return self.grid.styleComputations;
    	}, function () {
            self.grid.refreshCanvas(true);
        });
    	self.unwatchFns.push(unwatchStyles);
    	
        self.grid.renderingComplete();
        
        setTimeout(function() {
        	self.grid.adjustGridHeight();
        }, 100);
	}, methods: {
	}, beforeUnmount: function() {
		window.removeEventListener('resize', this.gridResize);
        this.unwatchFns.forEach(function(unwatchFn) {
        	unwatchFn();
        });
	}
};


const uiGridViewport = {
	name: 'ui-grid-viewport',
	props: { grid: {type: Object, required: true}, containerId: {type: String, required: true}, 
		isScrollHorizontal: {type: Boolean, required: true}, isScrollVertical: {type: Boolean, required: true}, 
		rowContainer: {type: Object, required: true}, colContainer: {type: Object, required: true} },
	components: {
		'ui-grid-row-cell': uiGridRowCell,
		'ui-grid-expandable-row': uiGridExpandableRow
	},
	directives: {'context-menu': contextMenu},
	template: `<div role="rowGroup" class="ui-grid-viewport" :style="colContainer.getViewportStyle()">
		<div class="ui-grid-canvas" v-if="rowContainer.renderedRows && rowContainer.renderedRows.length > 0">
			<div class="ui-grid-row" v-for="(row, rowIndex) in rowContainer.renderedRows" 
				:class="{'ui-grid-row-selected': row && row.isSelected, 'ui-grid-row-focused': row && row.isFocused, 
				'ui-grid-tree-header-row': row && row.treeLevel > -1}" :style="rowStyle">
				<component v-if="grid.options.rowComponent" :grid="grid" :row="row" :rowIndex="rowIndex" :colContainer="colContainer" 
					:getColClass="getColClass" :is="grid.options.rowComponent" v-context-menu="getContextMenuOptions(row)"></component>
				
				<div v-else role="rowCellContainer" :class="['ui-grid-row-cell', col.getColClass(false), 
					{'ui-grid-row-header-cell': col.isRowHeader}]" v-for="(col, colIndex) in colContainer.renderedColumns">
					<ui-grid-row-cell :grid="grid" :row="row" :col="col" :rowIndex="rowIndex" :colIndex="colIndex" 
						v-context-menu="getContextMenuOptions(row)"></ui-grid-row-cell>
				</div>
				
				<div class="ui-grid-expandable-row" v-if="grid.options.enableExpandableRows && isRowExpandable(row)" 
					 :class="{'ui-grid-row-border': row.isRowExpandRendered}" :style="{height: row.expandedRowHeight + 'px' }">
					<ui-grid-expandable-row :options="grid.options.rowExpandableOptions" :row="row" 
						:width="(grid.renderContainers.body.getCanvasWidth()) + 'px'" :height="row.expandedRowHeight + 'px'" 
						v-if="colContainer.name === 'body'">
					</ui-grid-expandable-row>
					<i class="ui-icon-spinner" v-if="colContainer.name !== 'body' && !row.isRowExpandRendered"></i>
				</div> 
				
				<div class="ui-grid-row-overlay" v-if="containerId === 'body' && row.rowDelete"
					 :style="{height: (row.expandedRowHeight ? row.expandedRowHeight + row.$$height + 2 : row.$$height) + 'px' }">
					<span class="ui-grid-row-overlay-label">Would you like to delete this Row?</span>
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			viewport: null
		}
	}, setup: function (props) {
		if (props.grid.options.rowComponent) {
			props.grid.options.rowComponent['props'] = {grid: {type: Object, required: true}, 
					row: {type: Object, required: true}, rowIndex: {type: Number, required: true}, 
					colContainer: {type: Object, required: true}, getColClass: {type: Function, required: true} };
			props.grid.options.rowComponent['components'] = { 'ui-grid-row-cell': $$util.getRawComponent(uiGridRowCell) };
			props.grid.options.rowComponent = $$util.getRawComponent(props.grid.options.rowComponent);
		}
	}, computed: {
        rowStyle: function() {
            var styles = {};
            if (this.rowContainer.currentTopRow !== 0) {
                var translateY = "translateY(" + this.rowContainer.currentTopRow * this.rowContainer.grid.options.rowHeight + "px)";
                styles = {"transform": translateY, "-webkit-transform": translateY, "-ms-transform": translateY};
            }
            if (this.colContainer.currentFirstColumn !== 0) {
            	styles[this.colContainer.grid.isRTL() ? "margin-right" : "margin-left"] = this.colContainer.columnOffset + "px";
            }
            return styles;
        }
	}, mounted: function() {
		var self=this;
		this.grid.viewport = this.$el;
        if (self.grid && self.grid.options && self.grid.options.customScroller) {
            self.grid.options.customScroller(self.$el, self.scrollHandler);
        } else {
        	self.$el.addEventListener("scroll", self.scrollHandler);
        }
        if (self.isScrollVertical) {
            self.grid.addVerticalScrollSync(self.containerId, function (scrollEvent) {
                self.$el.scrollTop = scrollEvent.getNewScrollTop(self.rowContainer, self.grid.viewport);
            });
        }
        if (self.isScrollHorizontal) {
            self.grid.addHorizontalScrollSync(self.containerId, function (scrollEvent) {
                var newScrollLeft = scrollEvent.getNewScrollLeft(self.colContainer, self.grid.viewport);
                self.$el.scrollLeft = self.grid.getScrollLeft(self.grid.viewport, newScrollLeft);
            });
            self.grid.addHorizontalScrollSync(self.containerId + "header", function (scrollEvent) {
                var newScrollLeft = scrollEvent.getNewScrollLeft(self.colContainer, self.grid.viewport);
                if (self.colContainer.headerViewport) {
                	self.colContainer.headerViewport.scrollLeft = self.grid.getScrollLeft(self.grid.viewport, newScrollLeft);
                }
            });
            self.grid.addHorizontalScrollSync(self.containerId + "footer", function (scrollEvent) {
                var newScrollLeft = scrollEvent.getNewScrollLeft(self.colContainer, self.grid.viewport);
                if (self.grid.footerViewport) {
                	self.grid.footerViewport.scrollLeft = self.grid.getScrollLeft(self.grid.viewport, newScrollLeft);
                }
            });
        }
	}, methods: {
		isRowExpandable: function(row) {
			return row.isExpanded; //&& (!this.grid.isScrollingVertically || row.isRowExpandRendered);
		},
		getContextMenuOptions: function(row) {
			var self=this;
			row.rowData = row.rowData || Object.assign({}, row.data);
			return (this.colContainer.name === 'body') ? {'context': row, 'metadata': self.grid.options.contextMenuData.metadata, 
				'options': self.grid.options.contextMenuData.options} : undefined;
		},
		getColClass: function(col) {
			return col.getColClass(false);
	    },
		scrollHandler: function() {
	        var self=this, newScrollTop = self.$el.scrollTop;
	        var newScrollLeft = self.grid.getScrollLeft(self.$el);
	        var vertScrollPercentage = self.rowContainer.scrollVertical(newScrollTop);
	        var horizScrollPercentage = self.colContainer.scrollHorizontal(newScrollLeft);
	        var scrollEvent = new ScrollEvent(self.grid, self.rowContainer, self.colContainer, ScrollEvent.Sources.ViewPortScroll);
	        scrollEvent.newScrollLeft = newScrollLeft;
	        scrollEvent.newScrollTop = newScrollTop;
	        if (horizScrollPercentage > -1) {
	            scrollEvent.x = { percentage: horizScrollPercentage };
	        }
	        if (vertScrollPercentage > -1) {
	            scrollEvent.y = { percentage: vertScrollPercentage };
	        }
	        self.grid.scrollContainers(self.containerId, scrollEvent);
		}
	}, beforeUnmount: function() {
		this.$el.removeEventListener("scroll", this.scrollHandler);
	}
};


const uiGridMoveColumn = {
	name: 'ui-grid-move-column',
	props: { grid: {type: Object, required: true}, col: {type: Object, required: true}, colIndex: {type: Number, required: true} },
	template: `<div role="movingColumnHeaderCell" class="ui-grid-moving-column-header" v-if="isMoving">
		<div role="labelicon" tabindex=0 class="ui-grid-cell-contents" :col-index="colIndex">
			<span :class="['ui-grid-column-header-cell-label', {'ui-grid-column-header-move': grid.options.enableColumnMoving}]">{{col.title}}</span>
		</div>
	</div>`,
	data: function () {
		return {
	        gridLeft: 0, 
	        isMoving: false,  
	        mouseMoved: false, 
	        mouseMovePos: 0, 
	        previousMouseX: 0, 
	        rightMoveLimit: 0, 
	        movingElm: null, 
	        reducedWidth: 0
		}
    }, mounted: function() {
        this.contentsElm = this.$el.parentElement.querySelector(".ui-grid-cell-contents");
    	if (!this.grid.api["colMovable"]["moveColumn"]) {
            this.grid.api["colMovable"]["moveColumn"] = $$util.createMethodWrapper(this.grid, this.moveColumn);
    	}
        this.setupMoveColumnEvents();
	}, methods: {
    	columnPositionChanged: function (colDef, originalPosition, newPosition) {},
    	redrawColumnAtPosition: function (grid, originalPosition, newPosition) {
    		var columns = grid.columns;
    		if (originalPosition === newPosition) {
    			columns[originalPosition].columnElm.style.border = "";
    			return;
    		}
    		// check columns in between mover-range to make sure they are visible columns
    		var pos = (originalPosition < newPosition) ? originalPosition + 1 : originalPosition - 1;
    		var i0 = Math.min(pos, newPosition);
    		for (i0; i0 <= Math.max(pos, newPosition); i0++) {
    			if (columns[i0].visible) {
    				break;
    			}
    		}
    		if (i0 > Math.max(pos, newPosition)) {
    			return; // no visible column found
    		}
    		var originalColumn = columns[originalPosition];
    		//if (grid.options.enableColumnMoving) {
    		if (originalColumn.colDef.enableColumnMoving) {
    			if (originalPosition > newPosition) {
    				for (var i1 = originalPosition; i1 > newPosition; i1--) {
    					columns[i1] = columns[i1 - 1];
    				}
    			} else if (newPosition > originalPosition) {
    				for (var i2 = originalPosition; i2 < newPosition; i2++) {
    					columns[i2] = columns[i2 + 1];
    				}
    			}
    			columns[newPosition] = originalColumn;
    			
    			grid.columnOrderCache = grid.getRowHeaderDataColumns();
    			grid.queueGridRefresh();
            	setTimeout(function() {
    				grid.api.core.notifyDataChange( $$util.constants.dataChange.COLUMN );
    				grid.api.colMovable.raise.columnPositionChanged(originalColumn.colDef, originalPosition, newPosition);
            	});
    		}
    	},
    	getPositionForRenderIndex: function (columns, index) {
			var position = index;
			for (var i = 0; i <= position; i++) {
				if ($$util.isDefined(columns[i]) && (($$util.isDefined(columns[i].colDef.visible) && 
						columns[i].colDef.visible === false) || columns[i].isRowHeader === true)) {
					position++;
				}
			}
			return position;
		},
		moveColumn: function (grid, originalPosition, finalPosition) {
    		var columns = grid.columns;
    		if (!$$util.isNumber(originalPosition) || !$$util.isNumber(finalPosition)) {
    			$$util.logError('moveColumn: Please provide valid values for originalPosition and finalPosition');
    			return;
    		}
    		var nonMovableColumns = 0;
    		for (var i = 0; i < columns.length; i++) {
    			if (($$util.isDefined(columns[i].colDef.visible) && columns[i].colDef.visible === false) || columns[i].isRowHeader === true) {
    				nonMovableColumns++;
    			}
    		}
    		if (originalPosition >= (columns.length - nonMovableColumns) || finalPosition >= (columns.length - nonMovableColumns)) {
    			$$util.logError('moveColumn: Invalid values for originalPosition, finalPosition');
    			return;
    		}
    		this.redrawColumnAtPosition(grid, 
    			this.getPositionForRenderIndex(columns, originalPosition), 
    			this.getPositionForRenderIndex(columns, finalPosition)
    		);
    	},
        moveElement: function (changeValue) {
        	var self=this;
        	// Calculate new position of left of column
        	var currentElmLeft = self.$el.getBoundingClientRect().left - 1, currentElmRight = self.$el.getBoundingClientRect().right;
        	var newElementLeft, totalColumnWidth = 0;
        	
        	// Calculate total column width
        	var columns = self.grid.columns;
        	for (var i = 0; i < columns.length; i++) {
        		if ($$util.isUndefined(columns[i].colDef.visible) || columns[i].colDef.visible === true) {
        			totalColumnWidth += columns[i].drawnWidth || columns[i].width || columns[i].colDef.width;
        		}
        		if (columns[i].columnElm) {
        			var columnElmLeft = columns[i].columnElm.getBoundingClientRect().left,
        				columnElmRight = columns[i].columnElm.getBoundingClientRect().right;
        			columns[i].columnElm.style.border = ( currentElmLeft > columnElmLeft && 
        					currentElmLeft < columnElmRight) ? "1px dashed #9ca3af" : "";
        		}
        	}
        	newElementLeft = currentElmLeft - self.gridLeft + changeValue;
        	newElementLeft = newElementLeft < self.rightMoveLimit ? newElementLeft : self.rightMoveLimit;
        	
        	// Update css of moving column to adjust to new left value or fire scroll in case column has reached edge of grid
        	if ((currentElmLeft >= self.gridLeft || changeValue > 0) && (currentElmRight <= self.rightMoveLimit || changeValue < 0)) {
        		self.$el.style.visibility = 'visible';
        		self.$el.style.left = (self.$el.offsetLeft + (newElementLeft < self.rightMoveLimit ? 
        				changeValue : (self.rightMoveLimit - currentElmLeft))) + 'px';
        	} else if (totalColumnWidth > Math.ceil(self.grid.gridWidth)) {
        		changeValue *= 8;
        		var scrollEvent = new ScrollEvent(self.col.grid, null, null, 'uiGridColumnHeaderCell.moveElement');
        		scrollEvent.x = {pixels: changeValue};
        		scrollEvent.grid.scrollContainers('',scrollEvent);
        	}
        	// Calculate total width of columns on the left of the moving column and the mouse movement
        	var totalColumnsLeftWidth = 0;
        	for (var il = 0; il < columns.length; il++) {
        		if ($$util.isUndefined(columns[il].colDef.visible) || columns[il].colDef.visible === true) {
        			if (columns[il].colDef.field !== self.col.colDef.field) {
        				totalColumnsLeftWidth += columns[il].drawnWidth || columns[il].width || columns[il].colDef.width;
        			} else {
        				break;
        			}
        		}
        	}
        	if (ScrollEvent.newScrollLeft === undefined) {
        		self.mouseMovePos += changeValue;
        	} else {
        		self.mouseMovePos = ScrollEvent.newScrollLeft + newElementLeft - totalColumnsLeftWidth;
        	}
        	// Increase width of moving column, in case the rightmost column was moved and its width was decreased because of overflow
        	if (self.reducedWidth < self.col.drawnWidth) {
        		self.reducedWidth += Math.abs(changeValue);
        		self.$el.style.width = self.reducedWidth + 'px';
        	}
        },
        onMouseDown: function( event ) {
        	var self=this;
        	// Setting some variables required for calculations.
        	self.gridLeft = self.grid.$el.getBoundingClientRect().left;
        	if ( self.grid.hasLeftContainer() ) {
        		self.gridLeft += self.grid.renderContainers.left.header.getBoundingClientRect().width;
        	}
        	self.previousMouseX = event.pageX || (event.originalEvent ? event.originalEvent.pageX : 0);
        	self.mouseMovePos = 0;
        	self.rightMoveLimit = self.gridLeft + self.grid.getViewportWidth();
        	if ( event.type === 'mousedown' ) {
        		document.addEventListener("mousemove", self.onMouseMove);
        		document.addEventListener("mouseup", self.onMouseUp);
        	}
        },
        onMouseMove: function( event ) {
        	var self=this, pageX = event.pageX || (event.originalEvent ? event.originalEvent.pageX : 0);
            var changeValue = pageX - self.previousMouseX;
            if ( changeValue === 0 ) { return; }
            // Disable text selection during column move
            document.onselectstart = function() { return false; };
            self.mouseMoved = true;
            if (!self.isMoving) {
            	//self.cloneElement();
            	self.isMoving = true;
            	setTimeout(function() {
                	self.$el.style.left = self.col.columnElm.offsetLeft + 'px';
                	var gridRight = self.grid.$el.getBoundingClientRect().right;
                	var elmRight = self.col.columnElm.getBoundingClientRect().right;
                	if (elmRight > gridRight) {
                		self.reducedWidth = self.col.drawnWidth + (gridRight - elmRight);
                		self.$el.style.width = self.reducedWidth + 'px';
                	}
            	});
            } else if (self.isMoving) {
            	self.moveElement(changeValue);
            	self.previousMouseX = pageX;
            }
        },
        onMouseUp: function( event ) {
        	var self=this;
        	//Re-enable text selection after column move
        	document.onselectstart = null;
        	//Reset moving element on mouse up.
    		self.isMoving = false;
        	self.col.columnElm.style.border =  "none";
        	self.removeMoveColumnEvents();
        	self.setupMoveColumnEvents();
        	
        	if (!self.mouseMoved) {
        		return;
        	}
        	var columns = self.grid.columns, columnIndex = 0;
            for (var i = 0; i < columns.length; i++) {
            	if (columns[i].colDef.field !== self.col.colDef.field) {
            		columnIndex++;
            	} else {
            		break;
            	}
            }
            var targetIndex;
            
            //Case where column should be moved to a position on its left
            if (self.mouseMovePos < 0) {
            	var totalColumnsLeftWidth = 0, il;
            	if ( self.grid.isRTL() ) {
            		for (il = columnIndex + 1; il < columns.length; il++) {
            			if ($$util.isUndefined(columns[il].colDef.visible) || columns[il].colDef.visible === true) {
            				totalColumnsLeftWidth += columns[il].drawnWidth || columns[il].width || columns[il].colDef.width;
            				if (totalColumnsLeftWidth > Math.abs(self.mouseMovePos)) {
            					self.redrawColumnAtPosition(self.grid, columnIndex, il - 1);
            					break;
            				}
            			}
            		}
            	} else {
            		for (il = columnIndex - 1; il >= 0; il--) {
            			if ($$util.isUndefined(columns[il].colDef.visible) || columns[il].colDef.visible === true) {
            				totalColumnsLeftWidth += columns[il].drawnWidth || columns[il].width || columns[il].colDef.width;
            				if (totalColumnsLeftWidth > Math.abs(self.mouseMovePos)) {
            					self.redrawColumnAtPosition(self.grid, columnIndex, il);
            					break;
            				}
            			}
            		}
            	}
            	// Case where column should be moved to beginning (or end in RTL) of the grid.
            	if (totalColumnsLeftWidth < Math.abs(self.mouseMovePos)) {
            		targetIndex = 0;
            		if ( self.grid.isRTL() ) {
            			targetIndex = columns.length - 1;
            		}
            		self.redrawColumnAtPosition(self.grid, columnIndex, targetIndex);
            	}
            } else if (self.mouseMovePos > 0) { // Case where column should be moved to a position on its right
            	var totalColumnsRightWidth = 0, ir;
            	if ( self.grid.isRTL() ) {
            		for (ir = columnIndex - 1; ir > 0; ir--) {
            			if ($$util.isUndefined(columns[ir].colDef.visible) || columns[ir].colDef.visible === true) {
            				totalColumnsRightWidth += columns[ir].drawnWidth || columns[ir].width || columns[ir].colDef.width;
            				if (totalColumnsRightWidth > self.mouseMovePos) {
            					self.redrawColumnAtPosition(self.grid, columnIndex, ir);
            					break;
            				}
            			}
            		}
            	} else {
            		for (ir = columnIndex + 1; ir < columns.length; ir++) {
            			if ($$util.isUndefined(columns[ir].colDef.visible) || columns[ir].colDef.visible === true) {
            				totalColumnsRightWidth += columns[ir].drawnWidth || columns[ir].width || columns[ir].colDef.width;
            				if (totalColumnsRightWidth > self.mouseMovePos) {
            					self.redrawColumnAtPosition(self.grid, columnIndex, ir - 1);
            					break;
            				}
            			}
            		}
            	}
            	// Case where column should be moved to end (or beginning in RTL) of the grid.
            	if (totalColumnsRightWidth < self.mouseMovePos) {
            		targetIndex = columns.length - 1;
            		if ( self.grid.isRTL() ) {
            			targetIndex = 0;
            		}
            		self.redrawColumnAtPosition(self.grid, columnIndex, targetIndex);
            	}
            }
        },
        setupMoveColumnEvents: function() {
        	this.contentsElm.addEventListener('mousedown', this.onMouseDown);
        },
        removeMoveColumnEvents: function() {
        	this.contentsElm.removeEventListener('mousedown', this.onMouseDown);
        	
        	document.removeEventListener('mousemove', this.onMouseMove);
        	document.removeEventListener('mouseup', this.onMouseUp);
        }
	}, beforeUnmount: function() {
		this.removeMoveColumnEvents();
	}
};


const uiGridResizeColumn = {
	name: 'ui-grid-resize-column',
	props: { grid: {type: Object, required: true}, col: {type: Object, required: true}, position: {type: String, required: true}, 
		colIndex: {type: Number, required: true} },
	template: `<div class="ui-grid-column-resizer" :col-index="colIndex" :position="position" unselectable="on"></div>`,
	data: function () {
		return {
			dataChangeColumnResizeDereg: function() {return null;}, 
			rtlMultiplier: 1,
			gridLeft: 0,
			startX: 0
		}
	}, mounted: function() {
    	if (this.grid.isRTL()) {
    		this.position = 'left';
    		this.rtlMultiplier = -1;
    	}
    	this.$el.classList.add( (this.position === 'left')? 'left' : 'right' );
    	this.dataChangeColumnResizeDereg = this.grid.setupDataChangeCallback( 
    			this.showResizeColumns, [$$util.constants.dataChange.COLUMN] );
    	
    	this.showResizeColumns();
    	this.setupColumnResizeEvents();
	}, methods: {
		columnResized: function (colDef, xDiff) {},
    	findTargetCol: function(col, position, rtlMultiplier) {
            var renderContainer = col.getRenderContainer();
            if (position === 'left') {
              var colIndex = renderContainer.visibleColumnCache.indexOf(col);
              if (colIndex === 0) {
                return renderContainer.visibleColumnCache[0];
              }
              return renderContainer.visibleColumnCache[colIndex - 1 * rtlMultiplier];
            } else {
              return col;
            }
        },
        calculateWidth: function (col, width) {
            var newWidth = width;
            if (col.minWidth && newWidth < col.minWidth) {
              newWidth = col.minWidth;
            }
            else if (col.maxWidth && newWidth > col.maxWidth) {
              newWidth = col.maxWidth;
            }
            return newWidth;
        },
        onMouseDown: function(event, args) {
            if (event.originalEvent) { event = event.originalEvent; }
            event.stopPropagation();
            
            this.gridLeft = this.grid.$el.getBoundingClientRect().left;
            this.startX = (event.targetTouches ? event.targetTouches[0] : event).clientX - this.gridLeft;
    		this.resizerOvrl = document.createElement('div');
    		this.resizerOvrl.classList.add("ui-grid-resize-overlay");
            this.grid.$el.appendChild(this.resizerOvrl);
            this.resizerOvrl.style.left = this.startX;
            document.addEventListener('mouseup', this.onMouseUp);
            document.addEventListener('mousemove', this.onMouseMove);
        },
        onMouseMove: function (event, args) {
            if (event.originalEvent) { event = event.originalEvent; }
            event.preventDefault();

            var x = (event.targetTouches ? event.targetTouches[0] : event).clientX - this.gridLeft;
            if (x < 0) { x = 0; } else if (x > this.grid.gridWidth) { x = this.grid.gridWidth; }
            var col = this.findTargetCol(this.col, this.position, this.rtlMultiplier);
            if (col.colDef.enableColumnResizing === false) {
              return;
            }
            if (!this.grid.$el.classList.contains('column-resizing')) {
              this.grid.$el.classList.add('column-resizing');
            }
            var xDiff = x - this.startX, newWidth = parseInt(col.drawnWidth + xDiff * this.rtlMultiplier, 10);
            x = x + ( this.calculateWidth(col, newWidth) - newWidth ) * this.rtlMultiplier;
            this.resizerOvrl.style.left = x + 'px';
        },
        onMouseUp: function (event) {
            if (event.originalEvent) { event = event.originalEvent; }
            event.preventDefault();
            
            if (this.grid.$el.classList.contains('column-resizing')) {
                this.grid.$el.classList.remove('column-resizing');
            }
    		//this.resizerOvrl.parentNode.removeChild(this.resizerOvrl);
            this.resizerOvrl.remove();
            var x = (event.changedTouches ? event.changedTouches[0] : event).clientX - this.gridLeft;
            var xDiff = x - this.startX;
            if (xDiff === 0) {
              this.removeColumnResizeEvents();
              this.setupColumnResizeEvents();
              return;
            }
            var col = this.findTargetCol(this.col, this.position, this.rtlMultiplier);
            if (col.colDef.enableColumnResizing === false) {
              return;
            }
            var self=this, newWidth = parseInt(col.drawnWidth + xDiff * this.rtlMultiplier, 10);
            col.width = this.calculateWidth(col, newWidth);
            col.hasCustomWidth = true;
            this.grid.refreshCanvas(true).then( function() {
                self.grid.queueGridRefresh();
            });
        	setTimeout(function() {
                if ( self.grid.api.resizeable ) {
                    self.grid.api.resizeable.raise.columnResized(col.colDef, xDiff);
                } else {
                    $$util.logError("The resizeable api has not setup.  Cannot raise any events.");
                }
        	});
            this.removeColumnResizeEvents();
            this.setupColumnResizeEvents();
        },
        showResizeColumns: function() {
            if (this.col.colDef.enableColumnResizing !== false) {
                this.$el.attributes['position'].value = 'right';
                this.$el.classList.add('right');
            }
        },
        setupColumnResizeEvents: function () {
        	this.$el.addEventListener('mousedown', this.onMouseDown);
        },
    	removeColumnResizeEvents: function () {
            document.removeEventListener('mouseup', this.onMouseUp);
            document.removeEventListener('mousemove', this.onMouseMove);
            this.$el.removeEventListener('mousedown', this.onMouseDown);
    	}
	}, beforeUnmount: function() {
		this.dataChangeColumnResizeDereg();
		this.removeColumnResizeEvents();
	}
};


const uiGridColumnHeaderCell = {
	name: 'ui-grid-column-header-cell',
	props: { grid: {type: Object, required: true}, containerId: {type: String, required: true}, colContainer: {type: Object, required: true}, 
		col: {type: Object, required: true}, colIndex: {type: Number, required: true} },
	components: {
		'ui-grid-resize-column': uiGridResizeColumn, 
		'ui-grid-move-column': uiGridMoveColumn
	},
	template: `<div role="headercell" :class="{ 'ui-grid-column-header-cell-last-col': isLastCol }"> 
		<div role="expandcollapse" class="ui-grid-tree-row-header-buttons ui-grid-tree-header"  v-if="grid.options.enableExpandAll">
			<div class="ui-grid-cell-contents" :col-index="colIndex" v-if="col.field == 'expandCollapseCol'"
				@click="treeHeaderButtonClick($event)">
				<div :class="treeHeaderButtonClass()"></div>
			</div>
		</div>
		<div role="expandableRows" class="ui-grid-row-header-cell ui-grid-expandable-buttons-cell" v-if="col.field === 'rowExpandableCol'">
			<div class="ui-grid-cell-contents">
				<span class="ui-grid-cell-empty" v-if="!grid.options.showExpandAllButton"></span> 
				<i class="ui-icon-button clickable" v-if="grid.options.showExpandAllButton" 
					:class="{ 'ui-icon-plus' : !grid.expandable.expandedAll, 'ui-icon-minus' : grid.expandable.expandedAll }" 
					@click="grid.api.expandable.toggleAllRows()">
				</i>
			</div>
		</div>
		<div role="selection" class="ui-grid-selection-row-header-buttons" v-if="grid.options.enableSelectAll">
			<div class="ui-grid-cell-contents ui-grid-selection-cell" :col-index="colIndex" v-if="col.field == 'rowSelectionCol'">
				<div role="checkbox" v-if="showSelectAll">
					<input type="checkbox" id="selectall" name="selectall" v-model="grid.selection.selectAll" 
						:class="{'ui-grid-all-selected': grid.selection.selectAll}" @change="selectionChanged($event)" />
					<label for="selectall"></label>
				</div>
			</div>
		</div>
		<div role="rowEdit" class="ui-grid-action-buttons" v-if="col.field === 'rowEditCol'">
			<div class="ui-grid-cell-contents" :col-index="colIndex">
				<i class="ui-icon-blank"></i>
			</div>
		</div>
		<div role="labelicon" class="ui-grid-cell-contents" :col-index="colIndex" v-if="col.field != 'rowSelectionCol' && 
				col.field != 'expandCollapseCol' && col.field != 'rowEditCol' && col.field != 'rowExpandableCol'">
			<span :class="['ui-grid-column-header-cell-label', col.headerCellClass? col.headerCellClass(grid, col, colIndex) : '', 
				{'ui-grid-column-header-move': grid.options.enableColumnMoving}]" :title="col.headerTooltip ? col.headerTooltip(col) : ''">
				<component v-if="col.headerCellComponent" :grid="grid" :col="col" :is="col.headerCellComponent"></component>
				<span v-else class="ui-grid-cell-content">{{col.title}}</span>
			</span>
			<span class="ui-grid-column-header-cell-icon" v-if="col.colDef.enableSorting" :class="{ 'sortable': sortable }" @click="handleClick($event)">
				<i :class="{ 'ui-icon-arrow-up': col.sort.direction == 'asc', 'ui-icon-arrow-down': col.sort.direction == 'desc', 
					'ui-icon-arrow-up-down': !col.sort.direction }" :title="isSortPriorityVisible() ? headerCell.priority + ' ' + 
						( col.sort.priority + 1 )  : null"></i> 
				<sub :class="{ 'ui-grid-invisible': !isSortPriorityVisible() }" class="ui-grid-sort-priority-number">{{col.sort.priority + 1}}</sub>
			</span>
			<div role="columnMenuButton" class="ui-grid-column-menu-button" @click="toggleColumnMenu($event)" 
				v-if="grid.options.enableColumnMenu && !col.isRowHeader  && col.colDef.enableColumnMenu !== false">
				<i class="ui-icon-blocks">&nbsp;</i>
			</div>
		</div>
		<ui-grid-resize-column v-if="col.colDef.enableColumnResizing" :grid="grid" :col="col" position="right" 
			:col-index="colIndex"></ui-grid-resize-column>
		<ui-grid-move-column v-if="col.colDef.enableColumnMoving" :grid="grid" :col="col" 
			:col-index="colIndex"></ui-grid-move-column>
	</div>`,
	data: function () {
		return {
			headerCell: $$i18n['en'].headerCell, 
			dataChangeDereg: function() {return null;}, 
			classAdded: null,
			isLastCol: false,
			sortable: null
		}
	}, setup: function (props) {
		if (props.col.headerCellComponent) {
			props.col.headerCellComponent['props'] = {grid: {type: Object, required: true}, 
					col: {type: Object, required: true}};
			props.col.headerCellComponent = $$util.getRawComponent(props.col.headerCellComponent);
		}
	}, computed: {
		showSelectAll: function() {
			var renderContainer =  this.grid.renderContainers['body'];
			return (renderContainer) ? renderContainer.renderedRows.length > 0 : false;
		}
	}, mounted: function() {
		var self=this;
        self.renderContainer = self.grid.renderContainers[self.containerId];
        self.contentsElm = self.$el.querySelectorAll(".ui-grid-cell-contents")[0];
        if (self.grid.columnMenuScope) {
            self.grid.columnMenuScope.showMenu = false;
        }
        self.updateHeaderOptions();
        self.dataChangeDereg = this.grid.setupDataChangeCallback(
        		self.updateHeaderOptions, [$$util.constants.dataChange.COLUMN]);
        
		self.col.columnElm = self.$el;
	}, methods: {
        handleClick: function(event) {
            var self=this;
            self.grid.sortColumn(self.col, (event.shiftKey)?true:false).then(function() {
                if (self.grid.columnMenuScope) {
                    self.grid.columnMenuScope.hideColumnMenu();
                }
                if (!self.grid.options.useExternalSorting) {
                	self.grid.refresh();
                }
            }, $$util.noop);
        },
        isSortPriorityVisible: function() {
        	var self=this;
            return this.col && this.col.sort && $$util.isNumber(this.col.sort.priority) && this.grid.columns.some(function(element, index) {
                return $$util.isNumber(element.sort.priority) && element !== self.col;
            });
        },
        toggleColumnMenu: function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (this.grid.columnMenuScope) {
                if (this.grid.columnMenuScope.showMenu) {
                    if (this.grid.columnMenuScope.col === this.col) {
                        this.grid.columnMenuScope.hideColumnMenu();
                    } else {
                        this.grid.columnMenuScope.showColumnMenu(this.col, this.$el);
                    }
                } else {
                    this.grid.columnMenuScope.showColumnMenu(this.col, this.$el);
                }
            }
        },
        updateHeaderOptions: function() {
        	var self=this;
        	setTimeout(function() {
                var rightContainer = self.grid.renderContainers["right"] && self.grid.renderContainers["right"].visibleColumnCache.length ? 
                		self.grid.renderContainers["right"] : self.grid.renderContainers["body"];
                self.isLastCol = self.grid.options && self.col === rightContainer.visibleColumnCache[rightContainer.visibleColumnCache.length - 1];
        	});
            this.sortable = Boolean(this.col.enableSorting);
            this.colMenu = this.col.grid.options && this.col.grid.options.enableColumnMenu !== false && this.col.colDef && 
            	this.col.colDef.enableColumnMenu !== false;
        },
        selectionChanged: function (evt) {
			if (this.grid.selection.selectAll) {
				this.grid.api.selection.selectAllVisibleRows(evt);
			} else if (this.grid.options.multiSelect) {
				this.grid.api.selection.clearSelectedRows(evt);
				if (this.grid.options.noUnselect) {
					this.grid.api.selection.selectRowByVisibleIndex(0, evt);
				}
			}
		},
        treeHeaderButtonClass: function() {
        	if (this.grid.treeBase.numberLevels > 0) {
        		return (this.grid.treeBase.expandAll) ? 'ui-icon-collapse' : 'ui-icon-expand';
        	}
        },
        treeHeaderButtonClick: function(row, evt) {
        	if ( this.grid.treeBase.expandAll ) {
        		this.grid.api.treeBase.collapseAllRows(evt);
        	} else {
        		this.grid.api.treeBase.expandAllRows(evt);
        	}
        }
	}, beforeUnmount: function() {
		this.dataChangeDereg();
	}
};


const uiGridColumnHeader = {
	name: 'ui-grid-column-header',
	props: { grid: {type: Object, required: true}, containerId: {type: String, required: true}, colContainer: {type: Object, required: true} },
	components: {
		'ui-grid-column-header-cell': uiGridColumnHeaderCell
	},
	template: `<div role="rowgroup" class="ui-grid-column-header">
		<div class="ui-grid-column-header-panel">
			<div class="ui-grid-column-header-viewport">
				<div class="ui-grid-column-header-canvas">
					<div class="ui-grid-column-header-cell-wrapper" :style="colContainer.headerCellWrapperStyle()">
						<div role="row" class="ui-grid-column-header-cell-row">
							<component v-if="grid.options.headerComponent" :grid="grid" :containerId="containerId" :colContainer="colContainer" 
								:getColClass="getColClass" :is="grid.options.headerComponent"></component>
							<div role="columnheader" v-else class="ui-grid-column-header-cell ui-grid-clearfix" :class="getColClass(col)" 
								v-for="(col, colIndex) in colContainer.renderedColumns">
								<ui-grid-column-header-cell :grid="grid" :containerId="containerId" :colContainer="colContainer" 
									:col="col" :colIndex="colIndex"></ui-grid-column-header-cell>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			dataChangeDereg: function() {return null;}
		}
	}, setup: function (props) {
		if (props.grid.options.headerComponent) {
			props.grid.options.headerComponent['props'] = {grid: {type: Object, required: true}, containerId: {type: String, required: true}, 
					colContainer: {type: Object, required: true}, getColClass: {type: Function, required: true} };
			props.grid.options.headerComponent['components'] = { 'ui-grid-column-header-cell': $$util.getRawComponent(uiGridColumnHeaderCell) };
			props.grid.options.headerComponent = $$util.getRawComponent(props.grid.options.headerComponent);
		}
	}, mounted: function() {
		var self=this;
        self.updateHeaderReferences();
        self.colContainer.headerViewport = self.$el.querySelectorAll(".ui-grid-column-header-viewport")[0];
        if (self.colContainer.headerViewport) {
        	self.colContainer.headerViewport.addEventListener("scroll", self.scrollHandler);
        }
	}, methods: {
		getColClass: function(col) {
			return col.getColClass(false);
		},
        updateHeaderReferences: function() {
            this.colContainer.header = this.$el;
            var headerCanvases = this.$el.querySelectorAll(".ui-grid-column-header-canvas");
            if (headerCanvases.length > 0) {
                this.headerCanvas = this.colContainer.headerCanvas = headerCanvases[0];
            } else {
                this.headerCanvas = null;
            }
        },
        scrollHandler: function() {
            if (this.grid.isScrollingHorizontally) return;
            var newScrollLeft = this.grid.getScrollLeft(this.colContainer.headerViewport);
            var horizScrollPercentage = this.colContainer.scrollHorizontal(newScrollLeft);
            var scrollEvent = new ScrollEvent(this.grid, null, this.colContainer, ScrollEvent.Sources.ViewPortScroll);
            scrollEvent.newScrollLeft = newScrollLeft;
            if (horizScrollPercentage > -1) {
                scrollEvent.x = { percentage: horizScrollPercentage };
            }
            this.grid.scrollContainers(null, scrollEvent);
        }
	}, beforeUnmount: function() {
		if (this.colContainer.headerViewport) {
			this.colContainer.headerViewport.removeEventListener("scroll", this.scrollHandler);
		}
		this.dataChangeDereg();
	}
};


const uiGridRenderContainer = {
	name: 'ui-grid-render-container',
	props: { grid: {type: Object, required: true}, containerId: {type: String, required: true}, rowContainerName: {type: String, required: true}, 
		colContainerName: {type: String, required: true}, isScrollHorizontal: {type: Boolean, required: true}, 
		isScrollVertical: {type: Boolean, required: true}, enableVerticalScrollbar: {type: Number, required: true}, 
		enableHorizontalScrollbar: {type: Number, required: true} },
	components: {
		'ui-grid-column-header': uiGridColumnHeader,
		'ui-grid-viewport': uiGridViewport,
		'ui-grid-column-footer': uiGridColumnFooter
	},
	template: `<div role="container" class="ui-grid-render-container" :style="{ 'margin-left': leftMargin, 'margin-right': rightMargin }">
		<ui-grid-column-header :grid="grid" :containerId="containerId" :colContainer="colContainer"></ui-grid-column-header>
		<ui-grid-viewport :grid="grid" :rowContainer="rowContainer" :colContainer="colContainer" :containerId="containerId" 
			:isScrollHorizontal="isScrollHorizontal" :isScrollVertical="isScrollVertical"></ui-grid-viewport> 
		<div v-if="colContainer.needsHScrollbarPlaceholder()" class="ui-grid-scrollbar-placeholder" 
			:style="{height: colContainer.grid.scrollbarHeight + 'px'}"></div>
		<ui-grid-column-footer :grid="grid" :colContainer="colContainer" v-if="grid.options.enableColumnFooter"></ui-grid-column-footer>
	</div>`,
	data: function () {
		return {
			container: null,
			rowContainer: null,
			colContainer: null,
			leftMargin: "0px",
			rightMargin: "0px"
		}
	}, beforeMount: function() {
		this.rowContainer = this.grid.renderContainers[this.rowContainerName];
		this.colContainer = this.grid.renderContainers[this.colContainerName];
	}, mounted: function() {
		var self=this;
		self.renderContainer = self.grid.renderContainers[self.containerId];
		self.$el.classList.add('ui-grid-render-container-' + self.containerId);
		setTimeout(function() {
			self.calculateMargins();
		});
		self.grid.setupStyleComputations({
			priority: 15, fn: function () {
				var ret = '', rcId = 'ui-grid-render-container-' + self.containerId;
				var rcCls = '\n .ui-grid-' + self.grid.id + ' .ui-grid-render-container-' + self.containerId;
				var canvasWidth = self.colContainer.getCanvasWidth(), canvasHeight = self.rowContainer.getCanvasHeight();
				var viewportWidth = self.colContainer.getViewportWidth(), viewportHeight = self.rowContainer.getViewportHeight();
				if (self.colContainer.needsHScrollbarPlaceholder()) {
					viewportHeight -= self.grid.scrollbarHeight;
				}
				self.calculateMargins();
				
				var headerViewportWidth, footerViewportWidth;
				headerViewportWidth = footerViewportWidth = self.colContainer.getViewportWidth();
				ret += rcCls + ' .ui-grid-canvas { width: ' + canvasWidth + 'px; height: ' + canvasHeight + 'px; }';
				ret += rcCls + ' .ui-grid-column-header-canvas { width: ' + (canvasWidth + self.grid.scrollbarWidth) + 'px; }';
				ret += rcCls + ' .ui-grid-column-header-canvas { height: ';
				if (self.renderContainer.explicitHeaderCanvasHeight) {
					var rcHcHeight = document.querySelector('.ui-grid-' + self.grid.id + ' .ui-grid-render-container-body .ui-grid-column-header-canvas');
					if (rcHcHeight) {
						self.renderContainer.explicitHeaderCanvasHeight = rcHcHeight.offsetHeight;
					}
					ret += self.renderContainer.explicitHeaderCanvasHeight + 'px; }';
				} else {
					var rcHcHeight = document.querySelector('.ui-grid-' + self.grid.id + ' .'+rcId+' .ui-grid-column-header-canvas');
					ret += (rcHcHeight) ? rcHcHeight.offsetHeight + 'px; }' : ' inherit; }';
				}
				ret += rcCls + ' .ui-grid-viewport { width: ' + viewportWidth + 'px; height: ' + viewportHeight + 'px; }';
				ret += rcCls + ' .ui-grid-column-header-viewport { width: ' + headerViewportWidth + 'px; }';
				ret += rcCls + ' .ui-grid-footer-canvas { width: ' + (canvasWidth + self.grid.scrollbarWidth) + 'px; }';
				ret += rcCls + ' .ui-grid-footer-viewport { width: ' + footerViewportWidth + 'px; }';
				return ret;
			}
		});
	}, methods: {
		calculateMargins: function() {
			this.leftMargin = this.colContainer.getMargin('left') + 'px';
			this.rightMargin = this.colContainer.getMargin('right') + 'px';
		}
	}
};


const uiGridPinnedContainer = {
	name: 'ui-grid-pinned-container',
	props: { grid: {type: Object, required: true}, side: {type: String, required: true, default: "left"} },
	components: {
		'ui-grid-render-container': uiGridRenderContainer
	},
	template: `<div class="ui-grid-pinned-container">
		<ui-grid-render-container :grid="grid" :containerId="side" rowContainerName="body" :colContainerName="side" 
			:class="renderContainerCls" :isScrollHorizontal="false" :enableHorizontalScrollbar="grid.options.enableHorizontalScrollbar"  
			:isScrollVertical="true" :enableVerticalScrollbar="grid.options.enableVerticalScrollbar"></ui-grid-render-container>
	</div>`,
	data: function () {
		return {
			shown: false,
		}
	}, beforeMount: function() {
        this.renderContainerCls = "ui-grid-render-container-" + this.side;
	}, mounted: function() {
        var self=this, myWidth = 0;
        self.renderContainer = self.grid.renderContainers[self.side];
        self.$el.classList.add("ui-grid-pinned-container-" + self.side);
        if (self.side === "left" || self.side === "right") {
            self.grid.renderContainers[self.side].getViewportWidth = self.getViewportWidth;
        }
        self.grid.setupStyleComputations({
            priority: 25, fn: function () {
                var ret = "";
                if (self.side === "left" || self.side === "right") {
                    self.$el.removeAttribute("style");
                    ret += ".ui-grid-" + self.grid.id + " .ui-grid-pinned-container-" + self.side + ", .ui-grid-" + 
                    	self.grid.id + " .ui-grid-pinned-container-" + self.side + " .ui-grid-render-container-" + 
                    	self.side + " .ui-grid-viewport { width: " + self.updateContainerWidth() + "px; } ";
                }
                return ret;
            }
        });
        self.grid.renderContainers.body.setupViewportAdjuster(function(adjustment) {
            myWidth = self.updateContainerWidth();
            adjustment.width -= myWidth;
            adjustment.side = self.side;
            return adjustment;
        });
	}, methods: {
        getViewportWidth: function () {
            var viewportWidth = 0, adjustment = this.renderContainer.getViewportAdjustment();
            this.renderContainer.visibleColumnCache.forEach(function(column) {
                viewportWidth += column.drawnWidth;
            });
            viewportWidth = viewportWidth + adjustment.width;
            return viewportWidth;
        },
        updateContainerWidth: function () {
            if (this.side === "left" || this.side === "right") {
                var cols = this.grid.renderContainers[this.side].visibleColumnCache, width = 0;
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    width += col.drawnWidth || col.width || 0;
                }
                return width;
            }
        } 
	}
};

const uiGridExport = {
	name: 'ui-grid-export',
	props: { grid: {type: Object, required: true} },
	template: `<div role="exportpane" class="ui-grid-export-pane">
		<i class="ui-icon-tools ui-grid-tools-icon">&nbsp;</i>
		<div role="exportcontainer" class="ui-grid-export-container">
			<div class="ui-grid-export-formats">
				<div class="ui-grid-export-label">Export Data (File Formats): </div>
				<div class="ui-grid-export-format" v-for="format in formats">
					<div :role="format.name" v-if="grid.options[format.condition]">
						<input type="radio" :id="format.name" name="format" :value="format.name" 
							v-model="selectedFormat" @change="formatChanged($event)" /><label :for="format.name"></label>
						<i :class="[(format.name === 'print') ? 'ui-icon-'+format.name : 'ui-icon-file-'+format.name, 'ui-grid-export-icon']"></i>
						<span class="ui-grid-export-format-icon-label"> {{format.label}}</span>
					</div>
				</div>
			</div>
			<div class="ui-grid-export-format-options">
				<div class="ui-grid-export-rows">
					<span class="ui-grid-export-label">Rows to Export: </span>
					<select class="ui-grid-select-row-options" v-model="selected">
						<option v-for="option in selectOptions" :key="option['key'] || option" 
							:value="option['key'] || option">{{option['value'] || option}}</option>
					</select>
				</div>
				<div class="ui-grid-export-columns">
					<div class="ui-grid-export-label">Choose Columns for Export: </div>
					<div role="showhidebuttons" class="ui-grid-show-hide-buttons" v-for="(colDef, index) in grid.options.columnDefs">
						<div class="ui-grid-show-hide-button" @click="colDef.suppressExport = !colDef.suppressExport" v-if="colDef.enableColumnHiding">
							<i :class="(colDef.suppressExport === undefined || colDef.suppressExport === false)?'ui-icon-ok':'ui-icon-cancel'">&nbsp;</i>
							<span class="ui-grid-column-name">{{ getColumnName(colDef) }}</span>
						</div>					
					</div>
				</div>
				<div class="ui-grid-export-button-container">
					<button class="ui-grid-export-button" @click="processExport">
						<i class="ui-icon-share"></i><span class="ui-grid-export-button-label">Export Data</span>
					</button>
				</div>
				<div class="ui-grid-export-label mt10">File Format Options: </div>
				<div class="ui-grid-export-format-option" v-for="option in formatOptions[selectedFormat]">
					<div class="ui-grid-export-format-boolean" v-if="option.type === 'checkbox'">
						<input :id="option.key" type="checkbox" class="" :value="option.model" v-model="option.model" />
						<label :for="option.key"></label> {{option.label}}
					</div>
					<span v-else class="ui-grid-export-format-label">{{option.label}} </span>
					<select v-if="option.selectItems && option.selectItems.length > 0" 
							class="ui-grid-export-format-value" v-model="option.model">
						<option v-for="item in option.selectItems" :key="item['key'] || item" 
							:value="item['key'] || item">{{item['value'] || item}}</option>
					</select>
					<input type="text" v-if="option.type === 'text'" class="ui-grid-export-format-value" v-model="option.model" />
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			selectedFormat: (this.grid.options.exportAsExcel) ? "excel" : "pdf",
			formats: [{name: "csv", label: "Csv", condition: "exportAsCsv"}, {name: "excel", label: "Excel", condition: "exportAsExcel"}, 
				{name: "pdf", label: "PDF", condition: "exportAsPdf"}, {name: "print", label: "Print", condition: "exportAsPdf"}],
			formatOptions: {csv: [
				{label: "File Name: ", key: 'exporterCsvFilename', model: this.grid.options.exporterCsvFilename, type: "text"},
				{label: "Delimiter: ", key: 'exporterCsvColumnSeparator', model: this.grid.options.exporterCsvColumnSeparator,
					selectItems: [{key: ',', value: "Comma (,)"},{key: '|', value: "Vertical bar (|)"},
						{key: ';', value: "Semicolon (;)"},{key: ':', value: "Colon (:)"},{key: '\t', value: "Tab"}]}
			], excel: [
				{label: "File Name: ", key: 'exporterExcelFilename', model: this.grid.options.exporterExcelFilename, type: "text"},
				{label: "Sheet Name: ", key: 'exporterExcelSheetName', model: this.grid.options.exporterExcelSheetName, type: "text"}
			], pdf: [
				{label: "File Name: ", key: 'exporterPdfFilename', model: this.grid.options.exporterPdfFilename, type: "text"},
			], print: [
				{label: "Orientation: ", key: 'exporterPdfOrientation', model: this.grid.options.exporterPdfOrientation, 
					selectItems: [{key: 'portrait', value: "Portrait"},{key: 'landscape', value: "Landscape"}]},
				{label: "Page Size: ", key: 'exporterPdfPageSize', model: this.grid.options.exporterPdfPageSize, 
					selectItems: ['LETTER', 'LEGAL', 'EXECUTIVE', 'FOLIO', 'A4', 'A3', 'A2', 'A1']}, 
				{label: "Header Text: ", key: 'exporterPdfHeader', model: this.grid.options.exporterPdfHeader, type: "text"},
				{label: "Footer Text: ", key: 'exporterPdfFooter', model: this.grid.options.exporterPdfFooter, type: "text"}
			]},
			selectOptions: [{key: 'all', value: "All"},{key: 'visible', value: "Visible"}], 
			selected: "all"
		}
	}, beforeMount: function() {
		if (this.grid.options.enableRowSelection) {
			this.selectOptions.push({key: 'selected', value: "Selected"});
		}
		this.formatOptions.pdf.push(...this.formatOptions.print);
	}, methods: {
		getColumnName: function(col) {
			return col.title || $$util.getCamelCaseField(col.field) || col.field
		},
		formatChanged: function(e) {
			this.selectedFormat = e.target.value;
		},
		selectionChanged: function(e) {
			this.selected = e.target.value;
		},
		processExport: function() {
			var self=this, rowCode = (this.selected === 'visible') ? this.grid.exporterConstants.VISIBLE : (this.selected === 'selected') ? 
					this.grid.exporterConstants.SELECTED : this.grid.exporterConstants.ALL;
			var colCode = (this.selected === 'visible' || this.selected === 'selected') ? this.grid.exporterConstants.VISIBLE : 
				this.grid.exporterConstants.ALL;
			this.formatOptions[this.selectedFormat].forEach(function(obj) {
				self.grid.options[obj.key] = obj.model;
			});
			if (this.selectedFormat === 'csv' ) {
				this.grid.api.exporter.csvExport( rowCode, colCode );
			} else if (this.selectedFormat === 'excel') {
				this.grid.api.exporter.excelExport( rowCode, colCode );
			} else if (this.selectedFormat === 'pdf') {
				this.grid.api.exporter.pdfExport( rowCode, colCode, false );
			} else {
				this.grid.api.exporter.pdfExport( rowCode, colCode, true );
			}
		},
	}
};


const uiGridColumnGrouping = {
	name: 'ui-grid-column-grouping',
	props: { grid: {type: Object, required: true}, colContainer: {type: Object, required: true} },
	template: `<div role="grouingcontainer" class="ui-grid-grouping-container">
		<i class="ui-icon-tree ui-grid-grouping-icon">&nbsp;</i>
		<select class="ui-grid-grouping-select" size="5" v-model="selected" @change="selectionChanged">
			<option v-for="col in columns" :key="col.field" :value="col.field">{{col.title}}</option>
		</select>
		<div class="ui-grid-grouping-panel">
			<div class="ui-grid-grouping-actions">
				<span class="ui-grid-grouping-label">Grouping actions for Selected Column: </span>
				<div role="groupingitems" v-for="(col, colIndex) in columns">
					<ul class="ui-grid-grouping-items" v-if="col.field == selected">
						<li class="ui-grid-grouping-item" v-for="item in getGroupMenuItems(col)">
							<div class="ui-grid-grouping-box" @click="performAction(col, item.action, $event)">
								<i class="" :class="item.icon" v-if="item.icon">&nbsp;</i>
								<span class="ui-grid-column-name">{{ label(item.title) }}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="ui-grid-grouping-status">
				<span class="ui-grid-grouping-label">Current Grouping Status: </span>
				<div role="groupingbuttons" v-for="(col, colIndex) in statusColumns">
					<div class="ui-grid-grouping-buttons">
						<div class="ui-grid-grouping-button" @click="ungroup(col, $event)" 
							v-if="col.grouping && col.grouping.priority > -1">
								<span class="ui-grid-column-name">
									<span class="tiny">Group By: </span>{{ col.title }}
								</span>
								<i class="ui-icon-cancel smaller">&nbsp;</i>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			columns: [],
			selected: ""
		}
	}, beforeMount: function() {
		this.columns = this.grid.columns.filter(function (col) {
			return col.title && col.title !== '';
		});
		var i = 1;
		this.statusColumns = this.columns.slice(0).sort(function (c1, c2) {
			c1.grouping.priority = (c1.grouping.priority !== undefined) ? c1.grouping.priority : 0-i++;
			c2.grouping.priority = (c2.grouping.priority !== undefined) ? c2.grouping.priority : 0-i++;
			return (c1.grouping.priority > c2.grouping.priority) ? 1 : -1;
		});
		this.selected = (this.grid.options.autoSelect.field)? this.grid.options.autoSelect.field: this.columns[0].field;
	}, methods: {
		selectionChanged: function() {},
		getColumnName: function(col) {
			return col.title || $$util.getCamelCaseField(col.field) || col.field
		},
		getGroupMenuItems: function(col) {
			var self=this;
			return col.groupMenuItems.filter(function (item) {
				var context = self.getContext(col);
	            return (typeof item.shown === "undefined" || item.shown === undefined || 
	            		item.shown === null)?false:item.shown.call(context);
			});
		},
		getContext: function(col) {
            var ctx = { context: {} };
            if (col) ctx.context['col'] = col;
            ctx.context['grid'] = this.grid;
            return ctx;
		},
		isActive: function(active) {
			return (active)?active.call():false;
		},
        performAction: function(col, action, event) {
            event.stopPropagation();
            if (typeof action === "function") {
    			var context = this.getContext(col);
                action.call(context, event);
            }
            this.selected = col.field;
        },
        ungroup: function(col, event) {
        	this.grid.api.grouping.ungroupColumn( col.field );
        },
        label: function(name) {
            return (typeof name === "function") ? name.call() : name;
        }
	}
};


const uiGridColumnFilter = {
	name: "ui-grid-column-filter",
	props: { grid: {type: Object, required: true}, colContainer: {type: Object, required: true} },
	template: `<div role="filtercontainer" class="ui-grid-filter-container">
		<i class="ui-icon-filter ui-grid-filter-icon">&nbsp;</i>
		<select class="ui-grid-filter-select" size="5" v-model="selected" @change="selectionChanged">
			<template v-for="col in colContainer.renderedColumns">
				<option :key="col.field" :value="col.field" v-if="col.colDef.enableFiltering">{{col.title}}</option>
			</template>
		</select>
		<div role="columnfilter" class="ui-grid-column-filter">
			<div role="columns" v-for="(col, colIndex) in colContainer.renderedColumns">
				<select class="ui-grid-filter-conditions" v-model="condition" v-if="col.field == selected && showFilterConditions">
					<option v-for="cnd in conditions[col.colDef.type]" :key="cnd.key" :value="cnd.key">{{cnd.value}} [{{cnd.key}}]</option>
				</select>
				<div v-for="(filter, index) in col.filters" v-if="col.field == selected"
					:class="{'ui-grid-filter-cancel-button-hidden': filter.disableCancelFilterButton === true }">
					<div v-if="filter.type === 'select'">
						<select class="ui-grid-filter-input-select ui-grid-filter-input-{{index}}" v-model="filter.value" 
							v-if="filter.selectOptions.length > 0" @change="processFilter(col)">
							<option v-for="option in filter.selectOptions" :value="option.value">{{option.label}}</option>
						</select>
					</div>
					<div v-else>
						<i class="ui-icon-case-sensitive ui-grid-cs-icon" v-if="filter.condition == condition"
							:class="filter.flags && filter.flags.caseSensitive == true ? 'strict': ''" 
							@click="resetCaseSearch(col, filter)"></i>
						<i class="ui-icon-search ui-grid-search-icon" v-if="filter.condition == condition"></i>
						<input type="text" class="ui-grid-filter-input ui-grid-filter-input-{{index}}" 
							v-if="filter.condition == condition" v-model="filter.value" @input="processFilter(col)" 
							:placeholder="filter.placeholder || ''" />
						<div role="button" class="ui-grid-clear-filter-input" @click="clearFilter(col, filter)" 
							v-if="!filter.disableCancelFilterButton && filter.value !== undefined && filter.value !== null" 
							:disabled="filter.value === undefined || filter.value === null">
								<i class="ui-icon-cancel">&nbsp;</i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<i role="clearallfilters" class="ui-icon-clear-all-filters clear-all-filters" @click="clearAllFilters"></i>
		<div role="filterbuttons">
			<div class="ui-grid-filter-buttons" v-if="grid.singleFilter !== undefined && grid.singleFilter !== null && grid.singleFilter !== ''">
				<div class="ui-grid-filter-button" @click="grid.clearSingleFilter">
					<span class="ui-grid-column-name">Grid: {{ grid.singleFilter }}</span>
					<i class="ui-icon-cancel smaller">&nbsp;</i>
				</div>
			</div>
			<div v-for="(col, colIndex) in colContainer.renderedColumns">
				<div v-for="(filter, index) in col.filters">
					<div class="ui-grid-filter-buttons" v-if="filter.value !== undefined && filter.value !== null">
						<div class="ui-grid-filter-button" @click="clearFilter(col, filter)">
							<span class="ui-grid-column-name">{{ getColumnName(col) }} [{{filter.condition}}]: {{ filter.value }}</span>
							<i class="ui-icon-cancel smaller">&nbsp;</i>
						</div>					
					</div>					
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			conditions: {},
			condition: undefined,
			showFilterConditions: false,
			selected: undefined
		}
	}, beforeMount: function() {
		var self=this;
		this.selected = (this.grid.options.autoSelect.field)? this.grid.options.autoSelect.field: this.colContainer.renderedColumns[0].field;
		this.conditions["string"] = [{key: "*", value: "Contains"}, {key: "=", value: "Equals"}, 
			{key: "^", value: "Starts With"}, {key: "$", value: "Ends With"}];
		this.conditions["number"] = this.conditions["date"] = [{key: ">", value: "Greaterthan"}, {key: ">=", value: "Greaterthan or Equals"}, 
			{key: "<", value: "Lessthan"}, {key: "<=", value: "Lessthan or Equals"}, {key: "!=", value: "Not Equals"}, {key: "=", value: "Equals"}];
		this.colContainer.renderedColumns.forEach(function (column) {
			if (column.colDef.enableFiltering) {
				if (column.field == self.selected) {
					self.showFilterConditions = (column.filter && column.filter['type'] != 'select')? true : false;
				}
				if (column.filter && column.filter['type'] != 'select') {
					if (column.colDef.type === 'string' || column.colDef.type === 'number') {
						self.conditions[column.colDef.type].forEach(function (condition) {
							var isExists = false;
							column.filters.forEach(function (filter) {
								if (filter.condition == condition.key) {
									isExists = true;
								}
							});
							if (!isExists) {
								column.filters.push( {value: null, type: 'text', condition: condition.key, flags: {'caseSensitive': false}, 
									inherit: false, placeholder: column.title + ' ' + condition.value.toLowerCase() + '...'} );
							}
						});
					}
				}
			}
		});
		this.condition = this.conditions[this.colContainer.renderedColumns[0].colDef.type][0].key;
	}, methods: {
		selectionChanged: function(e) {
			var self=this;
			if (e) { e.stopPropagation(); e.preventDefault(); }
			this.colContainer.renderedColumns.forEach(function (column) {
				if (column.colDef.enableFiltering && column.field == self.selected) {
					self.showFilterConditions = (column.filter && column.filter['type'] != 'select')? true : false;
					self.condition = self.conditions[column.colDef.type][0]["key"];
				}
			});
		},
		getColumnName: function(col) {
			return col.title || $$util.getCamelCaseField(col.field) || col.field
		},
		processFilter: function(col) {
			var self=this;
			col.filters.forEach(function (filter) {
				if (filter['type'] != 'select') {
					if (self.condition != "*" && self.condition != "=" && self.condition != "!=") {
						filter.value = (filter.condition == "*" || filter.condition == "=" || filter.condition == "!=" )? null : filter.value;
					} else if (self.condition == "*" || self.condition == "=" || self.condition == "!=") {
						filter.value = (self.condition == filter.condition)? filter.value : null;
					}
				}
			});
            this.grid.api.core.raise.filterChanged(this.grid, col);
            if (!self.grid.options.useExternalFiltering) {
                this.grid.api.core.notifyDataChange($$util.constants.dataChange.COLUMN);
                this.grid.queueGridRefresh();
            }
		},
		resetCaseSearch: function(col, filter) {
			filter.flags.caseSensitive = !filter.flags.caseSensitive;
			if (filter.value != '') {
				this.processFilter(col);
			}
		},
		clearFilters: function(col) {
			col.filters.forEach(function (filter) {
				filter.value = null;
			});
			this.processFilter(col);
		},
		clearFilter: function(col, filter) {
			filter.value = (filter.type == 'select') ? "" : null;
			this.processFilter(col);
		},
		clearAllFilters: function() {
			this.grid.clearAllFilters();
			this.selected = this.colContainer.renderedColumns[0].field;
			this.showFilterConditions = (this.colContainer.renderedColumns[0].filter && 
					this.colContainer.renderedColumns[0].filter['type'] != 'select')? true : false;
			this.condition = this.conditions[this.colContainer.renderedColumns[0].colDef.type][0].key;
			this.grid.singleFilter = undefined;
		}
	}
};


const uiGridShowHideColumn = {
	name: 'ui-grid-show-hide-column',
	props: { grid: {type: Object, required: true}, colContainer: {type: Object, required: true} },
	template: `<div role="showhidecontainer" class="ui-grid-showhide-container">
		<i class="ui-icon-show-hide ui-grid-showhide-column-icon">&nbsp;</i>
		<div class="ui-grid-column-views">
			<span class="smaller">Column Views: </span><br>
			<select class="ui-grid-column-view-select" size="4" v-model="selected" @change="selectionChanged">
				<option v-for="opt in columnViewOpts" :key="opt.key" :value="opt.key">{{opt.value}}</option>
			</select>
		</div>
		<div role="showhidecolumns" class="ui-grid-showhide-columns">
			<div class="ui-grid-column-views-container">
				<span class="">Selected View: </span>
				<input type="text" class="ui-grid-column-views-input" @input="inputChanged" v-model="input" />
				<span class="ui-grid-column-view-actions">
					<i :class="['ui-icon-save', {'disabled': (readOnlyView == input || showConfirmDeleteMessage)}]" 
						@click="saveColumnView"></i>
					<i :class="['ui-icon-delete', {'disabled': (readOnlyView == input || showConfirmDeleteMessage || isNewView)}]" 
						@click="showConfirmDeleteMessage = true"></i>
				</span>
				<div class="ui-grid-column-view-confirm-delete" v-if="showConfirmDeleteMessage == true">
					<span class="bold">Would you like to delete this Column View ? </span>
					<span class="ui-icon-ok-delete" @click="deleteColumnView">
						<i class="ui-icon-ok" title="Ok"></i>
						<span class="ui-grid-icon-name">Ok</span>
					</span>
					<span class="ui-icon-cancel-delete" @click="showConfirmDeleteMessage = false">
						<i class="ui-icon-cancel" title="Cancel"></i>
						<span class="ui-grid-icon-name">Cancel</span>
					</span>
				</div>
			</div>
			<div class="ui-grid-showhide-columns-container">
				<div class="ui-grid-showhide-column-label">Show or Hide Columns: </div>
				<div role="showhidebuttons" class="ui-grid-show-hide-buttons" v-for="(colDef, index) in grid.options.columnDefs">
					<div class="ui-grid-show-hide-button" @click="showHideColumn($event, colDef)" v-if="colDef.enableColumnHiding">
						<i :class="(colDef.visible === true || colDef.visible === undefined)?'ui-icon-ok':'ui-icon-cancel'">&nbsp;</i>
						<span class="ui-grid-column-name">{{ getColumnName(colDef) }}</span>
					</div>					
				</div>
			</div>
		</div>
	</div>`,
	data: function () {
		return {
			isNewView: true, 
			readOnlyView: "",
			showConfirmDeleteMessage: false, 
			columnViewOpts: [],
			columnViewNames: [],
			input: "",
			selected: ""
		}
	}, beforeMount: function() {
		var self=this;
		if (self.grid.options.columnViews.length) {
			self.grid.options.columnViews.forEach(function (view) {
				self.resetColumnViews(view.name);
				if (view.selected) {
					self.selected = self.input = view.name;
					delete view.selected;
				}
			});
			self.readOnlyView = self.grid.options.columnViews[0].name; 
		} else {
			var viewName = "Default", columnList = [];
			this.colContainer.renderedColumns.forEach(function (column) {
				columnList.push(column.field);
			});
			self.resetColumnViews(viewName);
			this.grid.options.columnViews.push({name: viewName, columns: columnList})
			self.selected = self.input = self.readOnlyView = viewName;
		}
		this.selected = (this.grid.options.autoSelect.field)? this.grid.options.autoSelect.field: this.selected;
	}, methods: {
		getColumnName: function(col) {
			return col.title || $$util.getCamelCaseField(col.field) || col.field
		},
		resetColumnViews: function(name) {
			this.columnViewNames.push(name);
			this.columnViewOpts.push({"key": name, "value": name});
		},
		showHideColumn: function(e, colDef) {
        	if (e) {
        		e.stopPropagation();
        		e.preventDefault();
        	}
        	if (colDef.enableColumnHiding) {
                colDef.visible = !(colDef.visible === true || colDef.visible === undefined);
                this.grid.refresh();
                this.grid.api.core.notifyDataChange($$util.constants.dataChange.COLUMN);
                this.grid.api.core.raise.columnVisibilityChanged(colDef);
        	}
        },
		selectionChanged: function (e, selected) {
			var self=this, columnList = [];
			this.selected = this.input = selected ? selected : this.selected;
			this.grid.options.columnViews.forEach(function (view) {
				if (view.name == self.selected) {
					columnList = view.columns;
				}
			});
			this.grid.options.columnDefs = this.grid.options.baseColumnDefs.filter (function (colDef) {
				return columnList.indexOf(colDef.field) !== -1;
			});
            this.grid.callDataChangeCallbacks($$util.constants.dataChange.COLUMN, {
                orderByColumnDefs: true
            });
		}, 
		inputChanged: function () {
			if (this.input && this.input.length > 3) {
				this.input = $$util.getCamelCaseField(this.input);
				this.isNewView = (this.columnViewNames.indexOf(this.input) > 0) ? false : true;
			}
		}, 
		saveColumnView: function () {
			var columnList = [], action = (this.columnViewNames.indexOf(this.input) > 0) ? 'modified' : 'new';
			this.colContainer.renderedColumns.forEach(function (column) {
				columnList.push(column.field);
			});
			var columnView = {name: this.input, columns: columnList, action: action};
			this.resetColumnViews(this.input);
			this.grid.options.columnViews.push(columnView);
			this.selectionChanged(undefined, this.input);
	        this.grid.api.core.raise.columnViewChanged(columnView);
		}, 
		deleteColumnView: function () {
			var self=this, index = -1, columnView;
			this.showConfirmDeleteMessage = false;
			this.columnViewNames = new Array();
			this.columnViewOpts = new Array();
			this.grid.options.columnViews.forEach(function (view, i) {
				if (view.name == self.input) {
					columnView = {name: view.name, columns: view.columns, action: 'deleted'};
					index = i;
				} else {
					self.resetColumnViews(view.name);
				}
			});
			if (index > -1) {
				this.grid.options.columnViews.splice(index, 1);
				this.selectionChanged(undefined, this.grid.options.columnViews[0].name);
				this.grid.api.core.raise.columnViewChanged(columnView);
			}
		}
	}
};


const uiGridHeader = {
	name: 'ui-grid-header',
	props: { grid: {type: Object, required: true}, colContainer: {type: Object, required: true} },
	components: {
		'ui-tab': uiTab,
		'ui-pane': uiPane,
		'ui-grid-column-filter': uiGridColumnFilter,
		'ui-grid-column-grouping': uiGridColumnGrouping,
		'ui-grid-show-hide-column': uiGridShowHideColumn,
		'ui-grid-export': uiGridExport
	},
	template: `<div class="ui-grid-header">
		<div class="ui-grid-title">{{(grid.options.title)?grid.options.title:''}}</div>
		<!--<i class="ui-icon-tools" style="float:right; font-size: larger; margin: 5px 8px 0 8px;"></i>-->
		<div role="singleFilter" class="ui-grid-single-filter">
			<i class="ui-icon-search ui-grid-search-icon"></i>
			<input type="text" class="ui-grid-single-filter-input" v-model="grid.singleFilter" 
				placeholder="Text based search for all grid data.." @input="processSingleFilter" />
			<div role="clearFilter" class="ui-grid-clear-filter-input" @click="grid.clearSingleFilter" 
				v-if="grid.singleFilter !== undefined && grid.singleFilter !== null && grid.singleFilter !== ''" 
				:disabled="grid.singleFilter === undefined || grid.singleFilter === null || grid.singleFilter === ''">
					<i class="ui-icon-cancel">&nbsp;</i>
			</div>
		</div>
		<ui-tab :show-title="false">
			<ui-pane v-if="grid.options.enableExportData" pane-title="Tools" pane-icon="ui-icon-tools" 
				:selected="selected =='export'? true: false" :cache="true">
				<ui-grid-export :grid="grid"></ui-grid-export>
			</ui-pane>
			<ui-pane v-if="grid.options.enableColumnGrouping" pane-title="Grouping" pane-icon="ui-icon-tree" 
				:selected="selected =='grouping'? true: false" :cache="true">
				<ui-grid-column-grouping :grid="grid" :colContainer="colContainer"></ui-grid-column-grouping>
			</ui-pane>
			<ui-pane v-if="grid.options.enableFiltering" pane-title="Filtering" pane-icon="ui-icon-filter" 
				:selected="selected =='filtering'? true: false" :cache="true">
				<ui-grid-column-filter :grid="grid" :colContainer="colContainer"></ui-grid-column-filter>
			</ui-pane>
			<ui-pane v-if="grid.options.enableColumnHiding" pane-title="ShowHideColumn" pane-icon="ui-icon-show-hide" 
				:selected="selected =='showhide'? true: false" :cache="true">
				<ui-grid-show-hide-column :grid="grid" :colContainer="colContainer"></ui-grid-show-hide-column>
			</ui-pane>
		</ui-tab>
		<div class="clear"></div>
	</div>`,
	data: function () {
		return {
			selected: ''
		}
	}, beforeMount: function() {
		var self=this;
		this.selected = (this.grid.options.autoSelect.tab) ? this.grid.options.autoSelect.tab : "";
		this.grid.singleFilter = undefined;
		this.grid.clearSingleFilter = function() {
			self.grid.singleFilter = undefined;
			self.grid.refresh();
		};
	}, methods: {
		processSingleFilter: function() {
			this.grid.refresh();
		}
	}
};


const vueUiGrid = {
	name: 'vue-ui-grid',
	props: { options: {type: Object, required: true, default: {}}, width: {type: String} , height: {type: String}},
	components: {
		'ui-grid-header': uiGridHeader,
		'ui-grid-pinned-container': uiGridPinnedContainer, 
		'ui-grid-render-container': uiGridRenderContainer,
		'ui-grid-column-menu': uiGridColumnMenu,
		'ui-grid-pagination': uiGridPagination
	},
	template: `<div class="vue-ui-grid-container">
		<component is="style">
		    {{ grid.containerStyles }}
		    .ui-grid-{{ grid.id }} .ui-grid-row, .ui-grid-{{ grid.id }} .ui-grid-cell {
		      height: {{ grid.options.rowHeight }}px;
		    }
		    .ui-grid-{{ grid.id }} .ui-grid-row:last-child .ui-grid-cell {
		      border-bottom-width: {{ (((grid.getVisibleRowCount() * grid.options.rowHeight) < grid.getViewportHeight()) && '1') || '0' }}px;
		    }
		    {{ grid.verticalScrollbarStyles }} {{ grid.horizontalScrollbarStyles }} 
		    {{ grid.customStyles }}
		</component>
		<div class="vue-ui-grid-top-panel">
			<ui-grid-header v-if="grid.showRenderContainer" :grid="grid" :colContainer="colContainer"></ui-grid-header>
		</div>
		<div id="vueUiGrid" class="vue-ui-grid">
		    <div class="ui-grid-contents-wrapper">
		    	<ui-grid-pinned-container v-if="grid.hasLeftContainer()" :grid="grid" side="left" style=""></ui-grid-pinned-container>
				<ui-grid-render-container v-if="grid.showRenderContainer" :grid="grid" containerId="body" rowContainerName="body" 
					colContainerName="body" :isScrollHorizontal="true" :enableHorizontalScrollbar="grid.options.enableHorizontalScrollbar" 
					:isScrollVertical="true" :enableVerticalScrollbar="grid.options.enableVerticalScrollbar"></ui-grid-render-container>
				<ui-grid-pinned-container v-if="grid.hasRightContainer()" :grid="grid" side="right" style=""></ui-grid-pinned-container>
				<ui-grid-column-menu v-if="grid.options.enableColumnMenu" :grid="grid"></ui-grid-column-menu>
			</div>
		</div>
		<div class="vue-ui-grid-bottom-panel" v-if="grid.options.enablePagination || grid.options.useExternalPagination">
			<ui-grid-pagination :grid="grid"></ui-grid-pagination>
		</div>
	</div>`,
	data: function() {
		return {
			unwatchFns: [],
    		dataChangeMoveColumnDereg: function() {return null;}, 
			resizeObserver: new ResizeObserver(function() {}),
			colContainer: null, 
			grid: null
		};
	}, beforeMount: function() {
		var self=this;
        this.grid = new Grid(this.options);
        this.colContainer = this.grid.renderContainers["body"];
        this.grid.setupRowOrColumnProcessor($$util.constants.ROW, function (rows) {
            rows.forEach(function(row) {
                row.evaluateRowVisibility(true);
                if (self.grid.options.enableRowSelection && self.grid.options.isRowSelectable === $$util.noop) {
                	row.enableSelection = true;
                }
            });
            return rows;
        }, 50);
        this.grid.setupRowOrColumnProcessor( $$util.constants.COLUMN, function (columns) {
            columns.forEach(function(column) {
                column.visible = $$util.isDefined(column.colDef.visible) ? column.colDef.visible : true;
            });
            return columns;
        }, 50);
        this.grid.setupRowOrColumnProcessor( $$util.constants.ROW, this.grid.searchRows, 100);
		this.grid.setupRowOrColumnProcessor( $$util.constants.ROW, function( renderableRows ){
			if (this.singleFilter !== null && this.singleFilter !== undefined && this.singleFilter !== "") {
				var singleFilter = this.singleFilter.toUpperCase(), 
					renderedColumns = self.colContainer.renderedColumns;
				var matcher = new RegExp(singleFilter);
				renderableRows.forEach( function( row ) {
					var match = false;
					renderedColumns.forEach(function( col ){
						if (!row.groupHeader) {
							if (col.colDef.type == "string" && row.data[col.field].toUpperCase().match(matcher)) {
								match = true;
							} else if (col.colDef.type == "number" || col.colDef.type == "boolean" || col.colDef.type == "date") {
								var value = (col.cellFilter) ? self.grid.getCellValue(row, col).toString() : row.data[col.field].toString();
								if (value.toUpperCase().indexOf(singleFilter) !== -1) {
									match = true;
								}
							}
						}
					});
					if (!match) row.visible = false;
				});
			}
			return renderableRows;
		}, 150 );
        this.grid.setupRowOrColumnProcessor( $$util.constants.ROW, this.grid.sortByColumn, 200);
		if (this.grid.options.enableExportData) {
			this.grid.setupGridExport(this.grid);
		}
        if (this.grid.options.enableColumnPinning) {
        	this.grid.setupColumnPinning(this.grid);
        }
        if (this.grid.options.enableColumnResizing) {
            this.grid.api.setupEvent("resizeable", "columnResized");
    		this.grid.setupColumnBuilder(function resizeColumnBuilder(colDef, col, gridOptions) {
    	        var promises = [];
    	        colDef.enableColumnResizing = colDef.enableColumnResizing === undefined ? 
    	        		gridOptions.enableColumnResizing : colDef.enableColumnResizing;
    	        return Promise.all(promises);
    	    });
        }
        if (this.grid.options.enableColumnMoving) {
            this.grid.api.setupEvent("colMovable", "columnPositionChanged");
            this.grid.columnOrderCache = []; // Used to cache the order before columns are rebuilt
            this.grid.setupColumnBuilder(function moveColumnBuilder(colDef, col, gridOptions) {
            	var promises = [];
    	        colDef.enableColumnMoving = colDef.enableColumnMoving === undefined ? 
    	        		gridOptions.enableColumnMoving : colDef.enableColumnMoving;
    	        return Promise.all(promises);
    		});
            this.dataChangeMoveColumnDereg = this.grid.setupDataChangeCallback(function dataChangeMoveColumn(grid) {
    	        var newIndex, headerRowOffset = grid.rowHeaderColumns.length;
    	        grid.columnOrderCache.forEach(function(cacheCol, cacheIndex) {
    	          newIndex = grid.columns.indexOf(cacheCol);
    	          if ( newIndex !== -1 && newIndex - headerRowOffset !== cacheIndex ) {
    	            var column = grid.columns.splice(newIndex, 1)[0];
    	            grid.columns.splice(cacheIndex + headerRowOffset, 0, column);
    	          }
    	        });
    	    }, [$$util.constants.dataChange.COLUMN]);
        }
		if (this.grid.options.enableColumnGrouping) {
			this.grid.enableColumnGrouping(this.grid);
		}
		if (this.grid.options.enableRowSelection) {
			this.grid.enableRowSelection(this.grid);
		}
		if (this.grid.options.enableExpandableRows) {
			this.grid.enableExpandableRows(this.grid);
		}
		if (this.grid.options.enableRowEdit) {
			this.grid.enableRowEdit(this.grid);
		}
		this.grid.showRenderContainer = false;
	}, mounted: function() {
        this.grid.$el = this.$el.querySelector(".vue-ui-grid");
        if (this.width) this.$el.style.width = this.width;
        if (this.height) this.grid.$el.style.height = this.height;
        this.grid.rtl = $$util.$$element.getStyles(this.grid.$el)["direction"] === "rtl";
		this.grid.$el.classList.add("ui-grid-" + this.grid.id);
		this.grid.api['$parent'] = this.$parent;
		
		var self=this;
        if (self.grid.options.autoResize) {
        	var autoResizeDebounce = $$util.debounce( function autoResize(prevWidth, prevHeight, width, height) {
                if (self.grid.$el.offsetParent !== null) {
                    self.grid.gridWidth = width;
                    self.grid.gridHeight = height;
                    self.grid.queueGridRefresh().then(function() {
                        self.grid.api.core.raise.gridDimensionChanged(prevHeight, prevWidth, height, width);
                    });
                  }
            });
            self.resizeObserver = new ResizeObserver(function() {
            	autoResizeDebounce(self.grid.gridWidth, self.grid.gridHeight, 
                		$$util.$$element.elementWidth(self.grid.$el), $$util.$$element.elementHeight(self.grid.$el));
            }).observe(self.grid.$el);
        }
        self.gridResize = function () {
            if (!$$util.isVisible(self.grid.$el)) {
                return;
            }
            self.grid.gridWidth = $$util.$$element.elementWidth(self.grid.$el);
            self.grid.gridHeight = $$util.$$element.elementHeight(self.grid.$el);
            self.grid.refreshCanvas(true);
        }
        window.addEventListener('resize', self.gridResize);
        
    	var unwatchData = self.$watch(function() {
    		return ($$util.isString(self.grid.options.data))?JSON.parse(self.grid.options.data):self.grid.options.data;
    	}, function (data) {
            if (data) {
            	self.grid.refreshData(data);
            }
    	}, {immediate: true});
    	self.unwatchFns.push(unwatchData);
    	
    	var unwatchColumnDefs = self.$watch(function() {
            return self.options.columnDefs;
        }, function (n, o) {
            if (n && n !== o) {
                self.grid.options.columnDefs = self.options.columnDefs;
                self.grid.callDataChangeCallbacks($$util.constants.dataChange.COLUMN, {
                    orderByColumnDefs: true
                });
            }
        }, {deep: true});
    	self.unwatchFns.push(unwatchColumnDefs);
    	
    	var width = $$util.$$element.elementWidth(self.grid.$el);
    	self.grid.containerStyles = ` .vue-ui-grid-container { width: ${width}px!important; } \n`;
    	
    	var unwatchStyles = self.$watch(function() {
            return self.grid.styleComputations;
    	}, function () {
            self.grid.refreshCanvas(true);
        });
    	self.unwatchFns.push(unwatchStyles);
    	
        self.grid.renderingComplete();
        
        setTimeout(function() {
        	self.grid.adjustGridHeight();
        }, 100);
    	
	}, methods: {
	}, beforeUnmount: function() {
		window.removeEventListener('resize', this.gridResize);
        if (this.resizeObserver) {
        	this.resizeObserver.unobserve(this.$el);
        }
        this.unwatchFns.forEach(function(unwatchFn) {
        	unwatchFn();
        });
        if (this.dataChangeMoveColumnDereg) {
        	this.dataChangeMoveColumnDereg();
        }
	}
};


