const uiDocsExample4 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample4.js = uiDocsCode.js('', '', `title: "Fitering Data Example",
        enableFiltering: true,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age', type: 'number' }, 
          { field: 'salary', enableFiltering: false }
        ]`);


uiDocsComponents['uiDocsFiltering'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Filtering allows to search for specific data either at grid or column level.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableFiltering</span>: <div class="goc">Default false, 
			true to enable filtering, setting this option from gridOptions applies to all columns, setting it from columnDefs 
			applies to specific column only. </div>
		</div>
		<p class="pt-15 pb-15">By default data will be filtered as text only, unless data type is specified for that column, 
			Data type for a column might be string, number, boolean or date. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Fitering Data Example", </span>
			<span class="pl-50 blue">enableFiltering: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender' } </span>
			<span class="pl-70 blue">{ field: 'age', type: 'number' } </span>
			<span class="pl-70 blue">{ field: 'salary', enableFiltering: false }, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Filtering is enabled for all columns except Salary column and </p>
		<p class="pb-15">Numeric Filtering (number data type specific conditions) is enabled for Age column. </p>
		<ui-docs-tabs :html-code="uiDocsExample4.html" :css-code="uiDocsExample4.css" :json-code="uiDocsExample4.json" 
			:js-code="uiDocsExample4.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample4
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
							title: "Fitering Data Example",
							autoSelect: {tab: "filtering"},
							enableFiltering: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age', type: 'number' }, 
								{ field: 'salary', enableFiltering: false }
							],
							data: jsonData
						}
					}
				}
			};
		}
	}
};
