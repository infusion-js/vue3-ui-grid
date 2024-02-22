const uiDocsExample12 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''},
		uiDocsExample12_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample12.js = uiDocsCode.js('', '', `title: "Expandable Rows Example",
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ],
        rowExpandableOptions: function(row) {
          return row.setRowExpandableOptions({
            columnDefs: [
              { field: 'name' },
              { field: 'gender' },
              { field: 'age' }
            ],
            data: row.data.friends
          });
        }`);

uiDocsExample12_1.js = uiDocsCode.js('', '', `title: "Fetch External Data Example",
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ],
        rowExpandableOptions: function(row) {
          //Do HTTP call here to fetch data from server instead of setTimeout.
          setTimeout(function() {
            return row.setRowExpandableOptions({
              columnDefs: [
                { field: 'name' },
                { field: 'gender' },
                { field: 'age' }
              ],
              data: row.data.friends
            });
          }, 2500);
        }`);


uiDocsComponents['uiDocsExpandableRows'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Expandable Rows feature allows to show inner details for main row.</p>
		<p class="pt-05 pb-05"><span class="brown bold">For Example</span>, This feature can be used to show bundle header as main row and 
			products belongs to bundle as expandable rows, or an employee as main row and groups subscribed to employee as expandable rows etc., 
		</p> 
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">rowExpandableOptions</span>: <div class="goc">Default null, value should be
			a function that should return options object containing columnDefs and data using setRowExpandableOptions method of row. </div>
		</div>
		<p class="pt-15 pb-05">The columnDefs defined for 'rowExpandableOptions' is almost similar to columnDefs defined for gridOptions, 
			and data defined here might be an inner data object exists in main data defined for gridOptions, or this data can be 
			fetched from server also on demand. </p> 
		</p>
		<p class="bold">Sample JSON strucutre that contains friends dataObj as inner data object is as below:</p>
		<div class="highlight">
			<span class="pl-30">var empData = [ </span>
			<span class="pl-50">{  </span>
			<span class="pl-70">name: "Harrell Gaines", </span>
			<span class="pl-70">gender: "male", </span>
			<span class="pl-70">age: 30, </span>
			<span class="pl-70">... </span>
			<span class="pl-70 green">friends: [ </span>
			<span class="pl-90 green">{ name: 'Mcdowell Bryan', gender: "male", age: 43, ... }, </span>
			<span class="pl-90 green">{ name: 'Janelle Mcintosh', gender: "female", age: 28, ... }, </span>
			<span class="pl-90 green">{ name: 'Perkins Kaufman', gender: "male", age: 35, ... } </span>
			<span class="pl-70 green">], </span>
			<span class="pl-50">}, </span>
			<span class="pl-50">... </span>
			<span class="pl-30">]; </span>
		</div>
		<p class="bold pt-15">Sample gridOptions declaration is as below:-</p>
		<p class="pt-05 pb-15">The 'rowExpandableOptions' should be a function that has row as parmeter.
			<p class="pt-00 pb-00">This function should return respective columnDefs and data using 'setRowExpandableOptions' method of 
				that particular row. </p> 
		</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Expandable Rows Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' }, </span>
			<span class="pl-70">{ field: 'salary'} </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">rowExpandableOptions: function(row) { </span>
			<span class="pl-70 blue">return row.setRowExpandableOptions({ </span>
			<span class="pl-90 blue">columnDefs: [ </span>
			<span class="pl-110 blue">{ field: 'name' }, </span>
			<span class="pl-110 blue">{ field: 'gender'}, </span>
			<span class="pl-110 blue">{ field: 'age' } </span>
			<span class="pl-90 blue">], </span>
			<span class="pl-90 blue">data: row.data.friends </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pt-05 pb-15">In this Example, Notice here, clicking on plus (+) icon showed on left side of grid in column header allows to 
			expand all rows in grid at once, To collapse all rows click on Minus (-) showed in place of plus, And +/- sign showed on each 
			row  will expand/collapse that specific row only in grid.
		</p>
		<ui-docs-tabs :html-code="uiDocsExample12.html" :css-code="uiDocsExample12.css" :json-code="uiDocsExample12.json" 
			:js-code="uiDocsExample12.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-10"></div>
		
		<h2>Fetch External Data for Expandable Rows</h2>
		<p class="pb-15">To set external data for a row, Embed return statement of 'row.setRowExpandableOptions' inside a http call, 
			and capture its response data as data for row expandable options as showed below.
		</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Expandable Rows with External Data Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' }, </span>
			<span class="pl-70">{ field: 'salary'} </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">rowExpandableOptions: function(row) { </span>
			<span class="pl-70 green">//Get row expandable data from server... </span>
			<span class="pl-70 green">//$http.get(URL, options).then(function(response) { </span>
			<span class="pl-90 blue">return row.setRowExpandableOptions({ </span>
			<span class="pl-110 blue">columnDefs: [ </span>
			<span class="pl-130 blue">{ field: 'name' }, </span>
			<span class="pl-130 blue">{ field: 'gender'}, </span>
			<span class="pl-130 blue">{ field: 'age' } </span>
			<span class="pl-110 blue">], </span>
			<span class="pl-110 green">data: response.data </span>
			<span class="pl-90 blue">}); </span>
			<span class="pl-70 green">//});</span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample12_1.html" :css-code="uiDocsExample12_1.css" :json-code="uiDocsExample12_1.json" 
			:js-code="uiDocsExample12_1.js" :result="getResult2"></ui-docs-tabs>
		<div class="clear pb-50"></div>
		
	</div>`,
	data: function () {
		return {
			uiDocsExample12, uiDocsExample12_1
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
							title: "Expandable Rows Example",
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary' }
							],
							rowExpandableOptions: function(row) {
								return row.setRowExpandableOptions({
									columnDefs: [
										{ field: 'name' },
										{ field: 'gender' },
										{ field: 'age' }
									],
									data: row.data.friends
								});
							},
							data: jsonData
						}
					}
				}
			};
		}, 
		getResult2: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Fetch External Data Example",
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary' }
							],
							rowExpandableOptions: function(row) {
								setTimeout(function() {
									return row.setRowExpandableOptions({
										columnDefs: [
											{ field: 'name' },
											{ field: 'gender' },
											{ field: 'age' }
										],
										data: row.data.friends
									});
								}, 2500);
							}, 
							data: jsonData
						}
					}
				}
			};
		}
	}
};
