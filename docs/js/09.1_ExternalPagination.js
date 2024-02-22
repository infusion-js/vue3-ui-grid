const uiDocsExample9_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample9_1.js = uiDocsCode.js('', '', `title: "External Pagination Example",
        useExternalPagination: true,
        paginationTotalItems: 500,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ],
        onChangeApi: function( api ) {
          api.pagination.on.paginationChanged( function(grid) {
            var pageNumber = grid.options.paginationCurrentPage, pageSize = grid.options.paginationPageSize;
            var start = (pageNumber-1) * pageSize, end = pageNumber * pageSize;
            grid.refreshData(jsonData.slice(start, end));
          });
        }`);


uiDocsComponents['uiDocsExternalPagination'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>External Pagination can be used to fetch each page data from server side, rather from initial static data load of grid.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">useExternalPagination</span>: <div class="goc">Default false, true to enable 
			external pagination feature for all rows at once. </div>
		</div>
		<p class="pt-15 pb-05">In addition to this, initialize "data" to only first page data, but not entire static data and 
			"paginationTotalItems" to total record count, 
			<p class="pt-00 pb-00">Whenever user clicked on previous or next or first or last page buttons, or change in "Items per page" select box, </p> 
			<p class="pt-00 pb-00">It raises 'paginationChanged' event with grid as a parameter, inside 'onChangeApi' function in grid options, </p>
			<p class="pt-00 pb-00">a server call can be performed (pageNumber and pageSize can be extracted from options property of grid parameter) </p> 
			<p class="pt-00 pb-00">here, to receive specific page data from server. </p> 
		</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "External Pagination Example", </span>
			<span class="pl-50 blue">useExternalPagination: true, </span>
			<span class="pl-50 blue">paginationTotalItems: 500, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 blue">api.pagination.on.paginationChanged( function(grid) { </span>
			<span class="pl-90 blue">var pageNumber = grid.options.paginationCurrentPage, pageSize = grid.options.paginationPageSize; </span>
			<span class="pl-90 green">//perform a server call to fecth data for specific pageNumber with pageSize to show in selected page. </span>
			<span class="pl-90 blue">grid.refreshData(selectedPageData); </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50 blue">data: jsonData.slice(0, 10) </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample9_1.html" :css-code="uiDocsExample9_1.css" :json-code="uiDocsExample9_1.json" 
			:js-code="uiDocsExample9_1.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample9_1
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
							title: "External Pagination Example",
							useExternalPagination: true,
							paginationTotalItems: 500,
							enablePageLinks: false,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary' }
							],
							onChangeApi: function( api ) {
								api.pagination.on.paginationChanged(function(grid) {
									var pageNumber = grid.options.paginationCurrentPage, pageSize = grid.options.paginationPageSize;
									var start = (pageNumber-1) * pageSize, end = pageNumber * pageSize;
						            grid.refreshData( jsonData.slice(start, end) );
								});
							},
							data: jsonData.slice(0, 10)
						}
					}
				}
			};
		}
	}
};
