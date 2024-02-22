### vue-ui-grid
Vue Ui Grid is a light weight data management tool that displays data in a tabular format. 

## It has many immense features like 
	* Virtual Scrolling, 
	* Sorting, 
	* Filtering, 
	* Grouping, 
	* Column Pinning, Resizing and Reorering, 
	* Row selection and Edit etc.,

Include Vue Ui Grid Component in your app as showed below:-

	```
	<link type="text/css" rel="stylesheet" href="vue-ui-grid-v1.0.css">
	<script type="text/javascript" src="vue-v3.1.2.js"></script>
	<script type="text/javascript" src="vue-data-grid.js"></script>
	```

Add grid dimension as CSS style in your app css

	```
	.vueGrid{ width: 600px; height: 300px}
	```

Initialize Grid options as

	```
	var gridOptions = {
		id: "jsonDataGrid", 
		autoResize: true,
		columnDefs: [
			{ name: 'name', width: "100", cellTooltip: true},
			{ name: 'age'}
		],
		data: [{name: 'Jimme Woods', age: 25}, {name: 'Michael Vinston', age: 18}]
	}
	```

Include Vue Ui Grid component in your app as showed below:-

	```
	const app = Vue.createApp({
		data() {
			return { 
				gridOptions: gridOptions
			}
		},
		components: {
			'vue-ui-grid': vueUiGrid
		},
		methods: {
			...
		}
	});
	const vm = app.mount('#app');
	```


