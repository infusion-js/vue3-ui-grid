console.clear();

const uiDocsCode = {
	html: function (merge = '') {
		return `<!doctype html>
<html>
  <head>
    <link type="text/css" rel="stylesheet" href="../css/vue-ui-grid.css">
    <link type="text/css" rel="stylesheet" href="./example.css">
  </head>
  <body>
    <div id="app">
      <vue-ui-grid :options="gridOptions"></vue-ui-grid>
    </div>
    
    <script type="text/javascript" src="../js/vue-v3.1.2.js"></script>${merge}
    
    <script type="text/javascript" src="../js/vue-ui-grid.js"></script>
    <script type="text/javascript" src="./jsondata.js"></script>
    <script type="text/javascript" src="./example.js"></script>
  </body>
</html>`;
	}, 
	css: function (merge = '') {
		return `//example.css
.vue-ui-grid {width:860px; height:360px;} ${merge}
`;
	},
	json: function (merge = jsonStr) {
		return `//jsondata.js
var jsonData = ${merge};
`;
	},
	js: function (utilFns = '', cmpData = '', options = '', misc = '') {
		return `//example.js ${utilFns}
const app = Vue.createApp({
  components: { 'vue-ui-grid': vueUiGrid },
  data() {
    return { ${cmpData}
      gridOptions: {
        ${options},
        data: jsonData
      }
    } ${misc}
  }
});

const vm = app.mount('#app');`;
	}
};

const uiDocsComponents = {};


/* Side Menu Element */
const uiDocsMenu = {
	name: 'ui-docs-menu', 
	props: {menuItem: {type: Object, required: true}, selected: {type: String, required: true}, index: {type: Number}},
	emits: [ 'ui-refresh-content', 'ui-refresh-show-submenus' ],
	template: `
	<div class="menu-item-container">
		<a :class="{'active': (selected === menuItem.sno)}" @click="refreshContent($event, menuItem)">
			<span class="menu-item-label">{{ menuItem.sno + '. ' + menuItem.name }}</span>
			<span class="menu-item-icon right" v-if="menuItem.children && menuItem.children.length" @click="toggleSubMenu($event, menuItem)">
				<i class="ui-icon-single-caret-up" v-if="menuItem.subMenu"></i>
				<i class="ui-icon-single-caret-down" v-if="!menuItem.subMenu"></i>
			</span>
		</a>
		<div class="sub-menu" v-if="menuItem.children && menuItem.children.length && menuItem.subMenu">
			<ui-docs-menu v-for="(subMenuItem, sIndex) in menuItem.children" :key="sIndex" :index="sIndex" :menuItem="subMenuItem" :selected="selected" 
				:class="{'sub-menu-item': (menuItem.children && menuItem.children.length)}"></ui-docs-menu>
		</div>
	</div>`,
	methods: {
		refreshContent: function(e, menuItem) {
			this.$parent.refreshContent(e, menuItem);
		},
		refreshShowSubMenus: function(e) {
			this.$parent.refreshShowSubMenus(e);
		},
		toggleSubMenu: function(e, item) {
			var self=this;
			item.subMenu = !item.subMenu;
			this.refreshShowSubMenus(e);
			/*setTimeout(function() {
				self.refreshShowSubMenus(e);
			}, 100);*/
		}
	}
};

/* Script Element */
const uiDocsScript = {
	name: 'ui-docs-script',
	props: {title: {type: String, required: true}, src: {type: String, required: true}, component: {type: String, required: true}},
	template: `<div class="ui-docs-script-container">
		<component v-if="!uiScriptLoaded" is="script" :src="src" @load="uiScriptLoaded = true"></component>
		<div class="u-docs-content-container" v-if="uiScriptLoaded">
			<div class="ui-docs-content-h1">{{title}}</div>
			<component :is="getUiDocsComponent"></component>
		</div>
	</div>`,
	data: function () {
		return {
			uiScriptLoaded: false
		}
	}, computed: {
		getUiDocsComponent: function() {
			var component = uiDocsComponents[this.component];
			return component;
		}
	}, beforeMount: function() {
		this.uiScriptLoaded = (uiDocsComponents[this.component]) ? true : false;
	}, mounted: function() {
		/*var self=this;
		setTimeout(function() {
			self.uiScriptLoaded = true;
		}, 50);*/
	}, methods: {
		uiScriptLoadedFn: function() {
			console.log('script loaded');
		}
	}
};
		
