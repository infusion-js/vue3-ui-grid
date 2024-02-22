const uiDocsExample9_3 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample9_3.js = uiDocsCode.js('', '', `title: "Pagination Links Example",
        enablePagination: true,
        enablePageLinks: true,
        paginationPageSizes: [10, 20, 50],
        paginationPageSize: 10,
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsPaginationLinks'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Pagination showed in previous examples is Simple Pagination with previous and next buttons and current page can be edited.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enablePageLinks</span>: <div class="goc">Default false, true to enable 
			pagination links feature, along with either "enablePagination" or "useExternalPagination" option. </div>
		</div>
		<p class="pt-15 pb-05">Using "enablePageLinks" feature, user can click on desired page link instead of entering page number in simple pagination. 
			<p class="pt-00 pb-00">Here also "paginationPageSizes", "paginationPageSize" and "paginationCurrentPage" 
				can be configured in gridOptions if require. </p> 
			<p class="pt-00 pb-00">In case "enablePageLinks" not available in gridOptions, default value of false enables simple pagination. </p>
		</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Pagination Links Example", </span>
			<span class="pl-50 blue">enablePagination: true, </span>
			<span class="pl-50 blue">enablePageLinks: true, </span>
			<span class="pl-50 blue">paginationPageSizes: [10, 20, 50], </span>
			<span class="pl-50 blue">paginationPageSize: 10, </span>
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
		<p class="pt-05 pb-15">In this Example, Notice here, in the middle of pagination bar, Page links were showed instead of navigation buttons.
			<p class="pt-00 pb-00">Clicking on specific page link takes to desired page, Here either previous or next arrows also can be clicked, 
				to show either previous or next page base on current page. </p>
		</p>
		<ui-docs-tabs :html-code="uiDocsExample9_3.html" :css-code="uiDocsExample9_3.css" :json-code="uiDocsExample9_3.json" 
			:js-code="uiDocsExample9_3.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample9_3
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
							title: "Pagination Links Example",
							enablePagination: true,
							enablePageLinks: true,
							paginationPageSizes: [10, 20, 50],
							paginationPageSize: 10,
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
