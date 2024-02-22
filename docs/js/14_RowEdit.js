const uiDocsExample14 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample14.js = uiDocsCode.js('', '', `title: "Row Edit Example",
        enableRowEdit: true,
        columnDefs: [
          { field: 'name', cellEdit: false }, 
          { field: 'gender', radioOptions: ['male', 'female'] }, 
          { field: 'age', width: "80", type: 'number' }, 
          { field: 'active', width: "100", type: 'boolean', trueValue: 'Y', falseValue: 'N' }, 
          { title: 'Address', field: 'address', width: '250', value: function (address) { 
              return \`\${address["house#"]}, \${address.street.main}, \${address.street.cross}, \${address.city}\`; } 
          }, 
          { title: 'State', field: 'address.state', selectOptions: [
              "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
              "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
              "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
              "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
              "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
              "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
          }
        ],
        onChangeApi: function( api ) {
          api.edit.on.rowDataChanged(function(row) {
            //perform a server call to save modified row data. 
            //$http(url, options).post(function() { ... });
            console.log(row.data.name);
          });
        }`);


uiDocsComponents['uiDocsRowEdit'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="pb-05">Row Edit feature allows inline data edit for each row in grid. </p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableRowEdit</span>: <div class="goc">Default false, true to enable 
			row edit feature. </div>
		</div>
		<p class="pb-05">When this feature is enabled, Initially Edit (pencil) and Delete (bin) icons will be showed for each row on left side of grid. 
			Clicking on edit icon for a specific row, Cancel (cross), and Save (disc) icons will be showed in place of edit and delete icons 
			to either save or cancel the changes made to that row. Clicking on delete icon for a specific row, Ok (disc), and Cancel (cross) icons 
			will be showed in place of edit and delete icons to either to confirm or cancel delete action for that row. </p>
		<p class="pb-00">Clicking on edit icon for a specific row, enables all row cells from label to a html texbox element by default. </p>
		<p class="pt-00 pb-05"><span class="brown bold">Note</span>: In case of, Value callback function defined for a column in columnDefs, 
			then that column can not be enabled for edit. To avoid changes for a column whiile edit, set 'cellEdit: false' option for 
			that column in columnDefs.</p>
		<p class="pb-05">To show a number text box for a column while edit, set "type: 'number'" option for that column in columnDefs. </p>
		<p class="pb-05">To show select box for a column while edit, set 'selectOptions' option for that column in columnDefs to either an 
			array of plain string options or an array of key and value pair objects specific to data for that column. </p>
		<p class="pb-05">To show a check box for a column while edit, set "type: 'boolean'" option for that column in columnDefs. </p>
		<p class="pb-05">To show radio buttons for a column while edit, set "radioOptions" option for that column in columnDefs to  
			an array of plain string options specific to data for that column. </p>
		<p class="pb-05">Whenever user edit/deletes a row, "rowDataChanged/rowDeleted" (inside 'onChangeApi' function in grid options) events 
			has raised, with respective row as a parameter, capture this event to perform respective action on a row as sbown in below example. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Row Edit Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70 blue">{ field: 'name', cellEdit: false }, </span>
			<span class="pl-70 blue">{ field: 'gender', radioOptions: ['male', 'female'] }, </span>
			<span class="pl-70 blue">{ field: 'age', width: "80", type: 'number' },  </span>
			<span class="pl-70 blue">{ field: 'active', width: "100", type: 'boolean', trueValue: 'Y', falseValue: 'N' },   </span>
			<span class="pl-70 blue">{ title: 'Address', field: 'address', width: '250', value: function (address) { </span>
			<span class="pl-90 blue" v-pre>return \`\${address["house#"]}, \${address.street.main}, \${address.street.cross}, \${address.city}\`; } </span>
			<span class="pl-70 blue">}, </span>
			<span class="pl-70 blue">{ title: 'State', field: 'address.state', selectOptions: [ </span>
			<span class="pl-90 blue">"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", </span>
			<span class="pl-90 blue">"Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", </span>
			<span class="pl-90 blue">"Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", </span>
			<span class="pl-90 blue">"Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", </span>
			<span class="pl-90 blue">"Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", </span>
			<span class="pl-90 blue">"Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"] </span>
			<span class="pl-70 blue">}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 blue" v-pre>api.edit.on.rowDataChanged(function(row) { </span>
			<span class="pl-90 green" v-pre>//perform a server call to save modified row data. </span>
			<span class="pl-90 green" v-pre>//$http(url, options).post(function() { ... }); </span>
			<span class="pl-90 blue" v-pre>console.log(row.data.name); </span>
			<span class="pl-70 blue" v-pre>}); </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, On click of edit icon, as per columnDefs, Name column is not available for edit 
			due to cellEdit option is defined as false and Gender column showed radio buttons due to radioOptions were defined, 
			and Age column showed numeric textbox due to type is defined as number and Active column showed checkbox due to type is 
			defined as boolean and Address column is not available for edit due to its value is derived from a value callback function 
			and State column has showed select box due to selectOptions were defined. </p>
		<ui-docs-tabs :html-code="uiDocsExample14.html" :css-code="uiDocsExample14.css" :json-code="uiDocsExample14.json" 
			:js-code="uiDocsExample14.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample14
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
							title: "Row Edit Example",
							enableRowEdit: true,
							columnDefs: [
								{ field: 'name', cellEdit: false }, 
								{ field: 'gender', radioOptions: ['male', 'female'] }, 
								{ field: 'age', width: "80", type: 'number' }, 
								{ field: 'active', width: "100", type: 'boolean', trueValue: 'Y', falseValue: 'N' }, 
								{ title: 'Address', field: 'address', width: '250', value: function (address) {
										return `${address["house#"]}, ${address.street.main}, ${address.street.cross}, ${address.city}`; } 
								}, 
								{ title: 'State', field: 'address.state', selectOptions: [
									"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
									"Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
									"Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
									"Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
									"Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
									"Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
								}
							],
							onChangeApi: function( api ) {
								api.edit.on.rowDataChanged(function(row) {
									//perform a server call to save modified row data. 
									//$http(url, options).post(function() { ... });
									console.log(row.data.name);
								});
							},
							data: jsonData
						}
					}
				}
			};
		}
	}
};



