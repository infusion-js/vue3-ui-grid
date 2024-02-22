const uiDocsExample3_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample3_1.js = uiDocsCode.js('', '', `title: "Initial Sorting Example",
        enableSorting: true,
        columnDefs: [
          { field: 'name', sort: { priority: 1, direction: 'desc' } }, 
          { field: 'age', sort: { priority: 0, direction: 'asc' } }, 
          { field: 'department' },
          { field: 'gender' }
        ]`);


uiDocsComponents['uiDocsInitialSorting'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>To achieve initial sorting before loading grid data...</p>
		<p class="pt-05 pb-05">To apply initial sorting for specific column, include 'sort' object (with direction and priority) in columnDefs, 
			<p class="pt-00 pb-00">Priority tells what order to sort, it's a numeric, can start from 0 which is low and increment one for 
			every next priority column. </p>
			<p class="pt-00 pb-00">Direction tells which way to sort, can be 'asc' for sort ascending or 'desc' for sort descending. </p>
		</p>
		<p class="pb-05">Column data type can be string, number, boolean, date or object to apply specific type of sorting on column. </p>
		<p class="bold">Sample columnDefs declaration is as shown below:-</p>
		<p>(On initial grid load, sorting done for age at first in ascending order and then for name in descending order)</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Initial Sorting Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70 blue">{ field: 'name', sort: { priority: 1, direction: 'desc' }}, </span>
			<span class="pl-70 blue">{ field: 'age', type: 'number', sort: { priority: 0, direction: 'asc' }} </span>
			<span class="pl-70">{ field: 'department'}, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample3_1.html" :css-code="uiDocsExample3_1.css" :json-code="uiDocsExample3_1.json" 
			:js-code="uiDocsExample3_1.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample3_1
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
							title: "Initial Sorting Example",
							enableSorting: true,
							columnDefs: [
								{ field: 'name', sort: { priority: 1, direction: 'desc' } }, 
								{ field: 'age', type: 'number', sort: { priority: 0, direction: 'asc' } }, 
								{ field: 'department' },
								{ field: 'gender' }
							],
							data: jsonData
						}
					}
				}
			};
		}
	}
};
