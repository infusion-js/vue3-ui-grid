const uiDocsExample4_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample4_1.js = uiDocsCode.js('', '', `title: "Initial Filtering Example",
        enableFiltering: true,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender', filter: { value: '1', type: 'select', 
            selectOptions: [{ value: '1', label: 'male' }, { value: '2', label: 'female' }]},
            cellFilter: function mapGender (input) {return (!input) ? '' : (input === 'male') ? 1 : 2;}
          }, 
          { field: 'age', type: 'number' }, 
          { field: 'salary', enableFiltering: false }
        ]`);


uiDocsComponents['uiDocsInitialFiltering'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>To achieve initial filtering before loading grid data...</p>
		<p class="pt-05 pb-05">To apply initial filtering for specific column, include 'filter' object (with type, condition and value) in columnDefs, 
			<p class="pt-00 pb-00">Type is filter input type, it can be 'text', 'number', 'date' or 'select'. </p>
			<p class="pt-00 pb-00">Condition tells how to filter:- </p>
			<p class="pl-15 pt-00 pb-00">For type 'text', Conditions should be Contains[*], Equals[=], Starts With[^] or Ends With[$] </p>
			<p class="pl-15 pt-00 pb-00">For type 'number', Conditions should be Greaterthan[&gt;], Greaterthan or Equals[&gt;=], Lessthan[&lt;], 
				Lessthan or Equals[&lt;=], Equals[=] or Not Equals[!=] </p>
			<p class="pl-15 pt-00 pb-00">For types 'date' and 'select', there are no conditions. </p>
		</p>
		<p class="pb-05">Cell Filter can be a function, which will be applied to specific column, while loading data. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Initial Filtering Example", </span>
			<span class="pl-50 blue">enableFiltering: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70 blue">{ field: 'gender', filter: { value: '', type: 'select', selectOptions: [ </span>
			<span class="pl-90 blue"> {value: '', label: 'Select Gender...'},{value: 'male', label: 'male'}, {value: 'female', label: 'female'}] } </span>
			<span class="pl-70 blue">}, </span>
			<span class="pl-70 blue">{ field: 'age', type: 'number' } </span>
			<span class="pl-70 blue">{ field: 'salary', enableFiltering: false }, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample4_1.html" :css-code="uiDocsExample4_1.css" :json-code="uiDocsExample4_1.json" 
			:js-code="uiDocsExample4_1.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample4_1
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
							title: "Initial Filtering Example",
							autoSelect: {tab: "filtering", field: 'gender'},
							enableFiltering: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender', filter: { value: '', type: 'select', selectOptions: [{ value: '', label: 'Select Gender...' }, 
									{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }] }
								}, 
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
