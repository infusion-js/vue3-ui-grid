const uiDocsExample2_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample2_1.js = uiDocsCode.js('', '', `title: "Column Views Example",
        columnViews: [
          { field: "Default", columns: ["name", "gender", "age", "designation", "salary"] },
          { field: "Designations", columns: ["name", "gender", "age", "designation"], selected: true },
          { field: "Salaries", columns: ["name", "gender", "age", "salary"] }
        ],
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'designation' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsColumnViews'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Column Views allows to restrict which columns has to be showed in Grid. </p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">columnViews</span>: <div class="goc">Default null, value should be an array of objects, 
			each object should contain "field", "columns" and "selected" properties, field should be column view name, columns should have list of 
			column fields belong to column view and selected is either true or false, true to select default column view. </div>
		</div>
		<p class="pt-15 pb-15">Column Views can be managed from Show/Hide grid tab only. First column view should be "Default" view that should contain 
			all columns available for specific user role. User can create new views from Default view(can give another name also), So this view is not 
			allowed to either be modified or deleted. New views can be created by clicking on Show/Hide columns from default view and can give new 
			name to save it as new view, Or can give already available view name to edit existing view. To delete existing view, 
			Click on Delete icon and confirm to delete existing view. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Column Views Example", </span>
			<span class="pl-50 blue" v-pre>columnViews: [ </span>
			<span class="pl-70 blue" v-pre>{ field: "Default", columns: ["name", "gender", "age", "designation", "salary"] },, </span>
			<span class="pl-70 blue" v-pre>{ field: "Designations", columns: ["name", "gender", "age", "designation"], selected: true }, </span>
			<span class="pl-70 blue" v-pre>{ field: "Salaries", columns: ["name", "gender", "age", "salary"] } </span>
			<span class="pl-50 blue" v-pre>], </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'designation' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, as per gridOptions, initial column view to be selected as 'Designations' view, 
			So 'Name', 'gender', 'age' and 'designation' columns from this view were showed in grid.</p>
		<ui-docs-tabs :html-code="uiDocsExample2_1.html" :css-code="uiDocsExample2_1.css" :json-code="uiDocsExample2_1.json" 
			:js-code="uiDocsExample2_1.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample2_1
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
							title: "Column Views Example",
							autoSelect: {tab: "showhide"},
							columnViews: [
								{ name: "Default", columns: ["name", "gender", "age", "designation", "salary"] },
								{ name: "Designations", columns: ["name", "gender", "age", "designation"], selected: true },
								{ name: "Salaries", columns: ["name", "gender", "age", "salary"] }
							],
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'designation' }, 
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
