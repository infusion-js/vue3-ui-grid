const uiDocsExample7 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample7.js = uiDocsCode.js('', '', `title: "Column Resizing Example",
        enableColumnResizing: true,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age', enableColumnResizing: false }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsColumnResizing'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Column Resizing allows resize a column to a desired width, by dragging and dropping them to specific point.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableColumnResizing</span>: <div class="goc">Default false, true to enable 
			column resizing, setting this option from gridOptions applies to all columns, setting it from columnDefs applies to 
			specific column only. </div>
		</div>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Column Resizing Example", </span>
			<span class="pl-50 blue">enableColumnResizing: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender' }, </span>
			<span class="pl-70 blue">{ field: 'age', enableColumnResizing: false } </span>
			<span class="pl-70">{ field: 'salary' }, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<p class="pt-05 pb-05">To capture column resize event, use "api.resizeable.on.columnResized(function(colDef, deltaSize) {})". </p>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pt-05 pb-15">To resize a column, Drag the column separator (&lt;-||-&gt; showed on mouse over at the end of each column header cell) 
			reached to desired width.</p>
		<ui-docs-tabs :html-code="uiDocsExample7.html" :css-code="uiDocsExample7.css" :json-code="uiDocsExample7.json" 
			:js-code="uiDocsExample7.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample7
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
							title: "Column Resizing Example",
							enableColumnResizing: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age', enableColumnResizing: false }, 
								{ field: 'salary' }
							],
							data: jsonData
						}
					}
				}
			};
		}
	}, beforeUnmount: function() {
	}
};
