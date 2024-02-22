const uiDocsExample3 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample3.js = uiDocsCode.js('', '', `title: "Column Sorting Example",
        enableSorting: true,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age', enableSorting: false }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsSorting'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>This feature allows sort data for a specific column in ascending or descending order.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableSorting</span>: <div class="goc">Default true, false to prevent 
			sorting, setting this option from gridOptions applies to all columns, setting it from columnDefs applies to 
			specific column only. </div>
		</div>
		<p class="pt-15 pb-15">When clicking on sort icon showed next to column heading, sort direction will change to ascending at first, 
			On next click, sort direction will change to descending and next click will reset to unsort. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Column Sorting Example", </span>
			<span class="pl-50 blue">enableSorting: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70 blue">{ field: 'age', enableSorting: false } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample3.html" :css-code="uiDocsExample3.css" :json-code="uiDocsExample3.json" 
			:js-code="uiDocsExample3.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample3
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
							title: "Column Sorting Example",
							enableSorting: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age', enableSorting: false }, 
								{ field: 'salary' }
							],
							data: jsonData
						}
					}
				}
			};
		}
	}
};
