const uiDocsExample9_2 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample9_2.js = uiDocsCode.js(utilFnStr, '', `title: "External Pagination, Sort and Filter Example",
        useExternalPagination: true,
        paginationTotalItems: 500,
        useExternalFiltering: true,
        useExternalSorting: true,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ],
        onChangeApi: function( api ) {
          api.core.on.filterChanged(function(grid, col) {
            utilFns.paginationOptions.grid = grid;
            utilFns.refreshPageData();
          });
          api.core.on.sortChanged(function(grid, sortCols) {
            if (sortCols.length > 0) {
              utilFns.paginationOptions.grid = grid;
              utilFns.paginationOptions.sortCols = sortCols;
              utilFns.refreshPageData();
            }
          });
          api.pagination.on.paginationChanged(function(grid) {
            utilFns.paginationOptions.grid = grid;
            utilFns.refreshPageData();
          });
        }`);


uiDocsComponents['uiDocsExternalPaginationSortFilter'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="pt-15 pb-05">When External Pagination has implemented, Either Sorting or Filtering can be performed with grid API for that page specific
			static data only, but not for entire server data, So it would be a better approach to implement, External Sorting and Filtering also
			along with External Pagination, to present actual data from server side.
			<p class="pt-05 pb-00">To achieve this, Use paginationOptions object that should contain pageNumber, pageSize, sort and filters properties, </p> 
			<p class="pt-00 pb-00">On capturing 'filterChanged'/'sortChanged'/'paginationChanged' event, assign source data to paginationOptions, 
				and call a common utility function on all these events to perform a server side call to fetch actual filtered, sorted 
				and specific page data from server.</p>
		</p>
		<p class="bold">Sample paginationOptions object might look like below:-</p>
		<div class="highlight">
			<span class="pl-30 green">const utilFns = { </span>
			<span class="pl-50 green">paginationOptions: { </span>
			<span class="pl-70 green">pageNumber: 1, </span>
			<span class="pl-70 green">pageSize: 10, </span>
			<span class="pl-70 green">sort: [ </span>
			<span class="pl-90 green">{field: 'name', direction: 'asc'}, {field; age, direction: 'desc'}, ... </span>
			<span class="pl-70 green">], </span>
			<span class="pl-70 green">filters: [ </span>
			<span class="pl-90 green">{field: 'age', condition: '&gt;', value: '25}, {field: 'age', condition: '&lt;=', value: '35}, ... </span>
			<span class="pl-70 green">], </span>
			<span class="pl-50 green">} </span>
			<span class="pl-30 green">} </span>
		</div>
		<p class="bold">Sample refreshPageData common utility function might look like below:-</p>
		<div class="highlight">
			<span class="pl-30 green">const utilFns = { </span>
			<span class="pl-50 green">paginationOptions = {pageNumber: 1, pageSize: 10, sort: [], filters: []}, </span>
			<span class="pl-50 green">refreshPageData: function () { </span>
			<span class="pl-70 green">//Do HTTP call for fecthing specific page data with sorting and filtering from server </span>
			<span class="pl-70 green">$http(URL, options).then( function (response) { </span>
			<span class="pl-90 green">//Return data w.r.to page, sort and filter options from server </span>
			<span class="pl-90 green">return response.data; </span>
			<span class="pl-70 green">}); </span>
			<span class="pl-50 green">} </span>
			<span class="pl-30 green">} </span>
		</div>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "External Pagination, Sort and Filter Example", </span>
			<span class="pl-50 blue">useExternalPagination: true, </span>
			<span class="pl-50 blue">paginationTotalItems: 500, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 blue">api.pagination.on.filterChanged( function(grid) { </span>
			<span class="pl-90 blue">utilFns.paginationOptions.pageNumber = grid.options.paginationCurrentPage; </span>
			<span class="pl-90 blue">utilFns.paginationOptions.pageSize = grid.options.paginationPageSize; </span>
			<span class="pl-90 green">//call common utility function for fecthing specific page data with sorting and filtering from server </span>
			<span class="pl-90 blue">utilFns.refreshPageData(); </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-70 blue">api.pagination.on.sortChanged( function(grid, sortCols) { </span>
			<span class="pl-90 blue">if (sortCols.length > 0) { </span>
			<span class="pl-110 blue">utilFns.paginationOptions.sort[0] = {field: sortCols[0].field, direction: sortCols[0].sort.direction}; </span>
			<span class="pl-90 green">//call common utility function for fecthing specific page data with sorting and filtering from server </span>
			<span class="pl-110 blue">utilFns.refreshPageData(); </span>
			<span class="pl-90 blue">} </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-70 blue">api.pagination.on.paginationChanged( function(grid) { </span>
			<span class="pl-90 blue">utilFns.paginationOptions.pageNumber = grid.options.paginationCurrentPage; </span>
			<span class="pl-90 blue">utilFns.paginationOptions.pageSize = grid.options.paginationPageSize; </span>
			<span class="pl-90 green">//call common utility function for fecthing specific page data with sorting and filtering from server </span>
			<span class="pl-90 blue">utilFns.refreshPageData(); </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50 blue">data: jsonData.slice(0, 10) </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample9_2.html" :css-code="uiDocsExample9_2.css" :json-code="uiDocsExample9_2.json" 
			:js-code="uiDocsExample9_2.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample9_2
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
							title: "External Pagination, Sort and Filter Example",
							useExternalPagination: true,
							paginationTotalItems: 500,
							useExternalFiltering: true,
							useExternalSorting: true,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary' }
							],
							onChangeApi: function( api ) {
								api.core.on.filterChanged(function(grid, col) {
									utilFns.paginationOptions.grid = grid;
									utilFns.refreshPageData();
								});
								api.core.on.sortChanged(function(grid, sortCols) {
									if (sortCols.length > 0) {
										utilFns.paginationOptions.grid = grid;
										utilFns.paginationOptions.sortCols = sortCols;
										utilFns.refreshPageData();
									}
								});
								api.pagination.on.paginationChanged(function(grid) {
									utilFns.paginationOptions.grid = grid;
									utilFns.refreshPageData();
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
