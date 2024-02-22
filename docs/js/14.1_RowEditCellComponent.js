const uiDocsExample14_1 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample14_1.html = uiDocsCode.html(`
    <script type="text/javascript" src="../js/flatpickr-v4.6.13.js"></script>`);

uiDocsExample14_1.css = uiDocsCode.css(`
.flatpickr-calendar {font-family: Arial, sans-serif;}
.flatpickr-current-month {font-size: 100%; left: 11.5%; padding: 9.48px 0 0 0;}
.flatpickr-current-month .flatpickr-monthDropdown-months {width: 96px;}
.flatpickr-current-month .numInputWrapper {width: 6.25ch;}
.flatpickr-calendar { width: 196px; } .dayContainer { width: 196px; min-width: 196px; max-width: 196px; }
.flatpickr-days { width: 196px; } .flatpickr-day { max-width: 28px; height: 28px; line-height: 28px;}
.flatpickr-calendar.hasTime .flatpickr-time {height: 30px;}
.flatpickr-calendar.hasTime .flatpickr-time {line-height: 30px; max-height: 30px;}
.flatpickr-time .numInputWrapper {height: 30px;}
.flatpickr-current-month input.cur-year:hover {color: #000 !important;}
.flatpickr-current-month input.cur-year {padding: 0;}`);

uiDocsExample14_1.js = uiDocsCode.js('', '', `title: "Row Edit Cell Component Example",
          enableRowEdit: true,
          columnDefs: [
            { field: 'name', cellEdit: false }, 
            { field: 'gender', width: "100", selectOptions: [{key:'male', value:'male'}, {key:'female', value:'female'}]},
            { field: 'age', width: "100", type: 'number' }, 
            { field: 'joined', width: "200", type: 'date', cellEditComponent: {
              template: \`<div class="flatpickr">
                  <input type="text" :id="inputElmID" v-model.trim="$parent.cellEditModel" data-input />
                  <i class="ui-icon-calendar" data-toggle></i>
                </div>\`,
                data: function () {
                  return {
                    input: undefined, 
                    config: { dateFormat: "n/d/Y, H:i:S", enableTime:true, enableSeconds: true},
                    insFp: undefined
                  }
                }, computed: {
                  inputElmID: function() {
                    return 'ui-date-time-picker-input-'+this.row.id;
                  }
                }, mounted: function() {
                  var inputElm = this.$el.querySelector('#'+this.inputElmID);
                  this.insFp = (inputElm) ? new flatpickr(inputElm, this.config) : undefined;
                }, beforeUnmount: function () {
                  if (this.insFp) this.insFp.destroy();
                }
              }
            } 
          ],
          onChangeApi: function( api ) {
            api.edit.on.rowDataChanged(function(row) {
              //perform a server call to save modified row data. 
              //$http(url, options).post(function() { ... });
              console.log(row.data.name);
            });
          }`);


