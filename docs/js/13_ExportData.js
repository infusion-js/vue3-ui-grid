const uiDocsExample13 =  {html: uiDocsCode.html(), css: uiDocsCode.css(), json: uiDocsCode.json(), js: ''};

uiDocsExample13.html = uiDocsCode.html(`
    <script type="text/javascript" src="../js/underscore-v1.13.1.js"></script>
    <script type="text/javascript" src="../js/jszip-v3.5.0.js"></script>
    <script type="text/javascript" src="../js/excel-builder-v2.0.2.js"></script>
    <script type="text/javascript" src="../js/pdfmake-v0.2.5.js"></script>
    <script type="text/javascript" src="../js/vfs_fonts.js"></script>`);

uiDocsExample13.js = uiDocsCode.js('', '', `title: "Export Grid Data Example",
        enableExportData: true,
        exporterExcelCustomFormatter: function ( grid, workbook, docDefinition ) {
          var stylesheet = workbook.getStyleSheet();
          var boldStyle = stylesheet.createFontStyle({ size: 9, fontName: 'Calibri', bold: true });
          
          grid.api.exporter['formatters'] = {};
          grid.api.exporter.formatters['bold'] = stylesheet.createFormat({
            "font": boldStyle.id, "alignment": {"wrapText": true} 
          });
          grid.api.exporter.formatters['date'] = stylesheet.createSimpleFormatter('date');
          grid.api.exporter.formatters['red'] = stylesheet.createFormat({ 
            "font": stdStyle.id, "fill": {"type": 
            "pattern", "patternType": "solid", "fgColor": "FFFFC7CE"}, 
            "alignment": {"wrapText": true} 
          });
          
          Object.assign(docDefinition.styles, grid.api.exporter.formatters);
          return docDefinition;
        },
        exporterFieldFormatCallback: function(grid, row, col, cellValue) {
          var formatter = grid.api.exporter.formatters ? ((col.field === 'name' && cellValue && cellValue.startsWith('S')) ? 
              grid.api.exporter.formatters['red'].id : (col.field === 'joined') ? 
                  grid.api.exporter.formatters['date'].id : null) : null;
          return (formatter) ? {metadata: {style: formatter}} : {metadata: null};
        },
        exporterPdfOrientation: 'portrait',
        exporterPdfDefaultStyle: {fontSize: 9},
        exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
        exporterPdfCustomFormatter: function ( docDefinition ) {
          docDefinition.styles.headerStyle = { alignment: 'center', fontSize: 22, bold: false, margin: [0, 20, 0, 0] };
          docDefinition.styles.footerStyle = { fontSize: 11, bold: false, italics: true };
          return docDefinition;
        },
        exporterPdfMaxGridWidth: 430, 
        columnDefs: [
          { field: 'name' }, 
          { field: 'gender' }, 
          { field: 'age' }, 
          { field: 'salary', suppressExport: true },
          { field: 'joined' }, 
        ]`);


