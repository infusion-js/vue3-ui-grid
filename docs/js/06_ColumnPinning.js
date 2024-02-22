const uiDocsExample6 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample6.js = uiDocsCode.js('', '', `title: "Column Pinning Example",
        enableColumnPinning: true,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender', enableColumnPinning: false }, 
          { field: 'age', pinnedRight: true }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsColumnPinning'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Column Pinning allows to pin a column to left or right.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableColumnPinning</span>: <div class="goc">Default false, true to enable 
			column pinning, setting this option from gridOptions applies to all columns, setting it from columnDefs applies to 
			specific column only. </div>
		</div>
		<p class="pt-15 pb-05">Set "hidePinLeft" to true in columnDefs, to avoid "Pin Left" feature available in menu for that column.
			<p class="pt-00 pb-00">Set "hidePinRight" to true in columnDefs, to avoid "Pin Right" feature available in menu for that column. </p>
			<p class="pt-00 pb-00">Set "pinnedLeft" to true in columnDefs, to initialize a column to pin left on initial grid load. </p> 
			<p class="pt-00 pb-00">Set "pinnedRight" to true in columnDefs, to initialize a column to pin right on initial grid load. </p> 
		</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<p>(For columns, pin left/right is disabled for name and all pinning feature disabled for gender and age pinned right when grid initial render)</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Column Pinning Example", </span>
			<span class="pl-50 blue">enableColumnPinning: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70 blue">{ field: 'name', hidePinLeft: true, hidePinRight: true }, </span>
			<span class="pl-70 blue">{ field: 'gender', enableColumnPinning: false }, </span>
			<span class="pl-70 blue">{ field: 'age', pinnedRight: true } </span>
			<span class="pl-70">{ field: 'salary' }, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<p class="pt-05 pb-05">To pin a column to left, right or none, use "api.pinning.pinColumn(col, direction)", direction 
			can either be LEFT or RIGHT or NONE.
			<p class="pt-00 pb-00">For Example: "api.pinning.pinColumn(col, 'LEFT')", will pin column to column left. </p>
			<p class="pt-00 pb-00">To capture column pin event, use "api.pinning.on.columnPinned(function(colDef) {})". </p> 
		</p>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pt-05 pb-15">Clicking on an icon at the end(right side) of each column header, opens up a column menu for that specific column.
			<p class="pl-15 pt-00 pb-00">Click on "Pin Left" in Column Menu to pin specific column to left. </p>
			<p class="pl-15 pt-00 pb-00">Click on "Pin Right" in Column Menu to pin specific column to right. </p> 
			<p class="pl-15 pt-00 pb-00">Click on "Unpin" in Column Menu to unpin specific column. </p> 
		</p>
		<ui-docs-tabs :html-code="uiDocsExample6.html" :css-code="uiDocsExample6.css" :json-code="uiDocsExample6.json" 
			:js-code="uiDocsExample6.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample6
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
							title: "Column Pinning Example",
							enableColumnPinning: true,
							columnDefs: [
								{ field: 'name', hidePinLeft: true, hidePinRight: true }, 
								{ field: 'gender', enableColumnPinning: false }, 
								{ field: 'age', pinnedRight: true }, 
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