uiDocsComponents['uiDocsRowEditCellComponent'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="pb-05">Row Edit feature limits to enable all row cells from label to html element (text, number, select box, checkbox and radio) only, 
			To achieve custom cell edit functionality, override this behavior with Row Edit Cell Component feature. </p>
		<p class="pb-05"><span class="brown bold">For Example</span>: To show date and time picker while editing join date, a custom cell edit component 
			to show a a date and time picker, can be used to achieve this functionality.</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Row Edit Cell Component Example", </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name', cellEdit: false }, </span>
			<span class="pl-70">{ field: 'gender', width: "100", selectOptions: [{key:'male', value:'male'}, {key:'female', value:'female'}]}, </span>
			<span class="pl-70">{ field: 'age', width: "100", type: 'number' },  </span>
			<span class="pl-70 blue">{ field: 'joined', width: "200", type: 'date', cellEditComponent: { </span>
			<span class="pl-90 blue" v-pre>template: \`&lt;div class="flatpickr"&gt; </span>
			<span class="pl-130 blue" v-pre> &lt;input type="text" :id="inputElmID" v-model.trim="$parent.cellEditModel" data-input /&gt; </span>
			<span class="pl-130 blue" v-pre> &lt;i class="ui-icon-calendar" data-toggle&gt;&lt;/i&gt; </span>
			<span class="pl-110 blue" v-pre> &lt;/div&gt;\`, </span>
			<span class="pl-90 blue" v-pre>data() { </span>
			<span class="pl-110 blue" v-pre>return { </span>
			<span class="pl-130 blue" v-pre>config: { dateFormat: "n/d/Y, H:i:S", enableTime:true, enableSeconds: true}, </span>
			<span class="pl-130 blue" v-pre>insFp: undefined </span>
			<span class="pl-110 blue" v-pre>} </span>
			<span class="pl-90 blue" v-pre>}, computed: { </span>
			<span class="pl-110 blue" v-pre>inputElmID: function() { </span>
			<span class="pl-130 blue" v-pre>return 'ui-date-time-picker-input-'+this.row.id; </span>
			<span class="pl-110 blue" v-pre>} </span>
			<span class="pl-90 blue" v-pre>}, mounted: function() { </span>
			<span class="pl-110 blue" v-pre>var inputElm = this.$el.querySelector('#'+this.inputElmID); </span>
			<span class="pl-110 blue" v-pre>this.insFp = (inputElm) ? new flatpickr(inputElm, this.config) : undefined; </span>
			<span class="pl-90 blue" v-pre>}, beforeUnmount: function() { </span>
			<span class="pl-110 blue" v-pre>if (this.insFp) this.insFp.destroy(); </span>
			<span class="pl-90 blue" v-pre>} </span>
			<span class="pl-70 blue" v-pre>} </span>
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
		<p class="pb-15">In this Example, Notice here, External API Flatpickr is used as a date and time picker and when user clicked 
			on edit icon for a specific row, then "cellEditComponent" defined in columnDefs will be activated to render the template 
			and initialzes input element defined in template to flatpickr date and time. Observe here, input element Model is defined 
			as "$parent.cellEditModel", to either get or set cell value logic to be in sync with grid row data API. 
			<p class="pt-00 pb-00">Now, After clicking on edit icon and clicked on join date text box, A custom cell edit element, 
				Flatpickr date and time picker will be showed inline to that specific row and column. </p>
		</p>
		<ui-docs-tabs :html-code="uiDocsExample14_1.html" :css-code="uiDocsExample14_1.css" :json-code="uiDocsExample14_1.json" 
			:js-code="uiDocsExample14_1.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample14_1
		}
	}, computed: {
		getResult: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
					.flatpickr-calendar {font-family: Arial, sans-serif;}
					.flatpickr-current-month {font-size: 100%; left: 11.5%; padding: 9.48px 0 0 0;}
					.flatpickr-current-month .flatpickr-monthDropdown-months {width: 96px;}
					.flatpickr-current-month .numInputWrapper {width: 6.25ch;}
					.flatpickr-calendar { width: 196px; } .dayContainer { width: 196px; min-width: 196px; max-width: 196px; }
					.flatpickr-days { width: 196px; } .flatpickr-day { max-width: 28px; height: 28px; line-height: 28px;}
					.flatpickr-calendar.hasTime .flatpickr-time {height: 30px;}
					.flatpickr-calendar.hasTime .flatpickr-time {line-height: 30px; max-height: 30px;}
					.flatpickr-time .numInputWrapper {height: 30px;}
					.flatpickr-current-month input.cur-year:hover {color: #000 !important;}
					.flatpickr-current-month input.cur-year {padding: 0;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Row Edit Cell Component Example",
							enableRowEdit: true,
							columnDefs: [
								{ field: 'name', cellEdit: false }, 
								{ field: 'gender', width: "100", selectOptions: [{key:'male', value:'male'}, {key:'female', value:'female'}]},
								{ field: 'age', width: "100", type: 'number' }, 
								{ field: 'joined', width: "200", type: 'date', cellEditComponent: {
									template: `<div class="flatpickr">
										<input type="text" :id="inputElmID" v-model.lazy="$parent.cellEditModel" data-input />
										<i class="ui-icon-calendar" data-toggle></i>
									</div>`,
									data: function () {
										return {
											config: { dateFormat: "n/d/Y, H:i:S", enableTime:true, enableSeconds: true},
											insFp: undefined
										}
									}, computed: {
										inputElmID: function() {
											return 'ui-date-time-picker-input-'+this.row.id;
										}
									}, mounted: function() {
										var inputElm = this.$el.querySelector('#'+this.inputElmID);
										this.insFp = (inputElm) ? new flatpickr(inputElm, this.config) : undefined;
									}, beforeUnmount: function () {
										if (this.insFp) this.insFp.destroy();
									}
								} } 
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

