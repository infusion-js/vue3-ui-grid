const uiDocsExample8 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample8.js = uiDocsCode.js('', '', `title: "Column Moving Example",
        enableColumnMoving: true,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender', enableColumnMoving: false }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsColumnMoving'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Column Moving allows moving a column to different position, by dragging and dropping them to another position.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableColumnMoving</span>: <div class="goc">Default false, true to enable 
			column moving, setting this option from gridOptions applies to all columns, setting it from columnDefs applies to 
			specific column only. </div>
		</div>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Column Moving Example", </span>
			<span class="pl-50 blue">enableColumnMoving: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender' }, </span>
			<span class="pl-70 blue">{ field: 'age', enableColumnMoving: false } </span>
			<span class="pl-70">{ field: 'salary' }, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<p class="pt-15 pb-05">To manually change/move a column to specific position, use "api.colMovable.moveColumn(oldPosition, newPosition)", 
			The column position ranging from 0 (First) up to number of visible columns in the Grid. 
			<p class="pt-05 pb-00">For Example: "api.colMovable.moveColumn(2, 1)", will move column 2 (age) to column 2. </p> 
			<p class="pt-05 pb-00">To capture column move event, use "api.colMovable.on.columnPositionChanged(function(colDef, 
				originalPosition, newPosition) {})". </p>
		</p>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pt-05 pb-15">To move a column, hover on column header, cursor changes to move to identify that column is ready for move.</p>
		<ui-docs-tabs :html-code="uiDocsExample8.html" :css-code="uiDocsExample8.css" :json-code="uiDocsExample8.json" 
			:js-code="uiDocsExample8.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample8
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
							title: "Column Moving Example",
							enableColumnMoving: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender', enableColumnMoving: false }, 
								{ field: 'age' }, 
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
