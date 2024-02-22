const uiDocsExample4_2 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample4_2.js = uiDocsCode.js('', '', `title: "External Filtering Example",
        useExternalFiltering: true,
        columnDefs: [
          { field: 'name', enableFiltering: false }, 
          { field: 'gender', filter: { value: '', type: 'select', selectOptions: [{ value: '', label: 'Select Gender...' }, 
            { value: 'male', label: 'male' }, { value: 'female', label: 'female' }]},
            cellFilter: function mapGender (input) {return (!input) ? '' : (input === 'male') ? 1 : 2;}
          }, 
          { field: 'age', type: 'number' }, 
          { field: 'salary', enableFiltering: false }
        ],
        onChangeApi: function( api ) {
          api.core.on.filterChanged(function(grid, col) {
            var colData = utilFns.getColFilters(grid.columns);
            var data = jsonData.filter(function(row, index) {
              let matches = true;
              for (var i = 0; i < colData.length; i++) {
                for (var j = 0; j < colData[i].filters.length; j++) {
  	              if (colData[i].filters[j].value != null && colData[i].filters[j].value != undefined) {
                    matches = matches && utilFns.runColumnFilter(
                     jsonData[index], colData[i].col, colData[i].filters[j]);
                  }
                }
              }
              return matches;
            });
            grid.refreshData(data);
          });
          api.core.on.clearAllFilters(function(grid, col) {
            grid.refreshData(jsonData);
          });
        }`);


uiDocsComponents['uiDocsExternalFiltering'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>External Filtering can be used to perform filtering at server side.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">useExternalFiltering</span>: <div class="goc">Default false, 
			true to turn off native filtering. </div>
		</div>
		<p class="pt-15 pb-05">Whenever user has changed the filter, 'filterChanged' event will be triggered, Capture the 'filterChanged' event 
			inside 'onChangeApi' function in grid options and Perform a server call to receive filtered data from server. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "External Filtering Example", </span>
			<span class="pl-50 blue">useExternalFiltering: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender', filter: { value: '', type: 'select', selectOptions: [ </span>
			<span class="pl-90"> {value: '', label: 'Select Gender...'},{value: 'male', label: 'male'}, {value: 'female', label: 'female'}] } </span>
			<span class="pl-70">}, </span>
			<span class="pl-70">{ field: 'age', type: 'number' } </span>
			<span class="pl-70 blue">{ field: 'salary', enableFiltering: false }, </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 blue">api.core.on.filterChanged(function(grid, col) { </span>
			<span class="pl-90 green">//perform a server call for filtered data. </span>
			<span class="pl-90 blue">grid.refreshData(filteredData); </span>
			<span class="pl-70 blue">}) </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample4_2.html" :css-code="uiDocsExample4_2.css" :json-code="uiDocsExample4_2.json" 
			:js-code="uiDocsExample4_2.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample4_2
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
							title: "External Filtering Example",
							autoSelect: {tab: "filtering", field: 'gender'},
							useExternalFiltering: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender', filter: { value: '', type: 'select', selectOptions: [{ value: '', label: 'Select Gender...' }, 
									{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }] }
								}, 
								{ field: 'age', type: 'number' }, 
								{ field: 'salary', enableFiltering: false }
							],
							onChangeApi: function( api ) {
								api.core.on.filterChanged(function(grid, col) {
									var colData = utilFns.getColFilters(grid.columns);
									var data = jsonData.filter(function(row, index) {
										let matches = true;
										for (var i = 0; i < colData.length; i++) {
					                        for (var j = 0; j < colData[i].filters.length; j++) {
					                            if (colData[i].filters[j].value != null && colData[i].filters[j].value != undefined) {
					                            	matches = matches && utilFns.runColumnFilter(
					                            			jsonData[index], colData[i].col, colData[i].filters[j]);
					                            }
					                        }
										}
				                        return matches;
									});
					                grid.refreshData(data);
								});
								api.core.on.clearAllFilters(function(grid, col) {
									grid.refreshData(jsonData);
								});
							},
							data: jsonData
						}
					}
				}
			};
		}
	}
};