uiDocsComponents['uiDocsExportData'] = {
	components: {'ui-docs-tabs': uiDocsTabs},
	template: `<div class="ui-docs-content">
		<p class="pb-00">Export Data is a process of downloading data from grid, in the format of either csv or excel or pdf file. </p>
		<p class="bold">Grid Options:-</p>
		<div class="highlight pad-05"><span class="green bold">enableExportData</span>: <div class="goc">Default false, true to enable 
			Export Data feature. When this feature is enabled, Export tab of grid is visible, here user can choose a file format for download 
			and Rows/Columns to export, and set options related to file format like file name, delimiter (for CSV) and sheet name (for excel), 
			orientation, page Size(for PDF) etc.,</div>
		</div>
		<p class="pb-05"><span class="brown bold">Note</span>: Export Data feature is using "Excel Builder" and "PDF Make" external libraries, So 
			it is mandatory to include these scripts to make export data functionality works in grid.</p>
		<p class="bold">Define Excel Builder and PDF Make external libraries java script tags in your app as showed below:-</p>
		<div class="highlight green">
			<span class="pl-30">&lt;script type="text/javascript" src="underscore-v1.13.1.js"&gt;&lt;/script&gt;</span>
			<span class="pl-30">&lt;script type="text/javascript" src="jszip-v3.5.0.js"&gt;&lt;/script&gt;</span>
			<span class="pl-30">&lt;script type="text/javascript" src="excel-builder-v2.0.2.js"&gt;&lt;/script&gt;</span>
			<span class="pl-30">&lt;script type="text/javascript" src="vfs_fonts.js"&gt;&lt;/script&gt;</span>
			<span class="pl-30">&lt;script type="text/javascript" src="pdfmake-v0.2.5.js"&gt;&lt;/script&gt;</span>
		</div>
		<p class="pb-05"><span class="brown bold">Note</span>: Underscore and jsZip are required libraries for Excel Builder and Vfs Fonts is for PDF Make.</p>
		<p class="pb-05">It is possible to use different libraries for Excel or PDF, Use onChangeApi of gridOptions to override existing 
			functionality with other excel or pdf libraries, as shown below: </p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Export Grid Data Example", </span>
			<span class="pl-50">... </span>
			<span class="pl-50 green">onChangeApi: function( api ) { </span>
			<span class="pl-70 green">api.exporter.excelExport = $$util.createMethodWrapper(api.grid, function (rowTypes, colTypes) { </span>
			<span class="pl-90 green">//Include logic to build Workbook/Worksheet from scratch with grid row/col data, apply styles and api </span>
			<span class="pl-90 green">//to download generated excel file to local drive etc., in sync with new Excel library </span>
			<span class="pl-90 green">... </span>
			<span class="pl-70 green">}), </span>
			<span class="pl-70 green">api.exporter.pdfExport = $$util.createMethodWrapper(api.grid, function (rowTypes, colTypes, isPrint) { </span>
			<span class="pl-90 green">//Include logic to build PDF Document from scratch with grid row/col data, apply styles and api </span>
			<span class="pl-90 green">//to download generated pdf file to local drive etc., in sync with new PDF library</span>
			<span class="pl-90 green">... </span>
			<span class="pl-70 green">}) </span>
			<span class="pl-50 green">}, </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<p class="pb-05 pt-10">To apply custom styles for a table column, Set "exporterExcelCustomFormatter" for Excel document, and 
			"exporterPdfCustomFormatter" for PDF document and "exporterFieldFormatCallback" for both in gridOptions as mentioned in below example. </p>
		<p class="pb-05">To define default and table wide styles for PDF document, Set "exporterPdfDefaultStyle", "exporterPdfTableStyle" 
			and "exporterPdfTableHeaderStyle" options in gridOptions. </p>
		<p class="pb-00"><span class="brown bold">For Example</span>: "exporterPdfDefaultStyle: {fontSize: 9}" 
			sets default font size for entire PDF file as 9, </p>
		<p class="pb-00">and "exporterPdfTableStyle: {margin: [30, 30, 30, 30]}" set table margin as 30 [left, top, right, bottom] in pixels. </p>
		<p class="pb-05">and "exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'}" sets font size as 10 and 
			font style as bold and italic and color as red for all table header cells. </p>
		<p class="bold">Sample gridOptions declaration is as below:-</p>
		<div class="highlight">
			<span class="pl-30">gridOptions: { </span>
			<span class="pl-50">title: "Export Grid Data Example", </span>
			<span class="pl-50 blue">enableExportData: true, </span>
			<span class="pl-50 blue">exporterExcelCustomFormatter: function ( grid, workbook, docDefinition ) { </span>
			<span class="pl-70 blue">var stylesheet = workbook.getStyleSheet(); </span>
			<span class="pl-70 blue">var boldStyle = stylesheet.createFontStyle({ size: 9, fontName: 'Calibri', bold: true }); </span>
			<span class="pl-70 blue"> </span>
			<span class="pl-70 blue">grid.api.exporter['formatters'] = {}; </span>
			<span class="pl-70 blue">grid.api.exporter.formatters['bold'] = stylesheet.createFormat({ </span>
			<span class="pl-90 blue">"font": boldStyle.id, "alignment": {"wrapText": true} </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-70 blue">grid.api.exporter.formatters['red'] = stylesheet.createFormat({ </span>
			<span class="pl-90 blue">"font": boldStyle.id, </span>
			<span class="pl-90 blue">"fill": {"type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE"},  </span>
			<span class="pl-90 blue">"alignment": {"wrapText": true} </span>
			<span class="pl-70 blue">}); </span>
			<span class="pl-70 blue"> </span>
			<span class="pl-70 blue">Object.assign(docDefinition.styles, grid.api.exporter.formatters); </span>
			<span class="pl-70 blue">return docDefinition; </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50 blue">exporterFieldFormatCallback: function(grid, row, col, cellValue) { </span>
			<span class="pl-70 blue">var formatter = grid.api.exporter.formatters ? ((col.field === 'name' && cellValue && cellValue.startsWith('S'))? </span>
			<span class="pl-90 blue">grid.api.exporter.formatters['red'].id : (col.field === 'joined') ? </span>
			<span class="pl-110 blue">grid.api.exporter.formatters['date'].id : null) : null; </span>
			<span class="pl-70 blue">return (formatter) ? {metadata: {style: formatter}} : {metadata: null}; </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50 blue">exporterPdfOrientation: 'portrait', </span>
			<span class="pl-50 blue">exporterPdfDefaultStyle: {fontSize: 9}, </span>
			<span class="pl-50 blue">exporterPdfTableStyle: {margin: [30, 30, 30, 30]}, </span>
			<span class="pl-50 blue">exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'}, </span>
			<span class="pl-50 blue">exporterPdfCustomFormatter: function ( docDefinition ) { </span>
			<span class="pl-70 blue">docDefinition.styles.headerStyle = { alignment: 'center', fontSize: 22, bold: false, margin: [0, 20, 0, 0] }; </span>
			<span class="pl-70 blue">docDefinition.styles.footerStyle = { fontSize: 11, bold: false, italics: true }; </span>
			<span class="pl-70 blue">return docDefinition; </span>
			<span class="pl-50 blue">}, </span>
			<span class="pl-50 blue">exporterPdfMaxGridWidth: 430, </span>
			<span class="pl-50">columnDefs: [ </span>
			<span class="pl-70">{ field: 'name' }, </span>
			<span class="pl-70">{ field: 'gender'}, </span>
			<span class="pl-70">{ field: 'age' }, </span>
			<span class="pl-70 blue">{ field: 'salary', suppressExport: true }, </span>
			<span class="pl-70">{ field: 'joined' } </span>
			<span class="pl-50">], </span>
			<span class="pl-50">data: jsonData </span>
			<span class="pl-30">} </span>
		</div>
		<div class="ui-docs-content-h3">Example:-</div>
		<ui-docs-tabs :html-code="uiDocsExample13.html" :css-code="uiDocsExample13.css" :json-code="uiDocsExample13.json" 
			:js-code="uiDocsExample13.js" :result="getResult"></ui-docs-tabs>
		<div class="clear pb-50"></div>
	</div>`,
	data: function () {
		return {
			uiDocsExample13
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
							title: "Export Grid Data Example",
							autoSelect: {tab: "export"},
							enableExportData: true,
							exporterExcelCustomFormatter: function ( grid, workbook, docDefinition ) {
								var stylesheet = workbook.getStyleSheet();
								var boldStyle = stylesheet.createFontStyle({ size: 9, fontName: 'Calibri', bold: true });
								
								grid.api.exporter['formatters'] = {};
								grid.api.exporter.formatters['bold'] = stylesheet.createFormat({
									"font": boldStyle.id, "alignment": {"wrapText": true} 
								});
								grid.api.exporter.formatters['date'] = stylesheet.createSimpleFormatter('date');
								grid.api.exporter.formatters['red'] = stylesheet.createFormat({ 
									"font": boldStyle.id, 
									"fill": {"type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE"}, 
									"alignment": {"wrapText": true} 
								});
								
								Object.assign(docDefinition.styles, grid.api.exporter.formatters);
								return docDefinition;
							},
							exporterFieldFormatCallback: function(grid, row, col, cellValue) {
								var formatter = grid.api.exporter.formatters ? ((col.field === 'name' && cellValue && cellValue.startsWith('S')) ? 
									grid.api.exporter.formatters['red'].id : (col.field === 'joined') ? 
											grid.api.exporter.formatters['date'].id : null) : null;
								return (formatter) ? {metadata: {style: formatter}} : {metadata: null};
							},
							exporterPdfOrientation: 'portrait',
							exporterPdfDefaultStyle: {fontSize: 9},
							exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
							exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
							exporterPdfMaxGridWidth: 430, 
							exporterPdfCustomFormatter: function ( docDefinition ) {
								docDefinition.styles.headerStyle = { alignment: 'center', fontSize: 15, bold: false, margin: [0, 20, 0, 0] };
								docDefinition.styles.footerStyle = { fontSize: 11, bold: false, italics: true };
								return docDefinition;
							},
							columnDefs: [
								{ field: 'name' }, 
								{ field: 'gender' }, 
								{ field: 'age' }, 
								{ field: 'salary', suppressExport: true },
								{ field: 'joined' }
							],
							data: jsonData
						}
					}
				}
			};
		}
	}
};
