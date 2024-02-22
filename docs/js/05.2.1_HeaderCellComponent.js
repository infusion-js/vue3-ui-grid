const uiDocsExample5_2_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample5_2_1.css = uiDocsCode.css(`
.ui-grid-column-header-cell-select {width: 39%; height: 20px; margin: 0 8px;border: none;}
.ui-grid-column-header-cell-select:focus {outline: none; box-shadow: none!important;}`);
uiDocsExample5_2_1.js = uiDocsCode.js('', '', `title: "Custom Header Cell Component Example",
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary', headerCellComponent: {
              template: \`<span class="ui-grid-cell-content" :title="col.headerTooltip ? col.headerTooltip(col) : ''">
                	{{col.displayName}}
                </span>
                <select class="ui-grid-column-header-cell-select" v-model="selected" @change="processCurrencies()">
                	<option v-for="ccs in currencies" :key="ccs.key" :value="ccs.key" v-html="ccs.value"></option>
                </select>\`,
              data() {
                return {
                  selected: 'USD', 
                  currencies: [{key: 'USD', value: '&#36; - USD'}, {key: 'EUR', value: '&#8364; - EUR'}, 
                    {key: 'GBP', value: '&#163; - GBP'}, {key: 'INR', value: '&#8377; - INR'}], 
                  xRates: {INR: 83.35, EUR: 0.936, GBP: 0.818}
                }
              }, methods: {
                processCurrencies: function() {
                  var self=this, data = jsonData.map(function(employee) {
                    let emp = Object.assign({}, employee);
                    emp.salary = Math.round( (self.selected == 'USD') ? emp.salary : 
                      emp.salary * self.xRates[self.selected] );
                    return emp;
                  });
                  this.grid.refreshData(data);
                }
              }
            }
          }
        ]`);


uiDocsComponents['uiDocsHeaderCellComponent'] = {
    components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Below are key things to know before overriding Header Cell Component and its template: </p>
		<p class="bold">Standard template for Header Cell Component is as below:-</p>
		<div class="highlight green">
			<span class="pl-30" v-pre>&lt;span class="ui-grid-cell-content"&gt;{{col.displayName}}&lt;/span&gt;</span>
		</div>
		<p class="bold">Header Cell Component sample skeleton structure is as below:-</p>
		<p class="pb-05">Notice here, template is mandatory in this component and other component code is optional. In case of template not available, 
			<p class="pt-00">Custom Header Component is ignored and Standard component and its template can be rendered. </p>
		</p>
		<div class="highlight green">
			<span class="pl-30" v-pre>headerCellComponent: {</span>
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
		<p class="bold">Sample gridOptions declaration for Custom Header Cell Component and its Template, is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Custom Header Cell Component Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' } </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' }, </span>
			<span class="pl-70 blue">{ field: 'salary', headerCellComponent: { </span>
			<span class="pl-90 blue" v-pre>template: \`&lt;span class="ui-grid-cell-content"&gt;{{col.displayName}}&lt;/span&gt; </span>
			<span class="pl-110 blue" v-pre> &lt;select class="ui-grid-column-header-cell-select" v-model="selected" @change="processCurrencies()"&gt; </span>
			<span class="pl-130 blue" v-pre> &lt;option v-for="ccs in currencies" :key="ccs.key" :value="ccs.key" v-html="ccs.value"&gt;&lt;/option&gt; </span>
			<span class="pl-110 blue" v-pre> &lt;/select&gt;\`, </span>
			<span class="pl-90 blue" v-pre>data() { </span>
			<span class="pl-110 blue" v-pre>return { </span>
			<span class="pl-130 blue" v-pre>selected: 'USD', </span>
			<span class="pl-130 blue" v-pre>currencies: [{key: 'USD', value: '&#36; - USD'}, {key: 'EUR', value: '&#8364; - EUR'},  </span>
			<span class="pl-150 blue" v-pre>{key: 'GBP', value: '&#163; - GBP'}, {key: 'INR', value: '&#8377; - INR'}], </span>
			<span class="pl-130 blue" v-pre>xRates: {INR: 83.35, EUR: 0.936, GBP: 0.818} </span>
			<span class="pl-110 blue" v-pre>} </span>
			<span class="pl-90 blue" v-pre>}, methods: { </span>
			<span class="pl-110 blue" v-pre>processCurrencies: function() { </span>
			<span class="pl-130 blue" v-pre>var self=this, data = jsonData.map(function(employee) { </span>
			<span class="pl-150 blue" v-pre>let emp = Object.assign({}, employee); </span>
			<span class="pl-150 blue" v-pre>emp.salary = Math.round((self.selected=='USD')? emp.salary : emp.salary * self.xRates[self.selected]); </span>
			<span class="pl-150 blue" v-pre>return emp; </span>
			<span class="pl-130 blue" v-pre>}); </span>
			<span class="pl-130 blue" v-pre>this.grid.refreshData(data); </span>
			<span class="pl-110 blue" v-pre>} </span>
			<span class="pl-90 blue" v-pre>} </span>
			<span class="pl-70 blue" v-pre>}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, Header Cell component for column 'Salary' had overridden with custom template to show currencies 
			select box, next to header cell label 'Salary', On select of currency, Salary data will be refreshed in grid with selected currency.</p>
		<ui-docs-tabs :html-code="uiDocsExample5_2_1.html" :css-code="uiDocsExample5_2_1.css" :json-code="uiDocsExample5_2_1.json" 
			:js-code="uiDocsExample5_2_1.js" :result="getExample"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample5_2_1
		}
	}, computed: {
		getExample: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
					.ui-grid-column-header-cell-select {width: 39%; height: 20px; margin: 0 8px;border: none;}
					.ui-grid-column-header-cell-select:focus {outline: none; box-shadow: none!important;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Custom Header Cell Component Example",
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary', headerCellComponent: {
										template: `
											<span class="ui-grid-cell-content">{{col.displayName}}</span>
											<select class="ui-grid-column-header-cell-select" v-model="selected" @change="processCurrencies()">
												<option v-for="ccs in currencies" :key="ccs.key" :value="ccs.key" v-html="ccs.value"></option>
											</select>`,
										data() {
											return {
												selected: 'USD', 
												currencies: [{key: 'USD', value: '&#36; - USD'}, {key: 'EUR', value: '&#8364; - EUR'}, 
													{key: 'GBP', value: '&#163; - GBP'}, {key: 'INR', value: '&#8377; - INR'}], 
												xRates: {INR: 83.35, EUR: 0.936, GBP: 0.818}
											}
										}, methods: {
											processCurrencies: function() {
												var self=this, data = jsonData.map(function(employee) {
													let emp = Object.assign({}, employee);
													emp.salary = Math.round( (self.selected == 'USD') ? emp.salary : 
														emp.salary * self.xRates[self.selected] );
													return emp;
												});
												this.grid.refreshData(data);
											}
										}
									}
								}
							],
							data: jsonData
						}
					}
				}
			};
		}
	}
};

