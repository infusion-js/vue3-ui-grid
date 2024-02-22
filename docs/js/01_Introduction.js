const uiDocsExample1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample1.js = uiDocsCode.js('', '', `title: "Basic Data Grid Example", 
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsIntroduction'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="pb-05">Vue Ui Grid is a light weight data management tool written in Vue JS, that displays data in a tabular format.</p>
		<p class="bold f18">Features:-</p>
		<ul><li>Virtual Scrolling,</li><li>Sorting</li><li>Filtering</li><li>Grouping</li><li>Column Pinning</li>
			<li>Column Resizing</li><li>Column Moving</li><li>Row Selection</li><li>Row Edit</li>etc.,</ul>
		<p class="bold">To implement Vue Ui Grid Component in your app, Define java script and css tags as showed below:-</p>
		<div class="highlight green">
			<span class="pl-30">&lt;link type="text/css" rel="stylesheet" href="vue-ui-grid.css" /&gt;</span>
			<span class="pl-30">&lt;script type="text/javascript" src="vue-v3.1.2.js"&gt;&lt;/script&gt;</span>
			<span class="pl-30">&lt;script type="text/javascript" src="vue-ui-grid.js"&gt;&lt;/script&gt;</span>
		</div>
		<p class="bold pt-15">Define grid dimensions (width and height) if needed, either in your app CSS styles, as showed below:-</p>
		<div class="highlight green">
			<span class="pl-30">.vue-ui-grid {width: 800px; height: 300px;}</span>
		</div>
		<p class="bold pt-15">Or can define in "vue-ui-grid" component element tag also, as showed below:-</p>
		<div class="pb-05"><span class="bold">Note</span>:- In case of, grid dimensions defined in both the places, style sheet defined in CSS 
			overrides element tag, In case of, not defined in both the places, Grid API will calculate them on its own.</div>
		<div class="highlight green">
			<span class="pl-30">&lt;vue-ui-grid :options='gridOptions' width='800px' height='300px'&gt;&lt;/vue-ui-grid&gt;</span>
		</div>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-10">It is mandatory to define <span class="green bold">gridOptions</span> to initialize and 
			load features for grid, gridOptions is a plain javascript object that should contain bare minimum options as columnDefs and data. 
			Column Definitions indicates what columns to be showed in header of grid and data is a JSON structured java script object 
			that should contain column specific data to be rendered in the form of rows in grid. </div>
		<p class="bold">Column Definitions:-</p>
		<div class="highlight pad-10"><span class="green bold">columnDefs</span> is a plain javascript object that should contain 
			columns specific data like field, title, visible and width etc., field represents a property in JSON data object defined for gridOptions,
			title is a column heading and visible is by default true or can set as false to prevent showing column in grid, and width represents
			width of a column in pixels to be entered as a number. </div>
		<p class="bold pt-15">Implement Vue Ui Grid component in your app as shown below:-</p>
		<div class="pb-05">Notice here, "vueUiGrid" component object registered inside components section, "vue-ui-grid" component element tag 
			embedded in template and "gridOptions" initialized inside data section of Vue Component.</div>
		<p class="pb-15"><span class="bold">For Example</span>: Below sample code has Column definitons name, gender, dob, and age, but dob column 
			is not visible in grid, due to its visible property is false, Data object contains data for column fields name, gender, dob, age and city, 
			although city is present in data but not available to grid, due to it has not defined in columnDefs. </p>
		<div class="highlight">
			<span class="pl-30">const app = Vue.createApp({ </span>
			<span class="pl-50 green">components: { 'vue-ui-grid': vueUiGrid }, </span>
			<span class="pl-50 green">template: \`&lt;vue-ui-grid :options='gridOptions'&gt;&lt;/vue-ui-grid&gt;\`, </span>
			<span class="pl-50">data() { </span>
			<span class="pl-70">return { </span>
			<span class="pl-90 green">gridOptions: { </span>
			<span class="pl-110 green">title: "Test Data Grid", </span>
			<span class="pl-110 green">columnDefs: [ </span>
			<span class="pl-130 green">{ field: 'name', width: "200"}, </span>
			<span class="pl-130 green">{ field: 'gender', cellTooltip: true}, </span>
			<span class="pl-130 green">{ field: 'dob', visible: false} </span>
			<span class="pl-130 green">{ field: 'age'} </span>
			<span class="pl-110 green">], </span>
			<span class="pl-110 green">data: [ </span>
			<span class="pl-130 green">{name: 'Laura Anderson', gender: 'female', age: 28, dob: "12/2/1995, 9:49:28", city: "Bladensburg"}, </span>
			<span class="pl-130 green">{name: 'Jimme Woods', gender: 'male', age: 25, dob: "18/6/1998, 11:23:48", city: "Springdale"}, </span>
			<span class="pl-130 green">{name: 'Michael Vinston', gender: 'female', age: 18, dob: "23/8/2005, 5:33:36", city: "Mappsville"}, </span>
			<span class="pl-130 green">{name: 'kathy Carlson', gender: 'male', age: 35, dob: "12/2/1988, 8:25:36", city: "Whitehaven"} </span>
			<span class="pl-110 green">] </span>
			<span class="pl-90 green">} </span>
			<span class="pl-70">} </span>
			<span class="pl-50">}, </span>
			<span class="pl-50">methods: { </span>
			<span class="pl-70">... </span>
			<span class="pl-50">} </span>
			<span class="pl-30">}); </span>
			<span class="pl-30">const vm = app.mount('#app'); </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample1.html" :css-code="uiDocsExample1.css" :json-code="uiDocsExample1.json" 
			:js-code="uiDocsExample1.js" :result="getBasicExample"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample1
		}
	}, computed: {
		getBasicExample: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Basic Data Grid Example",
							autoSelect: {tab: "showhide"},
							columnDefs: [
								{ field: 'name', width: '200'}, 
								{ field: 'gender', cellTolltip: true }, 
								{ field: 'dob', visible: false },
								{ field: 'age' } 
							],
							data: [
								{name: 'Laura Anderson', gender: 'female', age: 28, dob: "12/2/1995, 9:49:28", city: "Bladensburg"},  
								{name: 'Jimme Woods', gender: 'male', age: 25, dob: "18/6/1998, 11:23:48", city: "Springdale"},  
								{name: 'Michael Vinston', gender: 'female', age: 18, dob: "23/8/2005, 5:33:36", city: "Mappsville"},  
								{name: 'kathy Carlson', gender: 'male', age: 35, dob: "12/2/1988, 8:25:36", city: "Whitehaven"}  
							]
						}
					}
				}
			};
		} 
	}
};

