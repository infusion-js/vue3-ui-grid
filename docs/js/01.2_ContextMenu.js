const uiDocsExample1_2 = {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample1_2.js = uiDocsCode.js('', '', `title: "Context Menu Example", 
        contextMenuData: {
          metadata: {divider: true, arrow: true},
          options: [
            {label: 'Age', icon: '', children: [
              {label: 'Increment', icon: 'ui-icon-arrow-top', callback: function(row) {row.data.age++;}}, 
              {label: 'Decrement', icon: 'ui-icon-arrow-bottom', callback: function(row) {row.data.age--;}}, 
              {label: 'Decrement', icon: 'ui-icon-refresh', callback: function(row) {row.data.age = row.rowData.age;}}]
            },
            {label: 'Salary', icon: '', children: [
              {label: 'Hike', children:[
                {label: 'Grade C(10%)', callback: function(row) {row.data.salary += row.data.salary * 0.1;}}, 
                {label: 'Grade B(25%)', callback: function(row) {row.data.salary += row.data.salary * 0.25;}}, 
                {label: 'Grade A(50%)', callback: function(row) {row.data.salary += row.data.salary * 0.5;}}]
              },
              {label: 'Drop (-10%)', callback: function(row) {row.data.salary -= row.data.salary * 0.1;}}, 
              {label: 'Reset', callback: function(row) {row.data.salary = row.rowData.salary;}}], 
            }
          ]
        }, 
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsContextMenu'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>This feature is used to show a context menu on right click of any row in grid.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">contextMenuData</span>: 
			<div class="goc">Default null, value should be a java script object that contains "metadata" and menu "options" as properties, </div>
			<div class="pt-05">"metadata" is a java script object that contains divider, arrow, width and height as properties, Default value for 
				divider and arrow is false, set true for divider to show divider line between menu options and set true for arrow to show an 
				arrow to the right side of a menu option to indicate it has submenu, width and height properties for context menu should 
				be numeric in pixels. </div>
			<div class="pt-05">"options" should be an array of objects, each object should contain label, icon, callback and children properties, 
				label should be menu item title, icon should be css class name to show an icon before label, callback should be a java script 
				function that can be called when menu option has clicked and in case menu option has a sub menu, then children property should 
				contain an array of sub menu option objects. </div>
		</div>
		<p class="bold pt-05">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Context Menu Example", </span>
			<span class="pl-50 blue">contextMenuData: { </span>
			<span class="pl-70 blue">metadata: {divider: true, arrow: true}, </span>
			<span class="pl-70 blue">options: [ </span>
			<span class="pl-90 blue">{label: 'Age', icon: '', children: [ </span>
			<span class="pl-110 blue">{label: 'Increment', icon: 'ui-icon-arrow-top', callback: function(row) {row.data.age++;}}, </span>
			<span class="pl-110 blue">{label: 'Decrement', icon: 'ui-icon-arrow-bottom', callback: function(row) {row.data.age--;}}, </span>
			<span class="pl-110 blue">{label: 'Reset', icon: 'ui-icon-refresh', callback: function(row) {row.data.age = row.rowData.age;}}] </span>
			<span class="pl-90 blue">}, </span>
			<span class="pl-90 blue">{label: 'Salary', icon: '', children: [ </span>
			<span class="pl-110 blue">{label: 'Hike', children:[ </span>
			<span class="pl-130 blue">{label: 'Grade C(10%)', callback: function(row) {row.data.salary += row.data.salary * 0.1;}}, </span>
			<span class="pl-130 blue">{label: 'Grade B(25%)', callback: function(row) {row.data.salary += row.data.salary * 0.25;}}, </span>
			<span class="pl-130 blue">{label: 'Grade A(50%)', callback: function(row) {row.data.salary += row.data.salary * 0.5;}}] </span>
			<span class="pl-110 blue">}, </span>
			<span class="pl-110 blue">{label: 'Drop (-10%)', callback: function(row) {row.data.salary -= row.data.salary * 0.1;}}, </span>
			<span class="pl-110 blue">{label: 'Reset', callback: function(row) {row.data.salary = row.rowData.salary;}}], </span>
			<span class="pl-90 blue">} </span>
			<span class="pl-70 blue">] </span>
			<span class="pl-50 blue">}, </span>
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
		<p class="pb-15">In this Example, Notice here, On right click of any row, context menu will be shown, it has "Age" and "Salary" options 
			in main menu. <p>"Age" has a sub menu with "Increment", "Decrement" and "Reset" options, <p>Clicking on Increment option will increment age 
			by 1 and Decrement option will decrement age by 1 and Reset option will reset age back to initial grid loaded data from their callback 
			functions.</p></p> <p>"Salary" has a sub menu with "Hike", "Drop (-10%)" and "Reset" options, <p>"Hike" again has a sub menu with "Grade C(10%)", 
			"Grade B(25%)" and "Grade A(50%)" options, Clicking on any of this option will increase salary in respective percentage from their 
			callback functions. Clicking on Drop option will decrement salary by 10 percent from its callback function and Clicking on Reset 
			option will reset salary back to initial grid loaded data. </p></p></p>
		<ui-docs-tabs :html-code="uiDocsExample1_2.html" :css-code="uiDocsExample1_2.css" :json-code="uiDocsExample1_2.json" 
			:js-code="uiDocsExample1_2.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample1_2
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
							title: "Context Menu Example",
							contextMenuData: {
								metadata: {divider: true, arrow: true},
								options: [
									{label: 'Age', icon: '', children: [
										{label: 'Increment', icon: 'ui-icon-arrow-top', callback: function(row) {row.data.age++;}}, 
										{label: 'Decrement', icon: 'ui-icon-arrow-bottom', callback: function(row) {row.data.age--;}},
										{label: 'Reset', icon: 'ui-icon-refresh', callback: function(row) {row.data.age = row.rowData.age;}}]
									},
									{label: 'Salary', icon: '', children: [
										{label: 'Hike', children:[
											{label: 'Grade C(10%)', callback: function(row) {row.data.salary += row.data.salary * 0.1;}}, 
											{label: 'Grade B(25%)', callback: function(row) {row.data.salary += row.data.salary * 0.25;}}, 
											{label: 'Grade A(50%)', callback: function(row) {row.data.salary += row.data.salary * 0.5;}}]
										},
										{label: 'Drop (-10%)', callback: function(row) {row.data.salary -= row.data.salary * 0.1;}}, 
										{label: 'Reset', callback: function(row) {row.data.salary = row.rowData.salary;}}], 
									}
								]
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
