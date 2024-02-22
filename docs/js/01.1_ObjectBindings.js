const uiDocsExample1_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample1_1.js = uiDocsCode.js('', '', `title: "Cell Class Example", 
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { title: 'Address', field: 'address', width: '250', value: function (address) {
              return \`\${address["house#"]}, \${address.street.main}, \${address.street.cross}, \${address.city}\`;
            } 
          }, 
          { title: 'State', field: 'address.state' }, 
          { field: 'age' } 
        ]`);


uiDocsComponents['uiDocsObjectBindings'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="pb-05">Field name or Field name containing an object notation can be assigned to a field in columnDefs in gridOptions, 
			Field name containing an object notation will be treated as an object binding. Object bindings are auto detected, 
			No explicit grid option is required to set object binding as true to a field in columnDefs. </p>
		<p class="pb-05">Value of a field for a column while each row rendering should be derived from grid data object using field property defined 
			in columnDefs, In case if requires to apply some custom logic for deriving the value of a field for a column, then an additional "value" 
			property should also be defined along with field in columnDefs as a callback function(recieves object defined in field as a parameter) 
			to return an appropriate value for that column. </p>
		<p class="pb-00"><span class="brown bold">For Example</span>: {field: "address.state"} is an object binding 
				indicates to pick state value from address object.</p>
		<p class="pb-15">{field: 'address', value: function(address) { return address['house#']+', '+address.city+', '+address.state; } }, 
			indicates to pick column value using a function call that returns a concatenated string of house#, city and state as an address. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Cell Class Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender' }, </span>
			<span class="pl-70 blue">{ title: 'Address', field: 'address', width: '250', value: function (address) { </span>
			<span class="pl-110 blue">return \`\${address['house#']}, \${address.street.main}, \${address.street.cross}, \${address.city}\`; </span>
			<span class="pl-90 blue">} </span>
			<span class="pl-70 blue">}, </span>
			<span class="pl-70 blue">{ title: 'State', field: 'address.state' }, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pb-15">In this Example, Notice here, "value" property defined for Address column in columnDefs is a callback function 
			that will be called while each row rendering, to derive concatenated value of house#, main, cross and city for address column, 
			and field property defined for State column is an object binding indicates to pick state value from address object. </p>
		<ui-docs-tabs :html-code="uiDocsExample1_1.html" :css-code="uiDocsExample1_1.css" :json-code="uiDocsExample1_1.json" 
			:js-code="uiDocsExample1_1.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample1_1
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
							title: "Cell Class Example",
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ title: 'Address', field: 'address', width: '250', value: function (address) {
										return `${address["house#"]}, ${address.street.main}, ${address.street.cross}, ${address.city}`;
										//address["house#"]+', '+address.street.main+', '+address.street.cross;
									} 
								}, 
								{ title: 'State', field: 'address.state' }, 
								{ field: 'age' } 
							],
							data: jsonData
						}
					}
				}
			};
		}
	}
};
