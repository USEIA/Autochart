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
		
		if(!isNaN(indices)){
			selectedIndices.push(indices);
		}
		if(indices instanceof Array){
			for(i=0; i<indices.length; i++){
				if(indices[i] < maxIndex) selectedIndices.push(indices[i]);
			}
		}
		else if(typeof indices == 'string'){
			var indexTokens = indices.split(',');
			
			$.each(indexTokens, function(i, token){
				var index = Number(token),
				indices;
				
				if(!isNaN(index))
					selectedIndices.push(index);
				else{
					if(~token.indexOf('-')){
						indices = token.split('-');
						for(
							j = indices[0];
							j <= indices[1] && j <= maxIndex;
							j++
						)
							selectedIndices.push(j);
					}
					else if(~token.indexOf('+')){
						indices = token.match(/(\d+)\+/);
						for(j = indices[1]; j < maxIndex; j++)
							selectedIndices.push(j);
					}
					else{
						throw 'Invalid index token';
					}
				}
			});
		}
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
	
	function wrapMethod(originalMethod, $uper){
		return function(){
			var ret;
			this.$uper = $uper;
			ret = originalMethod.apply(this, arguments);
			this.$uper = void 0;
			return ret;
		};
	};
	
	function createClass(/*
		(properties, $uper)
		 or
		(constructor, properites, $uper)
		*/){
		var klass, klassProperties, $uper;
		if(arguments.length == 3){
			klass = arguments[0];
			klassProperties = arguments[1];
			$uper = arguments[2];
		}
		else{
			klass = new Function;
			klassProperties = arguments[0];
			$uper = arguments[1];
		}
		if(typeof $uper == 'object'){
			klass.prototype = chain($uper);
			for(prop in klassProperties){
				if(typeof klassProperties[prop] == 'function'){
					klassProperties[prop] = wrapMethod(
						klassProperties[prop], $uper);
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
			for(i in props){
				prop = props[i];
				if(values.hasOwnProperty(prop))
					this[prop] = values[prop];
				else
					this[prop] = void 0;
			}
		}
	});
	
	////////////////////
	// Layout Classes //
	////////////////////
	
	var TableElement = createClass({
		init : function(properties){
			this.$uper.init.call(this, properties);
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
		}
	}, DynamicClass.prototype);
	
	var Cell = createClass({
		init : function(properties){
			this.$uper.init.call(this, properties);
			this['originalColspan'] = this.getColspan();
			this['originalRowspan'] = this.getRowspan();
		},
		getValue : function(){
			return this.element.text();
		},
		getHTMLValue : function(){
			return this.element.html();
		},
		getParsedHTMLValue : function(){
			return this.getHTMLValue()
				// Strip style tags
				.replace(/style=".*?"/g, '')
				// Replace spaces with spaces
				.replace(/&nbsp;/g, ' ')
				// Replace line breaks with spaces
				.replace(/<\s*br\s*\/?>/g, ' ')
				// Strip empty spans
				.replace(/<\s*span\s*>|<\/\s*span\s*>/g, '');
		},
		getColspan : function(){
			return parseInt(this.element.attr('colspan')) || 1;
		},
		getRowspan : function(){
			return parseInt(this.element.attr('rowspan')) || 1;
		},
		setColspan : function(val){
			this.element.attr('colspan', val);
		},
		setRowspan : function(val){
			this.element.attr('rowspan', val)
		},
		deincrementColspan : function(){
			var colspan = this.getColspan();
			if(colspan > 1)
				this.setColspan(colspan - 1);
			else
				this.hide();
		},
		deincrementRowspan : function(){
			var rowspan = this.getRowspan();
			if(rowspan > 1)
				this.setRowspan(rowspan - 1);
			else
				this.hide();
		},
		incrementColspan : function(){
			var colspan = this.getColspan();
			if(this.isVisible())
				this.setColspan(colspan + 1);
			else
				this.show();
		},
		incrementRowspan : function(){
			var rowspan = this.getRowspan();
			if(this.isVisible())
				this.setRowspan(rowspan + 1);
			else
				this.show();
		}
	}, TableElement.prototype);
	
	var CellCollection = createClass({
		init : function(properties){
			this.$uper.init.call(this, properties)
			this.applyProperties([
				'cells'
			], properties);
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
			if(!showElement) this.$uper.hide.call(this);
		},
		show : function(){
			$.each(this.cells, function(i, c){
				c.incrementRowspan();
			});
			this.$uper.show.call(this);
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
			rowEles = tableEle.find('thead > tr, tbody > tr, tfoot > tr'),
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
								columnCells[m][l] = new Cell();
							cell.init({
								'element' : cellEle
							});
						}
					}
				});
			});
			
			for(i=0; i<rowCells.length; i++){
				row = rows[i] = new Row();
				row.init({
					'element' : rowEles.eq(i),
					'cells' : rowCells[i]
				});
			}
			
			for(i=0; i<columnCells.length; i++){
				column = columns[i] = new Column();
				column.init({
					'element' : void 0,
					'cells' : columnCells[i]
				})
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
				
				this.$uper.init(properties);
				
				this.applyProperties([
					'rows', // A collection of row objects
					'columns' // A collection of column objects
				], properties);
			}
		}, TableElement.prototype);
	}();
	
	//////////////////
	// Data Classes //
	//////////////////
	
	var Field = createClass({
		init : function(properties){
			this.$uper.init(properties);
			this.applyProperties([
				'index', // The index of the field in the field collection
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
			this.$uper.init(properties);
			this.applyProperties([
				'index', // The index of record in the record collection
				'values', // A hash of the type <field index, parsed value>
				'isHeader', // Whether or not this is a header record
				'isData', // Whether or not this is a data record
			], properties);
		}
	}, DynamicClass.prototype);
	
	var SparseDataCollection = createClass({
		init : function(properties){
			this.$uper.init(properties);
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
				ret = this.rows[ops.row]
					.cells[ops.column].getParsedHTMLValue();
			else if(!isNaN(ops.row))
				ret = this.rows[ops.row];
			else if(!isNaN(ops.column))
				ret = this.columns[ops.column];
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
			if(!options.units){
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
				categoryFields[index] = field = new Field;
				field.init({
					'index' : index,
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
				valueFields[index] = field = new Field;
				field.init({
					'index' : index,
					'cellCollection' : cellCollection,
					'dataCells' : cellCollection.getUniqueCells(this.dataIndices),
					'headerCells' : cellCollection.getUniqueCells(this.headerIndices),
					'isCategory' : false,
					'isValue' : true,
					'units' : typeof this.units == 'string' ?
						this.units : typeof this.units != 'undefined' ?
						this.units.cells[index].getParsedHTMLValue() : ''
				});
			}
			
			this.fields = new SparseDataCollection;
			this.fields.init({
				'values' : $.extend({}, categoryFields, valueFields),
				'orderBy' : 'ascending'
			});
			this.categoryFields = new SparseDataCollection;
			this.categoryFields.init({
				'values' : categoryFields,
				'orderBy' : 'ascending'
			});
			this.valueFields = new SparseDataCollection;
			this.valueFields.init({
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
				headerRecords[index] = record = new Record;
				cellCollection = this.recordCollection[index];
				values = {};
				this.fields.each(function(i, j){
					values[j] = cellCollection.cells[j].getValue();
				});
				record.init({
					'index' : index,
					'cellCollection' : cellCollection,
					'isHeader' : true,
					'isData' : false,
					'values' : values
				});
			}
			for(var i=0; i<this.dataIndices.length; i++){
				index = this.dataIndices[i];
				cellCollection = this.recordCollection[index];
				dataRecords[index] = record = new Record;
				values = {};
				this.fields.each(function(i, j){
					values[j] = cellCollection.cells[j].getValue();
				});
				record.init({
					'index' : index,
					'cellCollection' : cellCollection,
					'isHeader' : true,
					'isData' : false,
					'values' : values
				});
			}
			
			this.records = new SparseDataCollection;
			this.records.init({
				'values' : $.extend({}, headerRecords, dataRecords),
				'orderBy' : 'ascending'
			});
			this.headerRecords = new SparseDataCollection;
			this.headerRecords.init({
				'values' : headerRecords,
				'orderBy' : 'ascending'
			});
			this.dataRecords = new SparseDataCollection;
			this.dataRecords.init({
				'values' : dataRecords,
				'orderBy' : 'ascending'
			});
		};
		
		return createClass({
			init : function(tableEle, options){
				this.$uper.init.call(this, tableEle);
				
				// Digest the options
				this.layout = options.layout;
				this.fieldCollection = this.layout == 'vertical' ?
					this.rows : this.columns,
				this.recordCollection = this.layout == 'vertical' ?
					this.columns : this.rows,
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
		}, LayoutTable.prototype);
	}();
	
	//////////////////////
	// Charting Classes //
	//////////////////////
	
	var ChartElement = createClass({
		init : function(properties){
			this.$uper.init.call(this, properties);
			this.applyProperties([
				'title' // The title of the element
			], properties);
		}
	}, DynamicClass.prototype)
	
	var Series = createClass({
		init : function(properties){
			this.$uper.init.call(this, properties);
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
				this.$uper.init.call(this, properties);
				this.applyProperties([
					'categories'
				], properties);
				parseCategories.call(this);
			}
		}, ChartElement.prototype);
	}();
	
	var YAxis = createClass({
		init : function(properties){
			this.$uper.init.call(this, properties);
		}
	}, ChartElement.prototype)
	
	var ChartableTable = createClass({
		getChartData : function(fieldIndices){
			var table = this,
			xAxis = {}
			series = [],
			yAxes = [],
			uniqueUnits = [];
			
			fieldIndices = parseIndices(
				fieldIndices, this.fieldCollection.length);
			
			series = $.map(fieldIndices, function(i, j){
				var field = table.valueFields.get(i),
				serie, axisIndex;
				
				if(!~(axisIndex = $.inArray(uniqueUnits, field.units))){
					uniqueUnits.push(field.units)
					axisIndex = uniqueUnits.length - 1;
				}
				if(field){
					serie = new Series;
					serie.init({
						'title' : $.map(field.headerCells, function(c, i){
							return c.getParsedHTMLValue();
						}).join(' '),
						'data' : $.map(field.dataCells, function(c, i){
							var val = parseFloat(
								c.getValue()
								.replace(/[A-Za-z,\s]/g, '')
							)
							return !isNaN(val) ? val : null;
						}),
						'units' : field.units,
						'axis' : axisIndex
					}); 
				}
				
				return serie;
			});
			
			xAxis = new XAxis;
			
			xAxis.init({
				'title' : this.categoryFields.map(function(i, j){
						var field = this;
						return $.map(field.headerCells, function(c, i){
							return c.getValue();
						}).join(' ')
					}).join(' / '),
				'categories' : this.dataRecords.map(function(i, j){
					var record = this;
					return table.categoryFields.map(function(i, j){
						return record.values[j];
					}).join(' / ');
				})
			});
			
			yAxes = $.map(uniqueUnits, function(u, i){
				var axis = new YAxis;
				axis.init({
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
					return {
						'title' : {
							'text' : a.title
						},
						'opposite' : i % 2
					};
				})
			});
		}
	}, DataTable.prototype);
	
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
		var ops = $.extend(true, {}, options, defaultOptions),
		table = new ChartableTable;
		
		table.init(this, ops);
		
		return table;
	};
	
}(jQuery))