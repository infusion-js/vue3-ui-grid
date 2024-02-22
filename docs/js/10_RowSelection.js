const uiDocsExample10 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample10.css = uiDocsCode.css(`
button.disabled{pointer-events:none;cursor:not-allowed;color:gray}
button:hover {cursor: pointer;}
.ml-20 {margin-left: 20px;} .mb-20 {margin-bottom: 20px;}`);

uiDocsExample10.js = uiDocsCode.js('', `
      selectedRows: [], 
      selectedRowCache: [], 
      rowsForEdit: [],`, `title: "Row Selection Example",
        enableRowSelection: true,
        enableFullRowSelection: true,
        enableSelectRowOnClick: false, 
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary' }
        ]
        onChangeApi: function( api ) {
          api.selection.on.rowSelectionChanged(function(row, e) {
            if (row.isSelected) {
              this.$parent.selectedRows.push(row);
            } else if (this.$parent.selectedRows.length > 0) {
              this.$parent.selectedRows = this.$parent.selectedRows.filter(function (selectedRow) {
                return selectedRow.data.uid !== row.data.uid;
              });
            }
          });
        }`, `
    methods: {
      editSelectedRows: function() {
        var self=this;
        this.rowsForEdit = [];
        this.selectedRowCache = this.selectedRows.filter(function(row) {
          row.enableSelection = false;
          row.isSelected = false;
          row.rowEdit = true;
          return true;
        });
        this.selectedRowCache.forEach(function(row) {
          self.rowsForEdit.push({uid: row.uid, data: Object.assign({}, row.data)});
        });
        this.selectedRows.length = 0;
      },
      cancelEditRows: function() {
        var self=this;
        this.selectedRowCache.forEach(function(selectedRow) {
          self.rowsForEdit.forEach(function(row) {
            if (selectedRow.uid === row.uid) {
              selectedRow.data = row.data;
            }
          });
          selectedRow.enableSelection = true;
          selectedRow.rowEdit = false;
        });
        this.rowsForEdit.length = 0;
      },
      saveSelectedRows: function() {
        this.selectedRowCache.forEach(function(row) {
          row.enableSelection = true;
          row.rowEdit = false;
        });
        this.rowsForEdit.length = 0;
      }
    }` );


