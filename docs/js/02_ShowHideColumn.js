const uiDocsExample2 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample2.js = uiDocsCode.js('', '', `title: "Show/Hide Column Example",
        columnDefs: [
          { field: 'name', enableColumnHiding: false }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);
        

uiDocsComponents['uiDocsShowHideColumn'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>This feature is used to either show or hide a column from either gridOptions or columnDefs.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableColumnHiding</span>: <div class="goc">Default true, false to prevent 
			show/hide a column, setting this option from gridOptions applies to all columns, setting it from columnDefs 
			applies to specific column only. </div>
		</div>
		<p class="pt-15 pb-05">User can show or hide any column from Show/Hide grid tab or from column header menu also. When clicking on column box 
			in Show/Hide grid tab, respective column will hide if it is already showed, or it will show in grid if it is already hidden. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Show/Hide Column Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70 blue">{ field: 'name', enableColumnHiding: false }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, Due to 'enableColumnHiding' flag has set to false for 'Name' column in columnDefs, 
			So 'Name' column box does not appear in Show/Hide tab and "Hide Column" feature is not available in column menu also. i.e. "Name" column 
			has prevented from either show or hide user action.</p>
		<ui-docs-tabs :html-code="uiDocsExample2.html" :css-code="uiDocsExample2.css" :json-code="uiDocsExample2.json" 
			:js-code="uiDocsExample2.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample2
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
							title: "Show/Hide Column Example",
							autoSelect: {tab: "showhide"},
							columnDefs: [
								{ field: 'name', enableColumnHiding: false }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
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
