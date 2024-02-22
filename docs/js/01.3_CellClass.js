const uiDocsExample1_3 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample1_3.css = uiDocsCode.css(`
.c-red-b-ylw {color: red;  background-color:yellow!important; font-weight: bold;}
.c-blue {color: blue; font-weight: bold;}
.c-red {color: red; font-weight: bold;}`);
uiDocsExample1_3.js = uiDocsCode.js('', '', `title: "Cell Class Example", 
        enableColumnFooter: true, 
        columnDefs: [
          { field: 'name', cellClass: 'c-red-b-ylw', footerCellClass: 'c-blue', 
            aggregationType: $$util.constants.aggregation.COUNT }, 
          { field: 'gender', headerCellClass: 'c-blue' }, 
          { field: 'age', aggregationType: $$util.constants.aggregation.AVG, 
            cellClass: function(grid, row, col) {
              return (grid.getCellValue(row, col) > 25) ? 'c-red' : '';
            },
            footerCellClass: function(grid, col) {
              return (col.aggregationValue > 30) ? 'c-red' : 'c-blue';
            }
          }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsCellClass'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="pb-05">Class name or function returning a class name based on a condition, can be assigned to each columnDef 
			in gridOptions, as a Cell Class or Header Cell Class or Footer Cell Class. To notice Footer cell class feature is working or not, 
			set "enableColumnFooter" to true in gridOptions, to see column footer. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Cell Class Example", </span>
			<span class="pl-50 blue">enableColumnFooter: true, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70 blue">{ field: 'name', cellClass: 'c-red-b-ylw', footerCellClass: 'c-blue', </span>
			<span class="pl-90 blue">aggregationType: $$util.constants.aggregation.COUNT }, </span>
			<span class="pl-70 blue">{ field: 'gender', headerCellClass: 'c-blue'}, </span>
			<span class="pl-70 blue">{ field: 'age', aggregationType: $$util.constants.aggregation.AVG, cellClass: function(grid, row, col) { </span>
			<span class="pl-90 blue">cellClass: function(grid, row, col) { </span>
			<span class="pl-110 blue">return (grid.getCellValue(row, col) > 25) ? 'c-red' : ''; </span>
			<span class="pl-90 blue">}, </span>
			<span class="pl-90 blue">footerCellClass: function(grid, col) { </span>
			<span class="pl-110 blue">return (col.aggregationValue > 30) ? 'c-red' : 'c-blue'; </span>
			<span class="pl-90 blue">}, </span>
			<span class="pl-70 blue">}, </span>
			<span class="pl-70">{ field: 'salary'} </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, For 'Name' column, Cell class assigned red color with yellow background and 
			Footer cell class assigned blue color to Footer aggregation text and For 'Gender' column,  
			Header cell class assigned blue color and For 'Age' column Cell class function assigns red color 
			only when age is greater than 25 and Footer cell class function assigns red color 
			to Footer aggregation text, when aggregation AVG value of Age is greater than 30. </p>
		<ui-docs-tabs :html-code="uiDocsExample1_3.html" :css-code="uiDocsExample1_3.css" :json-code="uiDocsExample1_3.json" 
			:js-code="uiDocsExample1_3.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample1_3
		}
	}, computed: {
		getResult: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
					.c-red-b-ylw { color: red;  background-color: yellow!important; font-weight: bold; }
					.c-blue {color: blue; font-weight: bold;}
					.c-red {color: red; font-weight: bold;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Cell Class Example",
							enableColumnFooter: true, 
							columnDefs: [
								{ field: 'name', cellClass: 'c-red-b-ylw', footerCellClass: 'c-blue', 
									aggregationType: $$util.constants.aggregation.COUNT }, 
								{ field: 'gender', headerCellClass: 'c-blue' }, 
								{ field: 'age', aggregationType: $$util.constants.aggregation.AVG, 
									cellClass: function(grid, row, col) {
										return (grid.getCellValue(row, col) > 25) ? 'c-red' : '';
									},
									footerCellClass: function(grid, col) {
										return (col.aggregationValue > 30) ? 'c-red' : 'c-blue';
									}
								}, 
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
