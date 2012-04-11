(function($){
	
	///////////////////////////
	// Default Table Options //
	///////////////////////////
	
	var defaultOptions = {
		layout : 'horizontal',
		/* 
			title : {
				text : (String or undefined)
				row : (Number or undefined)
				column : (Number or undefined)
				regex : (String or RegEx)
			}
		*/
		title : void 0,
		/* 
			units : {
				text : (String or undefined)
				row : (Number or undefined)
				column (Number or undefined)
				regex : (String or RegEx)
			}
		*/
		units : void 0,
		/*
			Format is {Number} for a specific record, {Number}-{Number}
			for a range, and {Number}+ for all records after and including a
			specific record.
		*/
		header : void 0,
		/*
			Same as header but for the data (data) records.
		*/
		data : void 0,
		/*
			Same as header but for the footer rows (footers are always rows).
		*/
		footer : void 0,
		/*
			Same as header but for the category fields
		*/
		category : void 0,
		/*
			Same as header but for the value fields
		*/
		value : void 0
	};
	
	/////////////////////
	// Utility Methods //
	/////////////////////
	
	function parseIndices(indices, maxIndex){
		var selectedIndices = [];
		
		if(indices instanceof Array){
			for(i=0; i<indices.length; i++){
				if(indices[i] < maxIndex) selectedIndices.push(indices[i]);
			}
		}
		else if(!isNaN(indices)){
			selectedIndices.push(indices);
		}
		else if(typeof indices == 'string'){
			var indexTokens = indices.split(',');
			
			$.each(indexTokens, function(i, token){
				var index = Number(token),
				indices, j;
				
				if(!isNaN(index))
					selectedIndices.push(parseInt(index, 10));
				else{
					if(~token.indexOf('-')){
						indices = token.split('-');
						for(
							j = parseInt(indices[0], 10);
							j <= parseInt(indices[1], 10) && j < maxIndex;
							j++
						)
							selectedIndices.push(parseInt(j, 10));
					}
					else if(~token.indexOf('+')){
						indices = token.match(/(\d+)\+/);
						for(j = indices[1]; j < maxIndex; j++)
							selectedIndices.push(parseInt(j, 10));
					}
					else{
						throw 'Invalid index token';
					}
				}
			});
		}
		
		selectedIndices.sort(function(a, b){
			return a - b;
		});
		
		return selectedIndices;
	};
	
	function generateOptions(tableEle){
		var ops = {};
		// Do Something
		return ops;
	};
	
	///////////////////
	// Class Methods //
	///////////////////

	// Class methods based heavily on or borrowed from
	// webreflection.blogspot.com/2010/02/javascript-override-patterns.html
	
	// Chain method by Andrea Giammarchi
	var chain = (function () {
		// recycled empty callback
		// used to avoid constructors execution
		// while extending
		function proto() {}

		// chain function
		return function ($prototype) {
			// associate the object/prototype
			// to the __proto__.prototype
			proto.prototype = $prototype;
			// and create a chain
			return new proto;
		};
	}());
	
	function createClass(/*
		(properties, $uper)
		 or
		(constructor, properties, $uper)
		*/){
		var klass, klassProperties, superPrototype;
		if(arguments.length == 3){
			klass = arguments[0];
			klassProperties = arguments[1];
			superPrototype = arguments[2];
		}
		else{
			klass = function(){
				if(typeof this.init == 'function')
					this.init.apply(this, arguments);
			};
			klassProperties = arguments[0];
			superPrototype = arguments[1];
		}
		if(typeof superPrototype == 'object'){
			klass.prototype = chain(superPrototype);
			for(prop in klassProperties){
				if(
					klassProperties.hasOwnProperty(prop) &&
					typeof klassProperties[prop] == 'function'
				){
					klassProperties[prop] = function(originalMethod, propertyName){
						return function(){
							var ret;
							this.$super = superPrototype[propertyName];
							ret = originalMethod.apply(this, arguments);
							this.$super = void 0;
							return ret;
						};
					}(klassProperties[prop], prop)
				}
			}
		}
		
		$.extend(klass.prototype, klassProperties);
		
		return klass;
	};
	
	////////////////
	// Base Class //
	////////////////
	
	var DynamicClass = createClass({
		init : function(properties){
			this.applyProperties([/*props go here*/], properties);
		},
		applyProperties : function(props, values){
			var i, prop;
			if(values){
				for(i in props){
					prop = props[i];
					if(values.hasOwnProperty(prop))
						this[prop] = values[prop];
					else
						this[prop] = void 0;
				}
			}
		}
	});
	
	////////////////////
	// Layout Classes //
	////////////////////
	
	var TableElement = createClass({
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				'element' // The jQuery wrapper for a unique table dom element
			], properties);
		},
		equals : function(other){
			if(this.element && other.element)
				return this.element.get(0) == other.element.get(0);
			else
				return false;
		},
		hide : function(){
			if(this.element)
				this.element.hide();
		},
		show : function(){
			if(this.element)
				this.element.show();
		},
		isVisible : function(){
			if(this.element)
				return this.element.is(':visible');
			else
				return false;
		},
		isAttached : function(){
			return this.element.parents().has('body').length > 0;
		}
	}, DynamicClass.prototype);
	
	var Cell = createClass({
		init : function(properties){
			this.$super(properties);
			if(!this['element']) this['element'] = $('<td></td>');
			this['originalColspan'] = this.getColspan();
			this['originalRowspan'] = this.getRowspan();
		},
		getValue : function(){
			return this.getHTMLValue()
				// Strip Sub and Sup tags
				.replace(/<sup>.*?<\/sup>/g, '')
				.replace(/<sub>.*?<\/sub>/g, '')
				// Replace spaces with spaces
				.replace(/&nbsp;/g, ' ')
				// Replace line breaks with spaces
				.replace(/<\s*br\s*\/?>/g, ' ')
				// Strip all other tags
				.replace(/<.*?>/g, '');
		},
		setValue : function(value){
			this.element.text(value)
		},
		getHTMLValue : function(){
			return this.element.html();
		},
		setHTMLValue : function(value){
			return this.element.html(value);
		},
		getColspan : function(){
			return parseInt(this.element.attr('colspan')) || 1;
		},
		getRowspan : function(){
			return parseInt(this.element.attr('rowspan')) || 1;
		},
		setColspan : function(val, updateOriginal){
			this.element.attr('colspan', val);
			if(updateOriginal) this['originalColspan'] = val;
		},
		setRowspan : function(val, updateOriginal){
			this.element.attr('rowspan', val);
			if(updateOriginal) this['originalRowspan'] = val;
		},
		deincrementColspan : function(updateOriginal){
			var colspan = this.getColspan();
			if(colspan > 1)
				this.setColspan(colspan - 1, updateOriginal);
			else
				this.hide();
		},
		deincrementRowspan : function(updateOriginal){
			var rowspan = this.getRowspan();
			if(rowspan > 1)
				this.setRowspan(rowspan - 1, updateOriginal);
			else
				this.hide();
		},
		incrementColspan : function(){
			var colspan = this.getColspan();
			if(!this.isAttached() || this.isVisible())
				this.setColspan(colspan + 1);
			else
				this.show();
		},
		incrementRowspan : function(){
			var rowspan = this.getRowspan();
			if(!this.isAttached() || this.isVisible())
				this.setRowspan(rowspan + 1);
			else
				this.show();
		}
	}, TableElement.prototype);
	
	var CellCollection = createClass({
		init : function(properties){
			var i, cell;
			this.$super(properties)
			this.applyProperties([
				'cells'
			], properties);
			for(cell = this.cells[i=0]; i<this.cells.length; cell = this.cells[++i])
				if(this.element)
					if(cell.element.parents().find(this.element).length == 0)
						cell.element.appendTo(this.element);
		},
		addCell : function(index, cell){
			if(this.element)
				if(cell.element.parents().find(this.element).length == 0)
					cell.element.insertAfter(this.cells[index].element);
			this.cells.splice(index, 0, cell);
		},
		getUniqueCells : function(indices){
			var self = this, lastElement;
			return $.map(indices, function(i, j){
					if(!lastElement || self.cells[i].element != lastElement){
						lastElement = self.cells[i].element
						return self.cells[i];
					}
					else
						return null;
					
				}
			);
		},
		getCellValues : function(indices){
			var self = this;
			return $.map(indices, function(i, j){
					return self.cells[i].getValue();
				}
			);
		},
		isVisible : function(){
			var visible = false;
			$.each(this.cells, function(i, c){
				visible |= c.isVisible();
			});
			return visible;
		}
	}, TableElement.prototype);
	
	
	var Row = createClass({
		hide : function(){
			var showElement = false;
			$.each(this.cells, function(i, c){
				c.deincrementRowspan();
				showElement |= !c.isVisible();
			});
			if(!showElement) this.$super();
		},
		show : function(){
			$.each(this.cells, function(i, c){
				c.incrementRowspan();
			});
			this.$super();
		}
	}, CellCollection.prototype);
	
	var Column = createClass({
		hide : function(){
			$.each(this.cells, function(i, c){
				c.deincrementColspan();
			});
		},
		show : function(){
			$.each(this.cells, function(i, c){
				c.incrementColspan();
			});
		}
	}, CellCollection.prototype);
	
	var LayoutTable = function(){
		
		function slurpCellCollections(tableEle){
			var rows = [],
			columns = [],
			rowEles = tableEle.find('tr'),
			columnEles = tableEle.find('col'),
			rowCells = [],
			columnCells = [],
			row, column, i, j;
			
			rowEles.each(function(i){
				var rowEle = $(this);
				rowEle.children('th, td').each(function(j){
					var cellEle = $(this),
					colspan = parseInt(cellEle.attr('colspan')) || 1,
					rowspan = parseInt(cellEle.attr('rowspan')) || 1,
					m = j,
					cell, k, l;
					for(k = j; k < j + colspan; k++){
						if(!rowCells[i]) rowCells[i] = [];
						while(rowCells[i][m]) m++;
						if(!columnCells[m]) columnCells[m] = [];
						for(l = i; l < i + rowspan; l++){
							if(!rowCells[l]) rowCells[l] = [];
							cell = rowCells[l][m] =
								columnCells[m][l] = new Cell({
								'element' : cellEle
							});
						}
					}
				});
			});
			
			for(i=0; i<rowCells.length; i++){
				row = rows[i] = new Row({
					'element' : rowEles.eq(i),
					'cells' : rowCells[i]
				});
			}
			
			for(i=0; i<columnCells.length; i++){
				column = columns[i] = new Column({
					'element' : columnEles.eq(i),
					'cells' : columnCells[i]
				});
			}
			
			return {
				'rows' : rows,
				'columns' : columns
			}
		}
		
		return createClass({
			init : function(tableEle){
				var properties = {
					'element' : tableEle
				};
				
				$.extend(properties, slurpCellCollections(tableEle));
				
				this.$super(properties);
				
				this.applyProperties([
					'rows', // A collection of row objects
					'columns' // A collection of column objects
				], properties);
			},
			addColumn : function(index, cells){
				var column = new Column({
					'cells' : cells
				});
				for(var i=0; i< Math.min(this.rows.length, cells.length); i++)
					this.rows[i].addCell(index, cells[i]);
				this.columns = this.columns.splice(index, 0, column);
			},
			addRow : function(index, cells){
				var ele = $('<tr></tr>');
				ele.insertAfter($('tr:eq(' + index + ')', this.element));
				this.rows = this.rows.splice(index, 0, new Row({
					'element' : ele,
					'cells': cells
				}));
			}
		}, TableElement.prototype);
	}();
	
	//////////////////
	// Data Classes //
	//////////////////
	
	var Field = createClass({
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				'isValue', // Whether or not this is a value field
				'isCategory', // Whether or not this is a category field
				'units', // If this isValue then the units for the field
				'headerCells', // The header cells for the field
				'dataCells', // The data cells for the field
			], properties);
		}
	}, DynamicClass.prototype);
	
	var Record = createClass({
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				'isHeader', // Whether or not this is a header record
				'isData', // Whether or not this is a data record
				'categoryCells', // The category cells for the record
				'valueCells', // The value cells for the record
				'values', // A hash of the type <field index, parsed value>
			], properties);
		}
	}, DynamicClass.prototype);
	
	var SparseDataCollection = createClass({
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				'values',
				'orderBy'
			], properties);
			this.createSortedKeys();
		},
		createSortedKeys : function(){
			this.keys = [];
			
			for(i in this.values){
				if(this.values.hasOwnProperty(i)){
					this.keys.push(i);
				}
			}
			
			this.keys.sort(function(a, b){
				var ret;
				
				if(!isNaN(a) && !isNaN(b))
					ret = a - b;
				else if(a < b)
					ret = -1;
				else if(a==b)
					ret = 0;
				else
					ret = 1;
				if(this.orderBy == 'ascending')
					ret = ret * -1;
				return ret;
			})
		},
		get : function(index){
			return this.values[index];
		},
		each : function(callback){
			var cIndex, aIndex;
			for(i = 0; i < this.keys.length; i++){
				j = this.keys[i];
				if(this.values.hasOwnProperty(j)){
					callback.call(this.values[j], i, j);
				}
			}
		},
		map : function(callback){
			var ret = [],
			val, i, j;
			for(i = 0; i < this.keys.length; i++){
				j = this.keys[i];
				if(this.values.hasOwnProperty(j)){
					val = callback.call(this.values[j], i, j);
					if(val !== null) ret.push(val);
				}
			}
			return ret;
		}
	}, DynamicClass.prototype);
	
	var DataTable = function(){
		
		function parseUnitsOrTitle(ops){
			var ret = void 0;
			if(typeof ops.text == 'string'){
				ret = ops.text;
			}
			else if(
				!isNaN(ops.row) &&
				!isNaN(ops.column)
			)
				ret = this.layoutTable.rows[ops.row]
					.cells[ops.column].getValue();
			else if(!isNaN(ops.row))
				ret = this.layoutTable.rows[ops.row];
			else if(!isNaN(ops.column))
				ret = this.layoutTable.columns[ops.column];
			if(
				ops.regex &&
				typeof ops.regex.pattern != 'undefined' &&
				!isNaN(ops.regex.match)
			)
				ret = ret.match(
					new RegExp(ops.regex.pattern)
				)[ops.regex.match];
			return typeof ret == 'string' ? $.trim(ret) : ret;
		};
		
		function parseTitle(options){
			var caption;
			
			if(!options.title){
				if((caption = this.element.find('caption')).length > 0)
					this.title = caption.text();
				else
					this.title = void 0
			}
			else{
				this.title = parseUnitsOrTitle.call(this, options.title);
			}
			
		};
		
		function parseUnits(options){
			if(options.units === void 0){
				this.units = void 0;
			}else{
				this.units = parseUnitsOrTitle.call(this, options.units);
			}
		};
		
		function parseFields(options){
			var categoryFields = {},
			valueFields = {},
			i, index, field, cellCollection;
			
			for(var i=0; i< this.categoryIndices.length; i++){
				index = this.categoryIndices[i];
				cellCollection = this.fieldCollection[index];
				categoryFields[index] = field = new Field({
					'cellCollection' : cellCollection,
					'dataCells' : cellCollection.getUniqueCells(this.dataIndices),
					'headerCells' : cellCollection.getUniqueCells(this.headerIndices),
					'isCategory' : true,
					'isValue' : false
				});
			}
			for(var i=0; i< this.valueIndices.length; i++){
				index = this.valueIndices[i];
				cellCollection = this.fieldCollection[index];
				valueFields[index] = field = new Field({
					'cellCollection' : cellCollection,
					'dataCells' : cellCollection.getUniqueCells(this.dataIndices),
					'headerCells' : cellCollection.getUniqueCells(this.headerIndices),
					'isCategory' : false,
					'isValue' : true,
					'units' : typeof this.units == 'string' ?
						this.units : typeof this.units != 'undefined' ?
						this.units.cells[index].getValue() : ''
				});
			}
			
			this.fields = new SparseDataCollection({
				'values' : $.extend({}, categoryFields, valueFields),
				'orderBy' : 'ascending'
			});
			this.categoryFields = new SparseDataCollection({
				'values' : categoryFields,
				'orderBy' : 'ascending'
			});
			this.valueFields = new SparseDataCollection({
				'values' : valueFields,
				'orderBy' : 'ascending'
			});
		};
		
		function parseRecords(options){
			var headerRecords = {},
			dataRecords = {},
			properties, i, index, record, cellCollection, values, field;
			
			for(var i=0; i<this.headerIndices.length; i++){
				index = this.headerIndices[i];
				cellCollection = this.recordCollection[index];
				values = {};
				this.fields.each(function(i, j){
					values[j] = cellCollection.cells[j].getValue();
				});
				headerRecords[index] = record = new Record({
					'cellCollection' : cellCollection,
					'isHeader' : true,
					'isData' : false,
					'categoryCells' : cellCollection.getUniqueCells(this.categoryIndices),
					'valueCells' : cellCollection.getUniqueCells(this.valueIndices),
					'values' : values
				});
			}
			for(var i=0; i<this.dataIndices.length; i++){
				index = this.dataIndices[i];
				cellCollection = this.recordCollection[index];
				values = {};
				this.fields.each(function(i, j){
					values[j] = cellCollection.cells[j].getValue();
				});
				dataRecords[index] = record = new Record({
					'cellCollection' : cellCollection,
					'isHeader' : true,
					'isData' : false,
					'categoryCells' : cellCollection.getUniqueCells(this.categoryIndices),
					'valueCells' : cellCollection.getUniqueCells(this.valueIndices),
					'values' : values
				});
			}
			
			this.records = new SparseDataCollection({
				'values' : $.extend({}, headerRecords, dataRecords),
				'orderBy' : 'ascending'
			});
			this.headerRecords = new SparseDataCollection({
				'values' : headerRecords,
				'orderBy' : 'ascending'
			});
			this.dataRecords = new SparseDataCollection({
				'values' : dataRecords,
				'orderBy' : 'ascending'
			});
		};
		
		return createClass({
			init : function(layoutTable, options){
				
				this.options = options;
				// Digest the options
				this.layout = options.layout;
				this.layoutTable = layoutTable;
				this.fieldCollection = this.layout == 'vertical' ?
					layoutTable.columns : layoutTable.rows,
				this.recordCollection = this.layout == 'vertical' ?
					layoutTable.rows : layoutTable.columns,
				// Record Indices;
				this.headerIndices = parseIndices(
					options.header, this.recordCollection.length);
				this.dataIndices = parseIndices(
					options.data, this.recordCollection.length);
				// Field Indices
				this.valueIndices = parseIndices(
					options.value, this.fieldCollection.length);
				this.categoryIndices = parseIndices(
					options.category, this.fieldCollection.length);
				
				parseTitle.call(this, options);
				parseUnits.call(this, options);
				parseFields.call(this, options);
				parseRecords.call(this, options);
			}
		});
	}();
	
	var MultiDataTable = createClass({
		
		init : function(tableEle, options, dataTableClass){
			dataTableClass = dataTableClass || DataTable;
			var i;
			
			this.options = $.map(
				$.isArray(options) ? options : [options],
				function(o){
					return $.extend(true, {}, defaultOptions, o);
				}
			);
			this.dataTables = [];
			this.layoutTable = new LayoutTable(tableEle)
			
			for(i=0; i<this.options.length; i++){
				this.dataTables.push(
					new dataTableClass(this.layoutTable, this.options[i])
				);
			};
		}
	});
	
	//////////////////////
	// Charting Classes //
	//////////////////////
	
	var ChartElement = createClass({
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				'title' // The title of the element
			], properties);
		}
	}, DynamicClass.prototype)
	
	var Series = createClass({
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				'data', // The field for this series
				'units', // The series units,
				'axis'// A reference to the related axis element
			], properties);
		}
	}, ChartElement.prototype);
	
	var XAxis = function(){
		
		function parseCategories(properties){
			var categories = this.categories,
			dateCategories = [],
			isDateTime = true;
			
			for(i=0; i<categories.length && isDateTime; i++){
				var dateVal = Date.parse(categories[i])
				isDateTime &= !isNaN(dateVal);
				dateCategories.push(dateVal);
			}
			if(isDateTime)
				this.dateCategories = dateCategories;
			this.isDateTime = isDateTime;
		}
	
		return createClass({
			init : function(properties){
				this.$super(properties);
				this.applyProperties([
					'categories'
				], properties);
				parseCategories.call(this);
			}
		}, ChartElement.prototype);
	}();
	
	var YAxis = createClass({
		init : function(properties){
			this.$super(properties);
		}
	}, ChartElement.prototype)
	
	var ChartableTable = createClass({
		getChartData : function(fieldIndices){
			var table = this,
			xAxis = {}
			series = [],
			yAxes = [],
			uniqueUnits = [],
			unitsMap = {};
			
			fieldIndices = parseIndices(
				fieldIndices, this.fieldCollection.length);
			
			series = $.map(fieldIndices, function(i, j){
				var field = table.valueFields.get(i),
				serie, axisIndex;
				
				if(field.units in unitsMap){
					axisIndex = unitsMap[field.units];
				}
				else{
					axisIndex = unitsMap[field.units] = uniqueUnits.length;
					uniqueUnits.push(field.units);
				}
				if(field){
					serie = new Series({
						'title' : $.map(field.headerCells, function(c, i){
							return c.getValue();
						}).join(' '),
						'data' : $.map(field.dataCells, function(c, i){
							var val = parseFloat(
								c.getValue()
								// Strip letters, commas, and spaces
								.replace(/[A-Za-z,\s]/g, '')
							)
							return !isNaN(val) ? val : [null];
						}),
						'units' : field.units,
						'axis' : axisIndex
					}); 
				}
				
				return serie;
			});
			
			xAxis = new XAxis({
				'title' : this.categoryFields.map(function(i, j){
						var field = this;
						return $.map(field.headerCells, function(c, i){
							return c.getValue();
						}).join(' ')
					}).join(' / '),
				'categories' : this.dataRecords.map(function(i, j){
					var record = this;
					return $.map(record.categoryCells, function(cell){
						return cell.getValue()
					}).join(' / ');
				})
			});
			
			yAxes = $.map(uniqueUnits, function(u, i){
				var axis = new YAxis({
					'title' : u
				});
				return axis;
			});
			
			return {
				'title' : this.title,
				'series' : series,
				'xAxis' : xAxis,
				'yAxes' : yAxes
			};
		},
		createHighchartOptions : function(indices, baseOptions){
			var chartData = this.getChartData(indices);
			return $.extend(true, {}, baseOptions, {
				'title' : {
					'text' : chartData.title
				},
				'series' : $.map(chartData.series, function(s, i){
					return {
						'name' : s.title,
						'data' : chartData.xAxis.isDateTime ? $.map(s.data,
							function(d, i){
								return [[chartData.xAxis.dateCategories[i], d]]
							}) : s.data,
						'yAxis' : s.axis
					}
				}),
				'xAxis' : {
					'categories' : chartData.xAxis.isDateTime ? void 0 :
						chartData.xAxis.categories,
					'type' : chartData.xAxis.isDateTime  ? 'datetime' : 'linear'
				},
				'yAxis' : $.map(chartData.yAxes, function(a, i){
					return $.extend({
						'title' : {
							'text' : a.title
						},
						'opposite' : i % 2
					}, baseOptions.yAxis);
				})
			});
		}
	}, DataTable.prototype);
	
	var InteractiveChartableTable = createClass({
		
		dataTableClass : ChartableTable,
		
		init : function(tableEle, options, onCharted){
			var chartableTable, checkboxCell, checkboxes,
			addRows = [], addColumns = [], addGroup, addArray,
			addIndex, buttonCellStartIndex, buttonCellEndIndex,
			buttons, checkbox, valueIndex, buttonCell, i, j, k,
			rowsAdded, columnsAdded;
			
			this.$super(tableEle, options, ChartableTable);
			
			for(i=0; i<this.dataTables.length; i++){
				chartableTable = this.dataTables[i];
				addGroup =  chartableTable.layout == 'vertical' ? addRows : addColumns;
				addIndex = chartableTable.options.controlsIndex ||
					chartableTable.headerIndices[chartableTable.headerIndices.length - 1];
				addArray = addGroup[addIndex] || (addGroup[addIndex] = []);
				buttonCellStartIndex = chartableTable.categoryIndices[0];
				buttonCellEndIndex = chartableTable.valueIndices[0];
				buttonCell = new Cell();
				checkboxes = $();
				
				for(j=buttonCellStartIndex; j<buttonCellEndIndex; j++){
					addArray[j] = buttonCell;
					if(j < buttonCellEndIndex - 1)
						chartableTable.layout == 'vertical' ?
							buttonCell.incrementColspan(true) :
							buttonCell.incrementRowspan(true);
				}
				for(j=0; j<chartableTable.valueIndices.length; j++){
					valueIndex = chartableTable.valueIndices[j];
					addArray[valueIndex] = checkboxCell = new Cell();
					checkboxes = checkboxes.add(checkbox = this.generateCheckbox(valueIndex));
					checkboxCell.element.append(checkbox);
				}
				buttons = this.generateButtons(checkboxes, chartableTable, onCharted);
				buttonCell.element.append(buttons.graphButton);
				buttonCell.element.append(buttons.clearButton);
			}
			
			rowsAdded = 0;
			columnsAdded = 0;
			
			for(i=0; i<addRows.length; i++){
				if(addRows[i]){
					for(j=0; j<this.layoutTable.columns.length; j++){
						if(!addRows[i][j]){
							addRows[i][j] = new Cell();
						}
					}
				}
			}
			
			for(i=0; i<addColumns.length; i++){
				if(addColumns[i]){
					for(j=0; j<this.layoutTable.rows.length; j++){
						if(!addColumns[i][j]){
							addColumns[i][j] = this.layoutTable.rows[j].cells[i + 1];
							addColumns[i][j].incrementColspan();
						}
					}
				}
			}
			
			for(i=0; i<addRows.length; i++){
				if(addRows[i])
					this.layoutTable.addRow(i + rowsAdded++, addRows[i]);
			}
			
			for(i=0; i<addColumns.length; i++){
				if(addColumns[i])
					this.layoutTable.addColumn(i + columnsAdded++, addColumns[i]);
			}
		},
		
		generateButtons : function(checkboxes, chartableTable, onCharted){
			graphButton = $('<button></button>').text('Graph');
			clearButton = $('<button></button>').text('Clear');
			
			graphButton.click(function(){
				var checked = checkboxes.filter(':checked'),
				indices = [];
				
				checked.each(function(i, ele){
					indices.push($(ele).data('index'));
				});
				
				if(indices.length > 0)
					onCharted.call(chartableTable, indices);
			});
			
			clearButton.click(function(){
				checkboxes.filter(':checked').attr('checked', false);
			});
			
			return {
				'graphButton' : graphButton,
				'clearButton' : clearButton
			};
		},
		
		generateCheckbox : function(dataIndex){
			return $('<input type="checkbox"></input>').
				data('index', dataIndex);
		}
	}, MultiDataTable.prototype);
	
	var FancyboxChartableTable = createClass({
		init : function(tableEle, options){
			var self = this,
			autochartContainerId = 'autochart_container_' + new Date().getTime();
			
			this.highchartsDock = $('<div></div>')
				.css('display', 'none')
				.appendTo('body');
			this.highchartsDiv = $('<div></div>')
				.attr('id', autochartContainerId)
				.addClass('autochart_container')
				.appendTo(this.highchartsDock);
			this.highchartsLink = $('<a></a>')
				.attr('href', '#' + autochartContainerId)
				.appendTo(this.highchartsDock)
				.fancybox();
			
			this.$super(tableEle, options, function(indices){
				if(self.chart){
					self.chart.destroy();
					self.chart = null;
				}
				self.chart = new Highcharts.Chart(this.createHighchartOptions(indices,
					$.extend(true, {}, this.options.chartOptions, {
					chart : {
						renderTo : self.highchartsDiv.get(0),
					}
				})), function(){
					self.highchartsLink.click();
				});
			})
		}
	}, InteractiveChartableTable.prototype);
	
	//////////////////////
	// Plugin Functions //
	//////////////////////
	
	$(function(){
		$('table.scrape-horizontal, table.scrape-vertical').each(function(){
			var tableEle = $(this);
			tableEle.autoChart(generateOptions(tableEle));
		});
	});

	$.fn.autoChart = function(options){
		return new FancyboxChartableTable(this, options);
	};
	
}(jQuery))