/* Tab & Pane Elements */
const uiDocsTab = {
	name: 'ui-docs-tab',
	props: { title: {type: String}, css: {type: String, default: ''}, iconClass: {type: String}, 
		showTitle: {type: Boolean, default: true} },
	template: `<div class="ui-docs-tabs-container">
		<div :class="[css, 'ui-docs-tabs']">
			<ul><li v-for="tab in tabs" :class="['ui-docs-tab', {\'active\': current === tab}]">
				<a href="javascript:void(0)" :id="getTabName(tab)" :class="css" @click="changeTab(tab)" 
						:style="[tab.disable ? {'pointer-events': 'none'} : {'pointer-events': 'all'}]">
					<i :class="tab.paneIcon" v-if="tab.paneIcon"></i>
					<span class="label" v-if="showTitle">{{ tab.paneTitle }}</span>
				</a>
			</li></ul>
		</div>
	    <div class="ui-docs-panes"><slot></slot></div>
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
			this.current = selected;
			this.tabs.forEach(function(tab) {
				tab.active = (tab.paneTitle == selected.paneTitle);
			});
		}
	}
};

const uiDocsPane = {
	name: 'ui-docs-pane',
	props: { paneId: { type: String }, paneTitle: { type: String }, paneIcon: { type: String }, selected: { type: Boolean, default: false}, 
		cache: { type: Boolean, default: false }, disable: { type: Boolean, default: false} },
	template: `<div class="ui-docs-pane">
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
	mounted: function() {
		this.$parent.addPane(this);
	},
	created: function() {
		this.active = this.selected;
	}
};

const uiDocsTabs = {
	components: {'ui-docs-tab': uiDocsTab, 'ui-docs-pane': uiDocsPane},
	props: {htmlCode: {type: String, required: true}, cssCode: {type: String, required: true}, jsonCode: {type: String, required: true}, 
		jsCode: {type: String, required: true}, result: {type: Object, required: true}},
	template: `<div class="clear">
		<ui-docs-tab title="Docs Example Container">
			<ui-docs-pane pane-title="HTML">
				<pre class="ui-docs-code-html f12">{{htmlCode}}</pre>
			</ui-docs-pane>
			<ui-docs-pane pane-title="CSS">
				<pre class="ui-docs-code-css f12">{{cssCode}}</pre>
			</ui-docs-pane>
			<ui-docs-pane pane-title="JSON">
				<pre class="ui-docs-code-json f12">{{jsonCode}}</pre>
			</ui-docs-pane>
			<ui-docs-pane pane-title="Javascript">
				<pre class="ui-docs-code-js f12">{{jsCode}}</pre>
			</ui-docs-pane>
			<ui-docs-pane pane-title="Demo" :selected="true" :cache="true">
				<div class="ui-docs-result-container pt-10">
					<component :is="result"></component>
				</div>
			</ui-docs-pane>
		</ui-docs-tab>
	</div>`
};


