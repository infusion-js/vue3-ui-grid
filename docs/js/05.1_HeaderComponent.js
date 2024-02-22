const uiDocsExample5_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample5_1.css = uiDocsCode.css(`
.ui-grid-top-header {width: 100%; height: 22px; border: 1px solid #d4d4d4; background-color: lightgrey; 
	display: flex; align-items: center; justify-content: center; font-weight: bold;}`);
uiDocsExample5_1.js = uiDocsCode.js('', '', `title: "Custom Header Component Example",
        headerComponent: {
          template: \`<div class="ui-grid-top-header">Employeee Basic Details...</div>
            <div role="columnheader" class="ui-grid-column-header-cell ui-grid-clearfix" :class="getColClass(col)" 
                v-for="(col, colIndex) in colContainer.renderedColumns">
              <ui-grid-column-header-cell :grid="grid" :containerId="containerId" :colContainer="colContainer" 
                :col="col" :colIndex="colIndex"></ui-grid-column-header-cell>
            </div>\`
        }, 
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsHeaderComponent'] = {
    components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Below are key things to know before overriding Header Component and its template: </p>
		<p class="bold">Standard template for Header Component is as below:-</p>
		<p class="pb-05"><b>Note</b>:- Standard header functionality does not work as expected, in case if "ui-grid-column-header-cell" component has overriden here ! </p>
		<div class="highlight green">
			<span class="pl-30" v-pre>&lt;div role="columnheader" class="ui-grid-column-header-cell ui-grid-clearfix" :class="getColClass(col)" </span>
			<span class="pl-50" v-pre>v-for="(col, colIndex) in colContainer.renderedColumns"&gt; </span>
			<span class="pl-50" v-pre>&lt;ui-grid-column-header-cell :grid="grid" :containerId="containerId" :colContainer="colContainer"</span>
			<span class="pl-50" v-pre>:col="col" :colIndex="colIndex"&gt;&lt;/ui-grid-column-header-cell&gt;</span>
			<span class="pl-30" v-pre>&lt;/div&gt;</span>
		</div>
		<p class="bold">Header Component sample skeleton structure is as below:-</p>
		<p class="pb-05">Notice here, template is mandatory in this component and other component code is optional. In case of template not available, 
			<p class="pt-00">Custom Header Component is ignored and Standard Header Component and its template will be rendered. </p>
		</p>
		<div class="highlight green">
			<span class="pl-30" v-pre>headerComponent: {</span>
			<span class="pl-50" v-pre>template: "..."</span>
			<span class="pl-50" v-pre>/* Optional Properties.. */</span>
			<span class="pl-50" v-pre>data() {</span>
			<span class="pl-70" v-pre>return {</span>
			<span class="pl-90" v-pre>...</span>
			<span class="pl-70" v-pre>}</span>
			<span class="pl-50" v-pre>}, methods: {</span>
			<span class="pl-70" v-pre>...</span>
			<span class="pl-50" v-pre>}</span>
			<span class="pl-30" v-pre>}</span>
		</div>
		<p class="bold">Sample gridOptions declaration for Custom Header Component and its template, is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Custom Header Component Example", </span>
			<span class="pl-50 blue" v-pre>headerComponent: { </span>
			<span class="pl-70 blue" v-pre>template: \`&lt;div class="ui-grid-top-header"&gt;Employeee Basic Details...&lt;/div&gt; </span>
			<span class="pl-90 blue" v-pre> &lt;div role="columnheader" class="ui-grid-column-header-cell ui-grid-clearfix" :class="getColClass(col)"  </span>
			<span class="pl-110 blue" v-pre> v-for="(col, colIndex) in colContainer.renderedColumns"&gt;"+ </span>
			<span class="pl-110 blue" v-pre> &lt;ui-grid-column-header-cell :grid="grid" :containerId="containerId" :colContainer="colContainer"  </span>
			<span class="pl-130 blue" v-pre> :col="col" :colIndex="colIndex"&gt;&lt;/ui-grid-column-header-cell&gt; </span>
			<span class="pl-90 blue" v-pre> &lt;/div&gt;\`</span>
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
		<p class="pb-15">In this Example, Notice here, Header component had overridden with custom template for showing another header row 
			in grey background with text on top of existing column header.</p>
		<ui-docs-tabs :html-code="uiDocsExample5_1.html" :css-code="uiDocsExample5_1.css" :json-code="uiDocsExample5_1.json" 
			:js-code="uiDocsExample5_1.js" :result="getExample"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample5_1
		}
	}, computed: {
		getExample: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
					.ui-grid-top-header {width: 100%; height: 22px; border: 1px solid #d4d4d4; background-color: lightgrey; 
						display: flex; align-items: center; justify-content: center; font-weight: bold;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Custom Header Component Example",
							headerComponent: {
								template: `<div class="ui-grid-top-header">Employeee Basic Details...</div>
									<div role="columnHeader" class="ui-grid-column-header-cell ui-grid-clearfix" :class="getColClass(col)" 
											v-for="(col, colIndex) in colContainer.renderedColumns">
										<ui-grid-column-header-cell :grid="grid" :containerId="containerId" :colContainer="colContainer" 
											:col="col" :colIndex="colIndex"></ui-grid-column-header-cell>
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

