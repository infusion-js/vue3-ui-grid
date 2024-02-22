const uiDocsExample3_2 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample3_2.js = uiDocsCode.js('', '', `title: "External Sorting Example",
        useExternalSorting: true,
        columnDefs: [
          { field: 'name' },
          { field: 'gender', enableSorting: false },
          { field: 'age', enableSorting: false }
        ],
        onChangeApi: function( api ) {
          var jsnData = jsonData.map(function(e) { return {...e}; });
          api.core.on.sortChanged(function(grid, sortCols) {
            if (sortCols.length > 0) {
              var field = sortCols[0].field, type = sortCols[0].colDef.type, direction = sortCols[0].sort.direction;
              var data = jsnData.sort(function(r1, r2) {
              var p1 = r1[field], p2 = r2[field];
                var result = (type == 'string') ? utilFns.sortText(p1, p2) : utilFns.sortNumber(p1, p2);
                return (direction == 'asc')? result : (0 - result);
              });
              grid.refreshData(data);
            } else {
              grid.refreshData(jsonData);
            }
          });
        }`);


uiDocsComponents['uiDocsExternalSorting'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>External Sorting can be used to perform sort at server side.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">useExternalSorting</span>: <div class="goc">Default false, 
			true to turn off native sorting. </div>
		</div>
		<p class="pt-15 pb-05">Whenever user has changed the sort, 'sortChanged' event will be triggered, Capture the 'sortChanged' event 
			inside 'onChangeApi' function in grid options and Perform a server call to receive sorted data from server. </p>
		<p class="bold">Sample gridOptions declaration is as shown below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "External Sorting Example", </span>
			<span class="pl-50 blue">useExternalSorting: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender', enableSorting: false }, </span>
			<span class="pl-70">{ field: 'age', enableSorting: false } </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 blue">api.core.on.sortChanged(function(grid, sortCols) { </span>
			<span class="pl-90 green">//perform a server call for sorted data. </span>
			<span class="pl-90 blue">grid.refreshData(sortedData); </span>
			<span class="pl-70 blue">}) </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample3_2.html" :css-code="uiDocsExample3_2.css" :json-code="uiDocsExample3_2.json" 
			:js-code="uiDocsExample3_2.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample3_2
		}
	}, computed: {
		getResult: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "External Sorting Example",
							useExternalSorting: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender', enableSorting: false },
								{ field: 'age', enableSorting: false }
							],
							onChangeApi: function( api ) {
								var jsnData = jsonData.map(function(e) { return {...e}; });
								api.core.on.sortChanged(function(grid, sortCols) {
									if (sortCols.length > 0) {
										var field = sortCols[0].field, type = sortCols[0].colDef.type, direction = sortCols[0].sort.direction;
										var data = jsnData.sort(function(r1, r2) {
											var p1 = r1[field], p2 = r2[field];
											var result = (type == 'string') ? utilFns.sortText(p1, p2) : utilFns.sortNumber(p1, p2);
											return (direction == 'asc')? result : (0 - result);
										});
										grid.refreshData(data);
									} else {
										grid.refreshData(jsonData);
									}
								})
							},
							data: jsonData
						}
					}
				}
			};
		}
	}
};
