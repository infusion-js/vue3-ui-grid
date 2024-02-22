const uiDocsExample5_3 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample5_3.css = uiDocsCode.css(`
.red-bckg {background-color: #ff1a1a!important; color: white;}`);
uiDocsExample5_3.js = uiDocsCode.js('', '', `title: "Custom Row Component Example",
        rowComponent: {
          template: \`<div role="rowCellContainer" class="ui-grid-row-cell" v-for="(col, colIndex) in colContainer.renderedColumns" 
              :class="[getColClass(col), { 'ui-grid-row-header-cell': col.isRowHeader, 'red-bckg': row.data.age > 35 }]">
            <ui-grid-row-cell :grid="grid" :row="row" :col="col" :rowIndex="rowIndex" :colIndex="colIndex"></ui-grid-row-cell>
          </div>\` 
        }, 
        columnDefs: [
          { field: 'name" }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);

uiDocsComponents['uiDocsRowComponent'] = {
    components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Below are key things to know before overriding Row Component and its template: </p>
		<p class="bold">Standard template for Row Component is as below:-</p>
		<p class="pb-05"><b>Note</b>:- Standard cell functionality does not work as expected, in case if "ui-grid-row-cell" component has overriden here ! </p>
		<div class="highlight green">
			<span class="pl-30" v-pre>&lt;div role="rowCellContainer" class="ui-grid-row-cell" v-for="(col, colIndex) in colContainer.renderedColumns" </span>
			<span class="pl-50" v-pre>:class="[getColClass(col), { 'ui-grid-row-header-cell': col.isRowHeader }]"&gt; </span>
			<span class="pl-50" v-pre>&lt;ui-grid-row-cell :grid="grid" :row="row" :col="col" :rowIndex="rowIndex" :colIndex="colIndex"&gt;&lt;/ui-grid-row-cell&gt;</span>
			<span class="pl-30" v-pre>&lt;/div&gt;</span>
		</div>
		<p class="bold">Custom Row Component sample skeleton structure is as below:-</p>
		<p class="pb-05">Notice here, template is mandatory in this component and other component code is optional. In case of template not available, 
			<p class="pt-00">Custom Row Component is ignored and Standard Row Component and its template will be rendered. </p>
		</p>
		<div class="highlight green">
			<span class="pl-30" v-pre>rowComponent: {</span>
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
		<p class="bold">Sample gridOptions declaration for Custom Row Component and its template, is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Custom Row Component Example", </span>
			<span class="pl-50 blue" v-pre>rowComponent: { </span>
			<span class="pl-70 blue" v-pre>template: \`&lt;div role="rowCellContainer" class="ui-grid-row-cell" v-for="(col, colIndex) in colContainer.renderedColumns"  </span>
			<span class="pl-110 blue" v-pre> :class="[getColClass(col), { 'ui-grid-row-header-cell': col.isRowHeader, <strong>'red-bckg': row.data.age > 35 </strong> }]"&gt; </span>
			<span class="pl-90 blue" v-pre> &lt;ui-grid-row-cell :grid="grid" :row="row" :col="col" :rowIndex="rowIndex" :colIndex="colIndex"&gt;&lt;/ui-grid-row-cell&gt; </span>
			<span class="pl-70 blue" v-pre> &lt;/div&gt;\` </span>
			<span class="pl-50 blue" v-pre>}, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' } </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, Row component had overridden with custom template to highlight each row with, 
			background color as red and font color as white, in case if persons age is more than 35.</p>
		<ui-docs-tabs :html-code="uiDocsExample5_3.html" :css-code="uiDocsExample5_3.css" :json-code="uiDocsExample5_3.json" 
			:js-code="uiDocsExample5_3.js" :result="getExample"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample5_3
		}
	}, computed: {
		getExample: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
					.red-bckg {background-color: #ff1a1a!important; color: white;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Custom Row Component Example",
							rowComponent: {
								template: `<div role="rowCellContainer" class="ui-grid-row-cell" v-for="(col, colIndex) in colContainer.renderedColumns" 
									:class="[getColClass(col), { 'ui-grid-row-header-cell': col.isRowHeader, 'red-bckg': row.data.age > 35 }]">
									<ui-grid-row-cell :grid="grid" :row="row" :col="col" :rowIndex="rowIndex" :colIndex="colIndex"></ui-grid-row-cell>
								</div>` 
							}, 
							columnDefs: [
								{ field: 'name' }, 
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

