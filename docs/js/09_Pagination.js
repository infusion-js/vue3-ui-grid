const uiDocsExample9 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample9.js = uiDocsCode.js('', '', `title: "Pagination Example",
        enablePagination: true,
        paginationPageSizes: [50, 100, 200],
        paginationPageSize: 50,
        paginationCurrentPage: 5, 
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsPagination'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Pagination is a process of dividing number of rows in to discrete pages for the purpose of avoiding a long scroll.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enablePagination</span>: <div class="goc">Default false, true to enable 
			pagination feature for all rows at once. </div>
		</div>
		<p class="pt-15 pb-05">Default current or start page is 1, set "paginationCurrentPage: 5" in gridOptions, to show 5th page directly 
			on initial grid load, 
			<p class="pt-00 pb-00">How many rows can be showed per page can be controlled using "paginationPageSizes" feature. </p> 
			<p class="pt-00 pb-00">Default paginationPageSizes will be available as [10, 50, 100], it can be changed in gridOptions as desired. </p>
			<p class="pt-00 pb-00">Default paginationPageSize is 10, it can also be changed by setting "paginationPageSize: 50" to show 50 rows per page. </p> 
		</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Pagination Example", </span>
			<span class="pl-50 blue">enablePagination: true, </span>
			<span class="pl-50 blue">paginationPageSizes: [50, 100, 200], </span>
			<span class="pl-50 blue">paginationPageSize: 50, </span>
			<span class="pl-50 blue">paginationCurrentPage: 5, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pt-05 pb-15">In this Example, Notice here, "Items per page" is selected as 50, as per "paginationPageSize" configuration, 
			and "Items per page" contains 50, 100 and 200 as per "paginationPageSizes" configuration.
			<p class="pt-00 pb-00">Starting page is 5 as per paginationCurrentPage configuration showed in the form of text box 
				on middle of pagination bar. </p>
		</p>
		<ui-docs-tabs :html-code="uiDocsExample9.html" :css-code="uiDocsExample9.css" :json-code="uiDocsExample9.json" 
			:js-code="uiDocsExample9.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample9
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
							title: "Pagination Example",
							enablePagination: true,
							paginationPageSizes: [50, 100, 200],
							paginationPageSize: 50,
							paginationCurrentPage: 5, 
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
