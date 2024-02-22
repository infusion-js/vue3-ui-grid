const 	uiDocsExample13_1 = {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''}, 
		uiDocsExample13_2 = {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample13_1.html = uiDocsCode.html(`
	    <script type="text/javascript" src="../js/jszip-v3.5.0.js"></script>
	    <script type="text/javascript" src="../js/exceljs-v4.4.0.js"></script>`);

uiDocsExample13_1.js = uiDocsCode.js('', '', `title: "Export Data with Excel JS Example", 
        columnDefs: [
          { field: 'name', cellClass:'c-red-b-ylw' }, 
          { field: 'gender', headerCellClass: 'c-blue' }, 
          { field: 'age', cellClass: function(grid, row, col) {
              if (grid.getCellValue(row, col) > 25) {
                return 'c-red';
              }
            }
          }, 
          { field: 'salary' }
        ]`);

uiDocsExample13_2.html = uiDocsCode.html(`
	    <script type="text/javascript" src="../js/jspdf.umd-v2.5.1.js"></script>`);

uiDocsExample13_2.js = uiDocsCode.js('', '', `title: "Export Data with jsPDF Example", 
        columnDefs: [
          { field: 'name', cellClass:'c-red-b-ylw' }, 
          { field: 'gender', headerCellClass: 'c-blue' }, 
          { field: 'age', cellClass: function(grid, row, col) {
              if (grid.getCellValue(row, col) > 25) {
                return 'c-red';
              }
            }
          }, 
          { field: 'salary' }
        ]`);


uiDocsComponents['uiDocsExportDataWithCustomApi'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="bold">Using Excel JS for exporting data to Excel file:- </p>
		<p class="pb-05">Grid API uses ExcelBuilder as default java script library for exporting data to an Excel file, To use different java script 
			library in place of ExcelBuilder, Override "api.exporter.excelExport" function in onChangeApi of gridOptions.</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Export Data with Excel JS Example", </span>
			<span class="pl-50 blue">enableExportData: true, </span>
			<span class="pl-50 blue">exportAsPdf: false, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' }, </span>
			<span class="pl-70 blue">{ field: 'salary', suppressExport: true }, </span>
			<span class="pl-70">{ field: 'joined' } </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 green">api.exporter.excelExport = $$util.createMethodWrapper(api.grid, function (rowTypes, colTypes) { </span>
			<span class="pl-90 green">var columnHeaders = this.api.exporter.getColumnHeaders(this, colTypes), columns = []; </span>
			<span class="pl-90 green">for (var i = 0, length = columnHeaders.length; i &lt; length; i++) { </span>
			<span class="pl-110 green">columns.push({ header: columnHeaders[i].title, key: columnHeaders[i].name,  </span>
			<span class="pl-130 green">style: {alignment: {vertical: 'middle', horizontal: columnHeaders[i].align, wrapText: true}}, </span>
			<span class="pl-130 green">width: Math.round(columnHeaders[i].width/5), outlineLevel: 1 </span>
			<span class="pl-110 green">}); </span>
			<span class="pl-90 green">} </span>
			<span class="pl-90 green">var rowData = this.api.exporter.getData(this, rowTypes, colTypes, this.options.exporterFieldApplyFilters, 'AS'); </span>
			<span class="pl-90 green">const wb = new ExcelJS.Workbook(); </span>
			<span class="pl-90 green">const ws = wb.addWorksheet('Sheet1', { </span>
			<span class="pl-110 green">properties:{outlineLevelCol:1}, </span>
			<span class="pl-110 green">pageSetup:{paperSize: 9, orientation:'portrait'}, </span>
			<span class="pl-110 green">views:[{state: 'frozen', xSplit: 0, ySplit: 1}] </span>
			<span class="pl-90 green">}); </span>
			<span class="pl-90 green">ws.columns = columns; </span>
			<span class="pl-90 green">ws.addRows(rowData); </span>
			<span class="pl-90 green">wb.xlsx.writeBuffer().then(function(buffer) { </span>
			<span class="pl-110 green">const blob = new Blob([buffer], { </span>
			<span class="pl-130 green">type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' </span>
			<span class="pl-110 green">}); </span>
			<span class="pl-110 green">api.grid.api.exporter.downloadFile(blob); </span>
			<span class="pl-90 green">}); </span>
			<span class="pl-70 green">}); </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample13_1.html" :css-code="uiDocsExample13_1.css" :json-code="uiDocsExample13_1.json" 
			:js-code="uiDocsExample13_1.js" :result="getExcelResult"></ui-docs-tabs>
		<div class="clear pb-10"></div>
		<p class="bold">Using jsPDF for exporting data to PDF file:- </p>
		<p class="pb-05">Grid API uses PDF Make as default java script library for exporting data to a PDF file, To use different java script 
			library in place of PDF Make, Override "api.exporter.pdfExport" function in onChangeApi of gridOptions.</p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Export Data with jsPDF Example", </span>
			<span class="pl-50 blue">enableExportData: true, </span>
			<span class="pl-50 blue">exportAsExcel: false, </span>
			<span class="pl-50 blue">exportAsCsv: false, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' }, </span>
			<span class="pl-70 blue">{ field: 'salary', suppressExport: true }, </span>
			<span class="pl-70">{ field: 'joined' } </span>
			<span class="pl-50">], </span>
			<span class="pl-50 blue">onChangeApi: function( api ) { </span>
			<span class="pl-70 green">api.exporter.pdfExport = $$util.createMethodWrapper(api.grid, function (rowTypes, colTypes, isPrint) { </span>
			<span class="pl-90 green">var columnHeaders = this.api.exporter.getColumnHeaders(this, colTypes), columns = []; </span>
			<span class="pl-90 green">for (var i = 0, length = columnHeaders.length; i &lt; length; i++) { </span>
			<span class="pl-110 green">columns.push({name: columnHeaders[i].field, prompt: columnHeaders[i].title,  </span>
			<span class="pl-130 green">align: columnHeaders[i].align, width: columnHeaders[i].width}); </span>
			<span class="pl-90 green">} </span>
			<span class="pl-90 green">var rowData = this.api.exporter.getData(this, rowTypes, colTypes, this.options.exporterFieldApplyFilters, 'AO'); </span>
			<span class="pl-90 green">const doc = new jspdf.jsPDF(); </span>
			<span class="pl-90 green">doc.setFontSize(13); </span>
			<span class="pl-90 green">doc.table(20, 15, rowData, columns, { </span>
			<span class="pl-110 green">autoSize: true, printHeaders: true, margins: { left: 20, top: 15, bottom: 15, right: 20 } </span>
			<span class="pl-90 green">}); </span>
			<span class="pl-90 green">doc.save(this.options.exporterPdfFilename); </span>
			<span class="pl-70 green">}); </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample13_2.html" :css-code="uiDocsExample13_2.css" :json-code="uiDocsExample13_2.json" 
			:js-code="uiDocsExample13_2.js" :result="getPDFResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample13_1, uiDocsExample13_2
		}
	}, computed: {
		getExcelResult: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Export Data with Excel JS Example",
							autoSelect: {tab: "export"},
							enableExportData: true,
							exportAsPdf: false,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary', suppressExport: true },
								{ field: 'joined' }
							],
							onChangeApi: function( api ) {
								api.exporter.excelExport = $$util.createMethodWrapper(api.grid, function (rowTypes, colTypes) {
									var columnHeaders = this.api.exporter.getColumnHeaders(this, colTypes), columns = [];
				                    for (var i = 0, length = columnHeaders.length; i < length; i++) {
				                    	columns.push({ header: columnHeaders[i].title, key: columnHeaders[i].name, 
				                    		style: {alignment: {vertical: 'middle', horizontal: columnHeaders[i].align, wrapText: true}}, 
				                    		width: Math.round(columnHeaders[i].width/5), outlineLevel: 1
				                    	});
				                    }
									var rowData = this.api.exporter.getData(this, rowTypes, colTypes, this.options.exporterFieldApplyFilters, 'AS');
									const wb = new ExcelJS.Workbook();
									const ws = wb.addWorksheet('Sheet1', {
										properties:{outlineLevelCol:1},
										pageSetup:{paperSize: 9, orientation:'portrait'}, 
										views:[{state: 'frozen', xSplit: 0, ySplit: 1}]
									});
									ws.columns = columns;
									ws.addRows(rowData);
									
									wb.xlsx.writeBuffer().then(function(buffer) {
										const blob = new Blob([buffer], {
											type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
										});
										api.grid.api.exporter.downloadFile(blob);
									});
								});
							},
							data: jsonData
						}
					}
				}
			};
		}, 
		getPDFResult: function() {
			return {
				components: {'vue-ui-grid': vueUiGrid},
				template: `<component is="style">
					.vue-ui-grid {width:860px; height:360px;}
				</component>
				<vue-ui-grid :options="gridOptions"></vue-ui-grid>`,
				data() {
					return {
						gridOptions: {
							title: "Export Data with jsPDF Example",
							autoSelect: {tab: "export"},
							enableExportData: true,
							exportAsExcel: false,
							exportAsCsv: false,
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary', suppressExport: true },
								{ field: 'joined' }
							],
							onChangeApi: function( api ) {
								api.exporter.pdfExport = $$util.createMethodWrapper(api.grid, function (rowTypes, colTypes, isPrint) {
									var columnHeaders = this.api.exporter.getColumnHeaders(this, colTypes), columns = [];
				                    for (var i = 0, length = columnHeaders.length; i < length; i++) {
				                      //columns.push(columnHeaders[i].field); 
				                    	columns.push({name: columnHeaders[i].field, prompt: columnHeaders[i].title, 
				                    		align: columnHeaders[i].align, width: columnHeaders[i].width});
				                    }
				                    
									var rowData = this.api.exporter.getData(this, rowTypes, colTypes, this.options.exporterFieldApplyFilters, 'AO');
				                    const doc = new jspdf.jsPDF();
				                    doc.setFontSize(13);
				                    doc.table(20, 15, rowData, columns, { 
				                    	autoSize: true, printHeaders: true, margins: { top: 15, right: 20, bottom: 15, left: 20 } 
				                    });
				                    if (isPrint) {
				                    	doc.autoPrint();
				                    } else {
					                    doc.save(this.options.exporterPdfFilename);
				                    }
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



