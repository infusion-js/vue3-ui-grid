const uiDocsExample11 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample11.js = uiDocsCode.js('', '', `title: "Column Grouping Example",
        enableColumnGrouping: true, 
        enableColumnFooter: true, 
        columnDefs: [
          { field: 'name', aggregationType: $$util.constants.aggregation.COUNT, width: "100", cellTooltip: true }, 
          { field: 'gender', grouping: { priority: 1 }, sort: { priority: 1, direction: 'desc' } }, 
          { field: 'age', visible: true, treeAggregationType: $$util.constants.aggregation.MAX },
          { field: 'address.state', title: 'State', grouping: { priority: 0 }, sort: { priority: 0, direction: 'asc' } },
          { field: 'salary', treeAggregationType: $$util.constants.aggregation.AVG }
        ]
        onChangeApi: function( api ) {
          console.log('Current Grouping settings: ', JSON.stringify(api.grouping.getGrouping()));
        }`);


uiDocsComponents['uiDocsColumnGrouping'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Grouping feature allows to group rows together based on similar values in specific columns.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableColumnGrouping</span>: <div class="goc">Default false, true to enable 
			column grouping feature. </div>
			<span class="green bold">enableColumnFooter</span>: <div class="goc">Default false, true to enable 
			column footer feature. </div>
		</div>
		<p class="pt-15 pb-05">Grouping can be set on initial load of grid using the columnDef option grouping: { priority: 0 }, Aggregations also 
			can be, set on a column using "treeAggregationType: $$util.constants.aggregation.COUNT, treeAggregationLabel: 'CNT: '".
			<p class="pt-00 pb-00">Column(s) being grouped always moved to the high order of sort priority, as the data must be 
				sorted at first to permit grouping. </p> 
			<p class="pt-00 pb-00">Group header rows either cannot be edited or available for selection even using edit or selection features. </p>
			<p class="pt-00 pb-00">Group row header is always visible by default. To show groupRowHeader, when at least one column is grouped, 
				then set the "treeRowHeaderAlwaysVisible" gridOption to false. </p> 
		</p>
		<p class="bold">To change the grouping programmatically after grid initialization, use below methods:- </p>
		<div class="highlight">
			<span class="pl-10">
				<span class="bold green">groupColumn(colField):</span> Groups an individual column. adds it to the end of the current grouping.
				<span class="pb-05">For Ex: api.grouping.groupColumn('gender'); will group Gender column. </span>
			</span>
			<span class="pl-10">
				<span class="bold green">ungroupColumn(colField):</span> Ungroups an individual column. 
				<span class="pb-05">For Ex: api.grouping.ungroupColumn('age'); will remove grouping on Age column. </span>
			</span>
			<span class="pl-10">
				<span class="bold green">aggregateColumn(colField, aggType, aggLabel):</span> Sets aggregation on a column, 
					automatically removes any sort at first. 
				<span class="">For Ex: api.grouping.aggregateColumn('salary', $$util.constants.aggregation.AVG, 'Avg: '); </span>
				<span class="pb-05">sets average aggregation calculation on Salary column. </span>
			</span>
			<span class="pl-10">
				<span class="bold green">setGrouping(config):</span> Sets all the grouping at once, by removing existing grouping. 
				<span class="">For Ex: api.grouping.setGrouping({"grouping":[{"field":"gender","priority":0}], 
					"aggregations":[{"field":"age","aggregation":{"type":"max","label":"Max: "}}]}); </span>
				<span class="pb-05">sets grouping on Gender column and MAX aggregation on Age column. </span>
			</span>
			<span class="pl-10">
				<span class="bold green">getGrouping():</span> Gets current grouping settings. 
				<span class="pb-05">For Ex: api.grouping.getGrouping(); fetches grouping and aggregation settings for all columns. </span>
			</span>
			<span class="pl-10">
				<span class="bold green">clearGrouping():</span> Clears all current grouping settings. 
				<span class="pb-05">For Ex: api.grouping.clearGrouping(); clears grouping and aggregation settings for all columns. </span>
			</span>
		</div>
		<div class="pb-15"></div>
		<p class="bold">Sample gridOptions declaration is as below:- </p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Column Grouping Example", </span>
			<span class="pl-50 blue">enableColumnGrouping: true, </span>
			<span class="pl-50 blue">enableColumnFooter: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70 blue">{ field: 'name', aggregationType: $$util.constants.aggregation.COUNT, width: "100", cellTooltip: true }, </span>
			<span class="pl-70 blue">{ field: 'gender', grouping: { priority: 1 }, sort: { priority: 1, direction: 'desc' } }, </span>
			<span class="pl-70 blue">{ field: 'age', visible: true, treeAggregationType: $$util.constants.aggregation.MAX }, </span>
			<span class="pl-70 blue">{ field: 'address.state', title: 'State', grouping: { priority: 0 }, sort: { priority: 0, direction: 'asc' } }, </span>
			<span class="pl-70 blue">{ field: 'salary', treeAggregationType: $$util.constants.aggregation.AVG, treeAggregationLabel: '' } </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pt-05 pb-15">In this Example, Notice here, Grouping has done for State column at first due to its priority is 0, and then on 
			Gender column as its priority is 1, Same priority has set for sorting also.
			<p class="pt-00 pb-00">Aggregation COUNT set on Name column can be seen on column footer (counts number of rows), and other aggregations  
				MAX set on Age column and AVG set on Salary column can be seen on each grouping header row and also on column footer. </p>
		</p>
		<ui-docs-tabs :html-code="uiDocsExample11.html" :css-code="uiDocsExample11.css" :json-code="uiDocsExample11.json" 
			:js-code="uiDocsExample11.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample11
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
							title: "Column Grouping Example",
							autoSelect: {tab: "grouping", field: "address.state"},
							enableColumnGrouping: true, 
							enableColumnFooter: true, 
							columnDefs: [
								{ field: 'name', aggregationType: $$util.constants.aggregation.COUNT, width: "100", cellTooltip: true }, 
								{ field: 'gender', grouping: { priority: 1 }, sort: { priority: 1, direction: 'desc' } }, 
								{ field: 'age', visible: true, treeAggregationType: $$util.constants.aggregation.MAX },
								{ field: 'address.state', title: 'State', grouping: { priority: 0 }, sort: { priority: 0, direction: 'asc' } },
								{ field: 'salary', treeAggregationType: $$util.constants.aggregation.AVG, treeAggregationLabel: '' }
							],
							onChangeApi: function( api ) {
								console.log('Current Grouping settings: ', JSON.stringify(api.grouping.getGrouping()));
							},
							data: jsonData
						}
					}
				}
			};
		}
	}
};
