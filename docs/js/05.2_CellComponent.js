const uiDocsExample5_2 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample5_2.css = uiDocsCode.css(`
.clickable {color: blue; cursor: pointer;}`);
uiDocsExample5_2.js = uiDocsCode.js('', '', `title: "Custom Row Cell Component Example",
        columnDefs: [
          { field: 'name', cellComponent: {
              template: \`<span class="clickable" @click="showMessage">{{row.data[col.field]}}</span>\`,
              data() {
                return {
                  message: 'Hello '
                }
              }, methods: {
                showMessage: function() {
                  alert(this.message + this.row.data[this.col.field]);
                }
              }
            }
          }, 
          { field: 'gender', cellTooltip: 'Gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsCellComponent'] = {
    components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Below are key things to know before overriding Row Cell Component and its template: </p>
		<p class="bold">Standard template for Row Cell Component is as below:-</p>
		<div class="highlight green">
			<span class="pl-30" v-pre>&lt;span class="ui-grid-cell-content"&gt;{{grid.getCellValue(row, col)}}&lt;/span&gt;</span>
		</div>
		<p class="bold">Custom Row Cell Component sample skeleton structure is as below:-</p>
		<p class="pb-05">Notice here, template is mandatory in this component and other component code is optional. In case of template not available, 
			<p class="pt-00">Custom Row Cell Component is ignored and Standard Row Cell Component and its template will be rendered. </p>
		</p>
		<div class="highlight green">
			<span class="pl-30" v-pre>cellComponent: {</span>
			<span class="pl-50" v-pre>template: "..."</span>
			<span class="pl-50 black" v-pre>/* Optional Properties.. */</span>
			<span class="pl-50" v-pre>data() {</span>
			<span class="pl-70" v-pre>return {</span>
			<span class="pl-90" v-pre>...</span>
			<span class="pl-70" v-pre>}</span>
			<span class="pl-50" v-pre>}, methods: {</span>
			<span class="pl-70" v-pre>...</span>
			<span class="pl-50" v-pre>}</span>
			<span class="pl-30" v-pre>}</span>
		</div>
		<p class="bold">Sample gridOptions declaration for Custom Row Cell Component and its template, is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Custom Row Cell Component Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70 blue">{ field: 'name', cellComponent: { </span>
			<span class="pl-90 blue" v-pre>template: \`&lt;span class="clickable" @click="showMessage">{{row.data[col.field]}}&lt;/span&gt;\`, </span>
			<span class="pl-90 blue">data() { </span>
			<span class="pl-110 blue">return { </span>
			<span class="pl-130 blue">message: 'Hello ' </span>
			<span class="pl-110 blue">} </span>
			<span class="pl-90 blue">}, methods: { </span>
			<span class="pl-110 blue">showMessage: function() { </span>
			<span class="pl-130 blue">alert(this.message + this.row.data[this.col.field]); </span>
			<span class="pl-110 blue">} </span>
			<span class="pl-90 blue">} </span>
			<span class="pl-70 blue">}, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, Cell component for column 'Name' had overridden with custom template to make cell content clickable, 
			On click of cell content, an alert message will be showed from showMessage method of its custom component.</p>
		<ui-docs-tabs :html-code="uiDocsExample5_2.html" :css-code="uiDocsExample5_2.css" :json-code="uiDocsExample5_2.json" 
			:js-code="uiDocsExample5_2.js" :result="getExample"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample5_2
		}
	}, computed: {
		getExample: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
					.clickable {color: blue; cursor: pointer;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Custom Row Cell Component Example",
							columnDefs: [
								{ field: 'name', cellComponent: {
										template: `<span class="clickable" @click="showMessage">{{row.data[col.field]}}</span>`,
										data() {
											return {
												message: 'Hello '
											}
										}, methods: {
											showMessage: function() {
												alert(this.message + this.row.data[this.col.field]);
											}
										}
									}
								}, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary' }
							],
							data: jsonData
						}
					}
				}
			};
		},
	}
};