uiDocsComponents['uiDocsRowSelection'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p>Row Selection is a process of selecting one or more rows to perform a specific action on selected rows.</p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableRowSelection</span>: <div class="goc">Default false, true to enable 
			row selection feature (shows checkbox on each row) in row header. </div>
			<span class="green bold">enableFullRowSelection</span>: <div class="goc">Default false, true to allow both clicking on a row, 
				and also clicking on the rowHeader. </div>
			<span class="green bold">enableSelectRowOnClick</span>: <div class="goc">Default false, true to allow only Ctrl+Click 
				to select a row. </div>
			<span class="green bold">enableRowHeaderSelection</span>: <div class="goc">Default false, true to avoid row selection checkboxes 
				and clicking on a row to select that row. </div>
			<span class="green bold">multiSelect</span>: <div class="goc">Default false, allows selection of single row at a time, 
				true to allow selecting multiple visible rows. </div>
			<span class="green bold">enableSelectAll</span>: <div class="goc">Default false, true to allow selecting multiple 
				visible rows at once. </div>
		</div>
		<p class="pt-15 pb-05">Whenever user select a row, 'rowSelectionChanged' (inside 'onChangeApi' function in grid options) event has raised, 
			with row and event as a parameters, capture this event to perform respective action on selected row.
			<p class="pt-00 pb-00">For Example, Row selection actions might be edit or delete a selected row or refresh price based 
				on quantity change, or adding a new row before or after selected row etc.,</p> 
		</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Row Selection Example", </span>
			<span class="pl-50 blue">enableRowSelection: true, </span>
			<span class="pl-50 blue">enableFullRowSelection: true, </span>
			<span class="pl-50 blue">enableSelectRowOnClick: false, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' } </span>
			<span class="pl-70">{ field: 'salary'}, </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 blue">api.selection.on.rowSelectionChanged(function(row, e) { </span>
			<span class="pl-90 blue">if (row.isSelected) { </span>
			<span class="pl-110 blue">this.$parent.selectedRows.push(row); </span>
			<span class="pl-90 blue">} else if (this.$parent.selectedRows.length > 0) { </span>
			<span class="pl-110 blue">this.$parent.selectedRows = this.$parent.selectedRows.filter(function (selectedRow) { </span>
			<span class="pl-130 blue">return selectedRow.data.uid !== row.data.uid; </span>
			<span class="pl-110 blue">}); </span>
			<span class="pl-90 blue">} </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<p class="pt-05 pb-15">In this Example, Notice here, full row selection achieved using Ctrl+Click only, due to "enableSelectRowOnClick" 
			set to false, Select All checkbox has not shown in Row Header, due to "enableSelectAll" has not set.
			<p class="pt-00 pb-00">After selection, user can click on 'Edit Selected Rows" button to turn on row cells from label to text box and 
				"Cancel Edit" button will revert back edited text to original, and "Save Selected Rows" button will save edited text. </p>
		</p>
		<ui-docs-tabs :html-code="uiDocsExample10.html" :css-code="uiDocsExample10.css" :json-code="uiDocsExample10.json" 
			:js-code="uiDocsExample10.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample10
		}
	}, computed: {
		getResult: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
					button.disabled{pointer-events:none;cursor:not-allowed;color:gray}
					button:hover {cursor: pointer;}
					.ml-20 {margin-left: 20px;} .mb-20 {margin-bottom: 20px;}
				</component>
				<button type="button" :class="{'disabled': selectedRows.length <= 0}" 
					@click="editSelectedRows">Edit Selected Row/s</button>
				<button type="button" :class="['ml-20', {'disabled': rowsForEdit.length <= 0}]" 
					@click="cancelEditRows">Cancel Edit</button>
				<button type="button" :class="['ml-20', 'mb-20', {'disabled': rowsForEdit.length <= 0}]" 
					@click="saveSelectedRows">Save Selected Row/s</button>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						selectedRows: [], 
						selectedRowCache: [], 
						rowsForEdit: [],
						gridOptions: {
							title: "Row Selection Example",
							enableRowSelection: true,
							enableFullRowSelection: true,
							enableSelectRowOnClick: false, 
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary' }
							],
							onChangeApi: function( api ) {
								api.selection.on.rowSelectionChanged(function(row, e) {
									if (row.isSelected) {
										this.$parent.selectedRows.push(row);
									} else if (this.$parent.selectedRows.length > 0) {
										this.$parent.selectedRows = this.$parent.selectedRows.filter(function (selectedRow) {
											return selectedRow.data.uid !== row.data.uid;
										});
									}
								});
							},
							data: jsonData
						}
					}
				}, methods: {
					editSelectedRows: function() {
						var self=this;
						this.rowsForEdit = [];
						this.selectedRowCache = this.selectedRows.filter(function(row) {
							row.enableSelection = false;
							row.isSelected = false;
							row.rowEdit = true;
							return true;
						});
						this.selectedRowCache.forEach(function(row) {
							self.rowsForEdit.push({uid: row.uid, data: Object.assign({}, row.data)});
						});
						this.selectedRows.length = 0;
					},
					cancelEditRows: function() {
						var self=this;
						this.selectedRowCache.forEach(function(selectedRow) {
							self.rowsForEdit.forEach(function(row) {
								if (selectedRow.uid === row.uid) {
									selectedRow.data = row.data;
								}
							});
							selectedRow.enableSelection = true;
							selectedRow.rowEdit = false;
						});
						this.rowsForEdit.length = 0;
					},
					saveSelectedRows: function() {
						this.selectedRowCache.forEach(function(row) {
							row.enableSelection = true;
							row.rowEdit = false;
						});
						this.rowsForEdit.length = 0;
					},
				}
			};
		}
	}
};