const utilFns = {
  paginationOptions: { grid: undefined, sortCols: undefined }, 
  getColFilters: function(cols) {
    var colData = [];
    for (var i = 0; i < cols.length; i++) {
      let col = cols[i], hasFilter = false;
      if (typeof col.filters !== "undefined") {
        col.filters.forEach(function(filter) {
          hasFilter = (filter.value != null && filter.value != undefined) ? true : hasFilter;
        });
        if (hasFilter) {
          colData.push({
            'col' : col, 'filters': col.filters
          });
        }
      }
    }
    return colData;
  },
  runColumnFilter: function (row, col, filter) {
    var value = row[col.field], regExFlg = (!filter.flags || !filter.flags.caseSensitive)? "i" : "";
        if (filter.value == '') return true;
        if (typeof filter.value === "string") {
          filter.value = filter.value.trim().replace(/(^\*|\*$)/g, "").replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        filter.condition = filter.condition || (filter.type && filter.type == 'select' ? 
            $$util.constants.filter.EQUALS : $$util.constants.filter.CONTAINS);
      var regExp = (filter.condition === $$util.constants.filter.STARTS_WITH) ? new RegExp("^" + filter.value, regExFlg) : 
        (filter.condition === $$util.constants.filter.ENDS_WITH) ? new RegExp(filter.value + "$", regExFlg) : 
          (filter.condition === $$util.constants.filter.CONTAINS) ? new RegExp(filter.value, regExFlg) : 
            (filter.condition === $$util.constants.filter.EQUALS || filter.condition === $$util.constants.filter.NOT_EQUAL) ? 
                new RegExp("^" + filter.value + "$", regExFlg) : null;
    return (regExp != null) ? (filter.condition === $$util.constants.filter.NOT_EQUAL) ? !regExp.test(value) : regExp.test(value) : 
      (filter.condition === $$util.constants.filter.GREATER_THAN) ? value > filter.value : 
        (filter.condition === $$util.constants.filter.GREATER_THAN_OR_EQUAL) ? value >= filter.value : 
          (filter.condition === $$util.constants.filter.LESS_THAN) ? value < filter.value : 
            (filter.condition === $$util.constants.filter.LESS_THAN_OR_EQUAL) ? value <= filter.value : true;
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
  sortText: function (a, b) {
      var result = this.handleNulls(a, b);
      if (result !== null) {
          return result;
      }
      var strA = a.toString().toLowerCase(), strB = b.toString().toLowerCase();
      return strA === strB ? 0 : strA.localeCompare(strB);
  },
  sortNumber: function (a, b) {
      var result = this.handleNulls(a, b);
      return (result !== null) ? result : a - b;
  },
  refreshPageData: function () {
    var data = jsonData;
    if (utilFns.paginationOptions.grid) {
      var colData = utilFns.getColFilters(utilFns.paginationOptions.grid.columns), colDataLength = colData.length;
      data = jsonData.filter(function(row, index) {
        let matches = true;
        for (var i = 0; i < colDataLength; i++) {
          for (var j = 0; j < colData[i].filters.length; j++) {
            if (colData[i].filters[j].value != null && colData[i].filters[j].value != undefined) {
              matches = matches && utilFns.runColumnFilter(
                 jsonData[index], colData[i].col, colData[i].filters[j]);
            }
          }
        }
        return matches;
  	  });
      if (utilFns.paginationOptions.sortCols) {
        var sortCols = utilFns.paginationOptions.sortCols;
        var field = sortCols[0].field, type = sortCols[0].colDef.type, direction = sortCols[0].sort.direction;
        data = data.sort(function(r1, r2) {
          var p1 = r1[field], p2 = r2[field];
          var result = (type == 'string') ? utilFns.sortText(p1, p2) : utilFns.sortNumber(p1, p2);
          return (direction == 'asc')? result : (0 - result);
        });
      }
      var pageNumber = utilFns.paginationOptions.grid.options.paginationCurrentPage, 
        pageSize = utilFns.paginationOptions.grid.options.paginationPageSize;
      var start = (pageNumber-1) * pageSize, end = pageNumber * pageSize;
      var pageData = data.slice(start, end);
      if (pageData.length < start+end) {
        utilFns.paginationOptions.grid.options.paginationCurrentPage = 1;
        grid.refreshData(pageData.slice(0, 10));
      } else {
        grid.refreshData(pageData);
      }
    }
  }
};


const convertObjToString = function (obj, t) {
  let result = "{";
  for (let k in obj) {
    let v = obj[k];
    if (typeof v === "function") {
      v = v.toString();
    } else if (v instanceof Array) {
      v = JSON.stringify(v);
    } else if (typeof v === "object") {
      v = convertObjToString(v, t+t);
    } else {
      v = `"${v}"`;
    }
    result += `\n${t}${k}: ${v},`;
  }
  result += (t==="    ")? "\n  }" : "\n};\n\n";
  return result;
};

const utilFnStr = "\nconst utilFns = " + convertObjToString(utilFns, '  ');



