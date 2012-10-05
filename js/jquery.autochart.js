/**
 *	The jQuery.autoChart plugin scrapes html tables, and exposes the data
 *	for charting.  The plugin can also add a set of controls to the table
 *	to allow for series selection, and charting using Highcharts in a
 *	fancybox modal window.
 *		
 *		defaultOptions = {
 *			
 *			//	Specifies the layout of the table.  A horizontal table has its
 *			//	records as columns, and it's fields as rows. A vertical table
 *			//	has its records as rows, and fields as columns.
 *			
 *			layout : 'horizontal',
 *			
 *			//	Specify either a text value, or a column/row address for the
 *			//	Title.  Optionally, a regular expression and a match index
 *			//	can be provided to extract a portion of the text in a cell.
 *			//	
 *			//	title : {
 *			//		text : (String or undefined)
 *			//		row : (Number or undefined)
 *			//		column : (Number or undefined)
 *			//		regex : {
 *			//			pattern : (String or RegEx)
 *			//			match : (Number)
 *			//		}
 *			//	}
 *			
 *			title : void 0,
 *			
 *			//	Same as title but for the chart units.  Additionally for the
 *			//	units, if only a row or column is provided, it is assumed
 *			//	that the record contains multiple units that are associated
 *			//	with various fields.  This allows for multiple units to be
 *			//	contained in the same table.
 *			//	
 *			//	units : {
 *			//		text : (String or undefined)
 *			//		row : (Number or undefined)
 *			//		column (Number or undefined)
 *			//		regex : {
 *			//			pattern : (String or RegEx)
 *			//			match : (Number)
 *			//		}
 *			//	}
 *			
 *			units : void 0,
 *			
 *			//	For horizontal and vertical tables, the format is {Number} for a 
 *			//	specific record, {Number}-{Number} for a range, and {Number}+ 
 *			//	for all records after and including a specific record.  Indices
 *			//	can also be passed as an array of numbers specifying indices.
 *			
 *			header : void 0,
 *			
 *			//	Same as header but for the data (data) records.
 *			
 *			data : void 0,
 *			
 *			//	Same as header but for the footer rows (footers are always rows).
 *			
 *			footer : void 0,
 *			
 *			//	Same as header but for the category fields
 *			
 *			category : void 0,
 *			
 *			//	Same as header but for the value fields
 *			
 *			value : void 0,
 *
 *			// 	Same as header but for secondary header fields.  These are
 *			//	used for complex tables where some of the series descriptions
 *			// are contained in a field instead of in header records
 *
 *			secondaryHeader : void 0
 *			
 *			//	Specifies a record index to insert the charting controls,
 *			//	defaults to the last header record
 *			
 *			controlsIndex : void 0,
 *			
 *			//	Specifies whether or not the table supports multi-charting,
 *			//	defaults to true for multi-field and false for single-field
 *			//	tables
 *			
 *			multiChart : void 0,
 *			
 *			// The maximum number of value fields units that can be charted at one time.
 *			
 *			maxChartableUnits : 4,
 *
 *			// Specifies whether or not to try and parse the categories as dates for
 *			// for charting purposes.
 *
 *			autoParseCategories : true,
 *			
 *			// A set of styles to be applied to the chart container.  Any valid css styles
 *			// can be used here.
 *			
 *			chartContainerStyles : {
 *				height : '600px',
 *				width : '800px'
 *			},
 *
 *			// Specifies whether or not to add cells to the table for controls.  If set
 *			// to false, then controls are appended to the existing cells at the controls
 *			// index.
 *			
 *			addControlCells : true,
 *
 *			// Options to override the html that generates the charting controls in an
 *			// InteractiveChartableTable.
 *
 *			graphButtonHTML : '<button>Graph</button>',
 *			clearButtonHTML : '<button>Clear</button>',
 *			singleChartButtonHTML : '<button>Graph</button>',
 *			
 *		};
 *	
 *	@module jQuery.autoChart
 *	@requires jQuery, Highcharts, jQuery.fancybox
 */
(function($){
	
	///////////////////////////
	// Default Table Options //
	///////////////////////////
	
	var defaultOptions = {
		layout : 'horizontal',
		title : void 0,
		units : void 0,
		header : void 0,
		data : void 0,
		footer : void 0,
		category : void 0,
		value : void 0,
		secondaryHeader : void 0,
		controlsIndex : void 0,
		multiChart : void 0,
		maxChartableUnits : 4,
		autoParseCategories : true,
		chartContainerStyles : {
			height : '600px',
			width : '800px'
		},
		addControlCells : true,
		graphButtonHTML : '<button>Graph</button>',
		clearButtonHTML : '<button>Clear</button>',
		singleChartButtonHTML : '<button>Graph</button>'
	};
	
	var userDefinedDefaultOptions = {};
	
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
	
	function createClass(
		// (properties, $uper)
		// or
		// (constructor, properties, $uper)
		){
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
	
	/**
	 *	Base class for most classes in the module.  It allows
	 *	for classes that take an object as a constructor argument, and
	 *	apply a set of the properties from the object to the class instance.
	 *	If the properties are not found on the object, then the instance
	 *	will pass hasOwnProperty for the missing properties, with undefined
	 *	values.
	 *	
	 * 	@class DynamicClass
	 *	@constructor 
	 */
	
	var DynamicClass = createClass({
		/**
		 *	Constructor Function DynamicClass
		 *	@method init
		 *	@param values {object} An object containing properties to be applied to the class.
		 */
		init : function(values){
			this.applyProperties([/*props go here*/], values);
		},
		/**
		 *	Applies properties from a value object to the class instance.
		 *	@method applyProperties
		 *	@param props {array} An array of strings representing keys on the value object.
		 *	@param values {object} An object containing values to be applied to the class instance.
		 *	@return {void}
		 */
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
	
	/**
	 *	Base class for most all table elements (cell, row, column).  This class
	 *	is a wrapper for a jQuery element, and provides some utility methods to
	 *	interact with the underlying element.
	 *	
	 * 	@class TableElement
	 *	@extends DynamicClass
	 *	@constructor 
	 */
	
	var TableElement = createClass({
		/**
		 *	Constructor Function TableElement
		 *	
		 *	@method init
		 *	@param values {object} An object containing properties to be applied to the class
		 */
		init : function(values){
			this.$super(values);
			this.applyProperties([
				/**
				 * The jQuery wrapper for a unique table dom element
				 * 
				 * @property element
				 * @type {jQuery}
				 * @final
				 **/
				'element'
			], values);
		},
		/**
		 *	Checks to see if this TableElement instance wraps the same element as the
		 *	passed TableElement.
		 *	
		 *	@method equals
		 *	@param other {TableElement} A TableElement to check equivilency against.
		 *	@return {boolean}
		 */
		equals : function(other){
			if(this.element && other.element)
				return this.element.get(0) == other.element.get(0);
			else
				return false;
		},
		/**
		 *	Hides the wrapped element.
		 *	
		 *	@method hide
		 *	@return {void}
		 */
		hide : function(){
			if(this.element)
				this.element.hide();
		},
		/**
		 *	Shows the wrapped element.
		 *	
		 *	@method show
		 *	@return {void}
		 */
		show : function(){
			if(this.element)
				this.element.show();
		},
		/**
		 *	Checks to see if the wrapped element is visible.
		 *	
		 *	@method isVisible
		 *	@return {boolean}
		 */
		isVisible : function(){
			if(this.element)
				return this.element.is(':visible');
			else
				return false;
		},
		/**
		 *	Checks to see if the wrapped element is attached to the dom.
		 *	If an element is passed, then the return value is whether or
		 *	not the wrapped is attached to the passed element.
		 *	
		 *	@method isAttached
		 *	@param element {jQuery} Optional.  An element to test the wrapped
		 *	element's attachment to.
		 *	@return {boolean}
		 */
		isAttached : function(element){
			return this.element.parents().filter(element.get(0) || 'body').length > 0;
		}
	}, DynamicClass.prototype);
	
	/**
	 *	Wrapper class for a table cell element.
	 *	
	 * 	@class Cell
	 *	@extends TableElement
	 *	@constructor 
	 */
	var Cell = createClass({
		/**
		 *	Constructor Function Cell
		 *	
		 *	@method init
		 *	@param values {object} An object containing properties to be applied to the class
		 */
		init : function(values){
			this.$super(values);
			if(!this['element']) this['element'] = $('<td></td>');
			/**
			 * 	The wrapped cell's original colspan.
			 *
			 *	@property originalColspan
			 *	@type {integer}
			 *	@final
			 **/
			/**
			 * 	The wrapped cell's true colspan.  Can be zero for
			 * 	hidden elements.
			 *
			 *	@property trueColspan
			 *	@type {integer}
			 *	@final
			 **/
			this['originalColspan'] = this['trueColspan'] = this.getColspan();
			/**
			 * 	The wrapped cell's original rowspan.
			 *
			 *	@property originalRowspan
			 *	@type {integer}
			 *	@final
			 **/
			/**
			 * 	The wrapped cell's true rowspan. Can be zero for
			 * 	hidden elements;
			 *
			 *	@property trueRowspan
			 *	@type {integer}
			 *	@final
			 **/
			this['originalRowspan'] = this['trueRowspan'] = this.getRowspan();
		},
		/**
		 *	Returns the value of the cell.  This value is derived from the
		 *	html value, with trailing and leading whitspace, as well as
		 *	tags and html entities removed.
		 *
		 *	@method getValue
		 *	@return {string}
		 **/
		getValue : function(){
			return $.trim(this.element.html()
				// Strip Sub and Sup tags
				.replace(/<sup>.*?<\/sup>/gi, '')
				.replace(/<sub>.*?<\/sub>/gi, '')
				// Replace spaces with spaces
				.replace(/&nbsp;/gi, ' ')
				// Strip hyphenated line breaks
				.replace(/-<\s*br\s*\/?>/gi, '')
				// Replace line breaks with spaces
				.replace(/<\s*br\s*\/?>/gi, ' ')
				// Strip all other tags
				.replace(/<.*?>/g, ''));
		},
		/**
		 *	Sets the HTML Value of the table cell.
		 *
		 *	@method setValue
		 *	@return {void}
		 **/
		setValue : function(value){
			this.element.html(value)
		},
		/**
		 *	Returns the current colspan of the table cell element.  This may be different than the
		 *	trueColspan of the cell for hidden elements.
		 *
		 *	@method getColspan
		 *	@return {ingeger}
		 **/
		getColspan : function(){
			return this.element.attr('colspan') !== void 0 ? parseInt(this.element.attr('colspan')) : 1;
		},
		/**
		 *	Returns the current rowspan of the table cell element.  This may be different than the
		 *	trueRowspan of the cell for hidden elements.
		 *
		 *	@method getRowspan
		 *	@return {integer}
		 **/
		getRowspan : function(){
			return this.element.attr('rowspan') !== void 0 ? parseInt(this.element.attr('rowspan')) : 1;
		},
		/**
		 *	Sets the colspan of the table cell element. If the passed value is
		 *	zero, then the trueColspan is set to zero, and the element is hidden.
		 *	The opposite is true as well if the trueRowspan is also greater than
		 *	zero.
		 *
		 *	@method setColspan
		 *	@param val {integer}
		 *	@return {void}
		 **/
		setColspan : function(val, updateOriginal){
			this.element.attr('colspan', Math.max(1, val));
			this.trueColspan = Math.max(0, val);
			if(this.trueColspan > 0 && !this.trueRowspan == 0)
				this.show();
			else
				this.hide();
			if(updateOriginal) this['originalColspan'] = this.trueColspan;
		},
		/**
		 *	Sets the rowspan of the table cell element.  If the passed value is
		 *	zero then the trueRowspan is set to zero, and the element is hidden.
		 *	The opposite is true as well if the trueColspan is also greater than
		 *	zero.
		 *
		 *	@method setRowspan
		 *	@param val {integer}
		 *	@return {void}
		 **/
		setRowspan : function(val, updateOriginal){
			this.element.attr('rowspan', Math.max(1, val));
			this.trueRowspan = Math.max(0, val);
			if(this.trueRowspan > 0 && !this.trueColspan == 0)
				this.show();
			else
				this.hide();
			if(updateOriginal) this['originalRowspan'] = this.trueRowspan;
		},
		/**
		 *	Deincrements the colspan of the element.
		 *	
		 *	@method deincrementColspan
		 *	@return {void}
		 **/
		deincrementColspan : function(updateOriginal){
			this.setColspan(this.trueColspan - 1, updateOriginal);
		},
		/**
		 *	Deincrements the rowspan of the element.
		 *
		 *	@method deincrementRowspan
		 *	@return {void}
		 **/
		deincrementRowspan : function(updateOriginal){
			this.setRowspan(this.trueRowspan - 1, updateOriginal);		
		},
		/**
		 *	Increments the colspan of the element.  If the
		 *	current colspan is one and the element is hidden
		 *	then the element is shown.  This should be used
		 *	instead of calling show on the cell.
		 *
		 *	@method incrementColspan
		 *	@return {void}
		 **/
		incrementColspan : function(updateOriginal){
			this.setColspan(this.trueColspan + 1, updateOriginal);
				
		},
		/**
		 *	Increments the rowspan of the element.  If the
		 *	current rowspan is one and the element is hidden
		 *	then the element is shown. This should be used
		 *	instead of calling show on the cell.
		 *
		 *	@method incrementRowspan
		 *	@return {void}
		 **/
		incrementRowspan : function(updateOriginal){
			this.setRowspan(this.trueRowspan + 1, updateOriginal);
		}
	}, TableElement.prototype);
	
	
	/**
	 *	Base class for cell collections (Row, Column).
	 *	
	 * 	@class CellCollection
	 *	@extends TableElement
	 *	@constructor 
	 */
	var CellCollection = createClass({
		/**
		 *	Constructor Function CellCollection
		 *	
		 *	@method init
		 *	@param values {object} An object containing properties to be applied to the class.
		 */
		init : function(values){
			var i, cell;
			this.$super(values)
			this.applyProperties([
				/**
				 * 	An array of Cell objects proxied by this collection.
				 *
				 *	@property cells
				 *	@type {array}
				 *	@final
				 **/
				'cells'
			], values);
			for(cell = this.cells[i=0]; i<this.cells.length; cell = this.cells[++i])
				if(this.element)
					if(cell.element.parents().find(this.element).length == 0)
						cell.element.appendTo(this.element);
		},
		/**
		 * Adds a Cell element to the cell collection.
		 *
		 * @method addCell
		 * @param index {integer} the index in the collection where the element will be added.
		 * @param cell {Cell} the Cell element to add to the collection.
		 * @return {void}
		 **/
		addCell : function(index, cell){
			var afterCell, i;
			if(this.element)
				if(!cell.isAttached(this.element)){
					for(
						(i=index) || (afterCell = this.cells[i]);
						afterCell && !afterCell.isAttached(this.element);
						afterCell = this.cells[--i]
					);
					if(afterCell) cell.element.insertAfter(afterCell.element);
					else this.element.prepend(cell.element);
				}
			this.cells.splice(index, 0, cell);
		},
		/**
		 * Returns an array of unique cells from a given set of indices. This function is
		 * the inverse of getUniqueCellIndices.
		 *
		 * @method getUniqueCells
		 * @param indices {array} An array of integers representing indices in the collection.
		 * @return {array}
		 **/
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
		/**
		 *	Returns an array of unique indices for a given set of non-unique indices.
		 *
		 *	@method getUniqueCellIndices
		 *	@param cell {array} A an array of indices to retrive unique indices where unique
		 *	cells occur in the cell collection.
		 *	@return {array} An array of integers representing indices in the collection.
		 **/
		getUniqueIndices : function(indices){
			var self = this, lastElement;
			return $.map(indices, function(i, j){
					if(!lastElement || self.cells[i].element != lastElement){
						lastElement = self.cells[i].element
						return i;
					}
					else
						return null;
					
				}
			);
		},
		/**
		 *	Returns an array of unique indices for a given cell.  This function is the inverse
		 *	of getUniqueCells.
		 *
		 *	@method getUniqueCellIndices
		 *	@param cell {array} A an array of Cells to retrive unique indices where they occur
		 *	in the cell collection.
		 *	@return {array} An array of integers representing indices in the collection.
		 **/
		getUniqueCellIndices : function(cells){
			var ret = [],
			cell, i, j, startOfCell, endOfCell;
			for(i=0; i < cells.length; i++){
				startOfCell = false;
				endOfCell = false; // Three states, two true, one false (0)
				j;
				for(j=0; j < self.cells.length && !endOfCell; j++){
					var isEqual = this.cells[j].isEqual(cell);
					if(!isEqual && startOfCell) endOfCell = true;
					else{
						startOfCell = true;
						ret.push[j];
					}
				}
			};
			ret.sort(function(a, b){return a > b});
			return ret;
		},
		/**
		 * Returns an array of values from a given set of indices.
		 *
		 * @method getCellValues
		 * @param indices {array} An array of integers representing indices in the collection.
		 * @return {array}
		 **/
		getCellValues : function(indices){
			var self = this;
			return $.map(indices, function(i, j){
					return self.cells[i].getValue();
				}
			);
		},
		/**
		 * Whether or not a cell added at the specified index will intersect an existing cell in the
		 * collection.  i.e if a cell at index 0 occurs at indexes 1 and 2, and an index of 1 is passed in, then
		 * the function will return that cell.  If the cell occured only at 0, or 1 and 2, then the function would return
		 * undefined.
		 *
		 * @method intersects
		 * @param index {integer} An index in the collection to test for intersection.
		 * @return {object} Either a cell for an interesection, or undefined for no intersection
		 **/
		intersects : function(index){
			var testCell = this.cells[index],
			beforeCell = this.cells[index - 1],
			afterCell = this.cells[index + 1];
			
			if(beforeCell && afterCell && beforeCell.equals(testCell) && afterCell.equals(testCell))
				return testCell;
			else
				return void 0;
		},
		/**
		 *	Overridden method
		 *
		 * 	@method isVisible
		 *	@return {boolean}
		 **/
		isVisible : function(){
			var visible = false;
			$.each(this.cells, function(i, c){
				visible |= c.isVisible();
			});
			return Boolean(visible);
		}
	}, TableElement.prototype);
	
	/**
	 *	Wraps a row element and proxies it's collection of cells.
	 *	
	 * 	@class Row
	 *	@extends CellCollection
	 *	@constructor 
	 */
	var Row = createClass({
		/**
		 * 	Overridden method.
		 *
		 *	@method hide
		 * 	@return {void}
		 **/
		hide : function(){
			var showElement = false;
			$.each(this.cells, function(i, c){
				c.deincrementRowspan();
				showElement |= !c.isVisible();
			});
			if(!showElement) this.$super();
		},
		/**
		 * 	Overridden method.
		 *
		 *	@method show
		 * 	@return {void}
		 **/
		show : function(){
			$.each(this.cells, function(i, c){
				c.incrementRowspan();
			});
			this.$super();
		},
	}, CellCollection.prototype);
	
	/**
	 *	Wraps a colulmn element and proxies it's collection of cells.
	 *	
	 * 	@class Column
	 *	@extends CellCollection
	 *	@constructor 
	 */
	var Column = createClass({
		/**
		 * 	Overridden method.
		 *
		 *	@method hide
		 * 	@return {void}
		 **/
		hide : function(){
			$.each(this.cells, function(i, c){
				c.deincrementColspan();
			});
		},
		/**
		 * 	Overridden method.
		 *
		 *	@method show
		 * 	@return {void}
		 **/
		show : function(){
			$.each(this.cells, function(i, c){
				c.incrementColspan();
			});
		},
	}, CellCollection.prototype);
	
	/**
	 *	Parses and proxies an HTML table as a set of Row and Column collections.
	 *	
	 * 	@class LayoutTable
	 *	@extends TableElement
	 *	@constructor 
	 */
	var LayoutTable = function(){
		
		/**
		 *	Parses and HTML table into columns and rows.
		 *
		 *	@private
		 *	@method slurpCellCollections
		 *	@param tableEle {jQuery} The table element to be slurped
		 **/
		function slurpCellCollections(tableEle){
			var rows = [],
			columns = [],
			rowEles = tableEle.find('tr'),
			columnEles = tableEle.find('col'),
			rowCells = [],
			columnCells = [],
			row, column, i, j;
			
			// Loop through the rows in the table
			rowEles.each(function(i){
				var rowEle = $(this);
				// Loop through the table cells in the row
				rowEle.children('th, td').each(function(j){
					var cellEle = $(this),
					// Get the colspan and rowspan for the cell
					colspan = parseInt(cellEle.attr('colspan')) || 1,
					rowspan = parseInt(cellEle.attr('rowspan')) || 1,
					m = j,
					cell, k, l;
					// Loop from the start index through the colspan
					for(k = j; k < j + colspan; k++){
						// If we haven't already created an array to
						// store the cells for this row, create one now.
						if(!rowCells[i]) rowCells[i] = [];
						// Find the first empty spot in the row
						while(rowCells[i][m]) m++;
						// If we haven't already created an array to
						// store the cells for this column, create one now.
						if(!columnCells[m]) columnCells[m] = [];
						// Loop from the current row index through the rowspan
						for(l = i; l < i + rowspan; l++){
							// If we haven't already created an array to
							// store the cells for this row, create one now.
							if(!rowCells[l]) rowCells[l] = [];
							// Now that we have a column and row index for this
							// cell, create a new element and store it in the
							// proper position in the row and column arrays
							cell = rowCells[l][m] =
								columnCells[m][l] = new Cell({
								'element' : cellEle
							});
						}
					}
				});
			});
			// Loop through the row arrays and create row elements
			for(i=0; i<rowCells.length; i++){
				row = rows[i] = new Row({
					'element' : rowEles.eq(i),
					'cells' : rowCells[i]
				});
			}
			// Loop through the column arrays and create column elements
			for(i=0; i<columnCells.length; i++){
				column = columns[i] = new Column({
					'element' : columnEles.eq(i),
					'cells' : columnCells[i]
				});
			}
			// Return the rows and column collections
			return {
				'rows' : rows,
				'columns' : columns
			}
		}
		
		return createClass({
			/**
			 * LayoutTable Constructor Function
			 *
			 * @method init
			 * @param tableEle {jQuery} The table element to be proxied.
			 **/
			init : function(tableEle){
				var properties = {
					'element' : tableEle
				};
				
				$.extend(properties, slurpCellCollections(tableEle));
				
				this.$super(properties);
				
				this.applyProperties([
					/**
					 *	An array of Row collections
					 *
					 *	@property rows
					 *	@type {array}
					 **/
					'rows',
					/**
					 *	An array of Column collections
					 *
					 *	@property columns
					 *	@type {array}
					 **/
					'columns'
				], properties);
			},
			/**
			 *	Adds a set of cells at the specified index as a column in the table
			 *
			 *	@method addColumn
			 *	@param index {integer} The index for the newly created column.
			 *	@param cells {array} An array of cells to populate the new column.
			 *	@return {void}
			 **/
			addColumn : function(index, cells){
				var column = new Column({
					'cells' : cells
				});
				for(var i=0; i< Math.min(this.rows.length, cells.length); i++)
					this.rows[i].addCell(index, cells[i]);
				this.columns = this.columns.splice(index, 0, column);
			},
			/**
			 *	Adds a set of cells at the specified index as a row in the table
			 *
			 *	@method addRow
			 *	@param index {integer} The index for the newly created row.
			 *	@param cells {array} An array of cells to populate the new row.
			 *	@return {void}
			 **/
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
	
	/**
	 *	Base class for all data collections (Record and Field)
	 *
	 *	@class DataCollection
	 *	@extends DynamicClass
	 *	@constructor
	 **/
	var DataCollection = createClass({
		/**
		 *	DataCollection Constructor Function
		 *
		 *	@method init
		 *	@param values {object} An object containing properties to be applied to the class
		 **/
		init : function(values){
			this.$super(values);
			this.applyProperties([
				/**
				 *	The cell collection (Row, Column) that this data collection proxies
				 *
				 *	@property cellCollection
				 *	@type {CellCollection}
				 *	@final
				 **/
				'cellCollection'
			], values)
		}
	}, DynamicClass.prototype);
	
	/**
	 *	A collection of cells that represent a field. Fields can be one of two types:
	 *
	 *	1. Value Fields: Represent data series in a table.
	 *	1. Category Fields: Contain category values that correlate to the data contained in value fields.
	 *
	 *	Fields contain two sub collections (arrays):
	 *
	 *	1. Header Cells: These cells describe the data cells.
	 *	1. Data Cells: These cells contain values and categories for value and category fields respectively.
	 *
	 *	@class Field
	 *	@extends DataCollection
	 *	@constructor
	 **/
	var Field = createClass({
		/**
		 *	Field Class Constructor
		 *
		 *	@method init
		 *	@param values {object} An object containing properties to be applied to the class.
		 */ 
		init : function(values){
			this.$super(values);
			this.applyProperties([
				/**
				 *	Specifies whether or not this is a value field.
				 *
				 *	@property isValue
				 *	@type {boolean}
				 *	@final
				 **/
				'isValue',
				/**
				 *	Specifies whether or not this is a category field.
				 *
				 *	@property isCategory
				 *	@type {boolean}
				 *	@final
				 **/
				'isCategory', // Whether or not this is a category field
				/**
				 * If this field represents a secondary header
				 *
				 * @property isSecondaryHeader
				 * @type {boolean}
				 * @final
				 **/
				'isSecondaryHeader',
				/**
				 *	If this isValue then the units for the field
				 *
				 *	@property units
				 *	@type {string}
				 *	@final
				 **/
				'units',
				/**
				 *	An array of cells that are the header cells for this
				 *	field.
				 *
				 *	@property headerCells
				 *	@type {array}
				 *	@final
				 **/
				'headerCells', // The header cells for the field
				/**
				 *	An array of cells that are the data cells for this
				 *	field.
				 *
				 *	@property dataCells
				 *	@type {array}
				 *	@final
				 **/
				'dataCells', // The data cells for the field
			], values);
		}
	}, DataCollection.prototype);
	
	/**
	 *	A collection of cells that represent a record. Records can be one of two types:
	 *
	 *	1. Header Records: Describe the data contained in the record.  These headers can contain
	 *	categories, series descriptions, unit descriptions, and table descriptions.
	 *	1. Data Records: Contain category values that correlate to the data contained in value fields.
	 *
	 *	Records contain two sub collections (arrays):
	 *
	 *	1. Category Cells: These cells contain the category for the record (year, region, ect.).
	 *	1. Value Cells: These cells contain values for the record.
	 *
	 *	@class Record
	 *	@extends DataCollection
	 *	@constructor
	 **/
	var Record = createClass({
		init : function(values){
			this.$super(values);
			this.applyProperties([
				/**
				 *	Specifies whether or not this is a header record
				 *
				 *	@property isHeader
				 *	@type {boolean}
				 *	@final
				 **/
				'isHeader',
				/**
				 *	Specifies whether or not this is a data record
				 *
				 *	@property isData
				 *	@type {boolean}
				 *	@final
				 **/
				'isData',
				/**
				 *	An array of cells that are the category cells for the record
				 *
				 *	@property categoryCells
				 *	@type {array}
				 *	@final
				 **/
				'categoryCells',
				/**
				 *	An array of cells that are the value cells for the record.
				 *
				 *	@property valueCells
				 *	@type {array}
				 *	@final
				 **/
				'valueCells',
				/**
				 *	An array of cells that are the secondary header cells for
				 *	this record.
				 *
				 *	@property secondaryHeaderCells
				 *	@type {array}
				 *	@final
				 **/
				'secondaryHeaderCells',
				/**
				 *	A hash (object) of <field index, value> for the value cells
				 *
				 *	@property values
				 *	@type {object}
				 *	@final
				 **/
				'values',
			], values);
		}
	}, DataCollection.prototype);
	
	/**
	 *	A collection that proxies a sparse array or array like object. This allows for a table
	 *	to skip physical rows and columns when creating fields and records, maintaning both a
	 *	relative index for the record among the records/fields in the table, as well as an
	 *	absolute index that represents the physical index of the Row or Column in the table.
	 *
	 *	@class SparseDataCollection
	 *	@extends DynamicClass
	 *	@constructor
	 **/
	var SparseDataCollection = createClass({
		/**
		 *	SparseDataCollection Constructor Function
		 *
		 *	@method init
		 *	@param values {object} An object containing properties to be applied to the class.
		 **/
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				/**
				 *	The array or array like object proxied by the collection.
				 *
				 *	@property values
				 *	@type {object}
				 *	@final
				 **/
				'values',
				/**
				 *	Specifies how the keys in the collection should be ordered. Possible values
				 *	are 'ascending' or 'descending'.
				 *
				 *	@property orderBy
				 *	@type {string}
				 *	@default 'descending'
				 *	@final
				 **/
				'orderBy'
			], properties);
			this.createSortedKeys();
		},
		/**
		 *	Sorts the keys based on the value of the instances orderBy property.
		 *
		 *	@method createSortedKeys
		 *	@return {void}
		 **/
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
		/**
		 *	Accessor method, returns the value stored at a specified index
		 *
		 *	@method get
		 *	@param index {integer} The index of the item to be returned.
		 *	@return {object} The item stored at the specified index.
		 **/
		get : function(index){
			return this.values[index];
		},
		/**
		 *	Iteration method. Similar to jQuery's $.each method.  Iterates
		 *	over collection, calling the callback for each value.  The callback
		 *	is executed in the context of the item, and is passed the sorted index
		 *	in the collection, as well as the absolute index of the item (or the key).
		 *
		 *	@method each
		 *	@param callback {function} The callback to be executed for each element in the collection.
		 *	@return {void}
		 **/
		each : function(callback){
			var cIndex, aIndex;
			for(i = 0; i < this.keys.length; i++){
				j = this.keys[i];
				if(this.values.hasOwnProperty(j)){
					callback.call(this.values[j], i, j);
				}
			}
		},
		/**
		 *	Iteration method. Similar to jQuery's $.map method.  Iterates
		 *	over collection, calling the callback for each value.  The callback
		 *	is executed in the context of the item, and is passed the sorted index
		 *	in the collection, as well as the absolute index of the item (or the key). The callback
		 *	can return a value, which is mapped into a new array returned by the map function.  If the
		 *	callback returns null, then no item is added to the array.
		 *
		 *	@method map
		 *	@param callback {function} The callback to be executed for each element in the collection.
		 *	@return {array}
		 **/
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
		},
		/**
		 *	Returns the number of keys contained in the collection.
		 *
		 *	@method getLength
		 *	@return {int}
		 **/
		getLength : function(){
			return this.keys.length;
		}
	}, DynamicClass.prototype);
	
	/**
	 *	The data counterpart to LayoutTable.  While the former is a collection of Rows and Columns, this is
	 *	a collection of Fields and Records.
	 *
	 *	@class DataTable
	 *	@constructor
	 **/
	var DataTable = createClass({
		/**
		 *	DataTable Constructor Function
		 *
		 *	@method init
		 *	@param layoutTable {LayoutTable} The LayoutTable instance that proxies
		 *	the physical table for this DataTable instance.
		 *	@param options {object} The options object for parsing the data out of
		 *	the LayoutTable.  See the jQuery.autoChart module for a description of
		 *	the options and defaults.
		 **/
		init : function(layoutTable, options){
			/**
			 *	The options object passed to the constructor function.
			 *
			 *	@property options
			 *	@type {object}
			 *	@final
			 **/
			this.options = options;
			/**
			 *	The LayoutTable that proxies the physical table for this data table.
			 *
			 *	@property layoutTable
			 *	@type {LayoutTable}
			 *	@final
			 **/
			this.layoutTable = layoutTable;
			// Digest the options
			/**
			 *	The layout type of this datatable as defined in the options
			 *	object.
			 *
			 *	@property layout
			 *	@type {string}
			 *	@final
			 **/
			this.layout = options.layout;
			/**
			 *	The CellCollection that contains the field information for this table.
			 *	If the layout is 'vertical', then the fieldCollection will be the
			 *	columns from the layoutTable.  If the layout 'horizontal', then the
			 *	fieldCollection will be the rows from the layoutTable.
			 *
			 *	@property fieldCollection
			 *	@type {CellCollection}
			 *	@final
			 **/
			this.fieldCollection = this.layout == 'vertical' ?
				layoutTable.columns : layoutTable.rows,
			/**
			 *	The CellCollection that contains the record information for this table.
			 *	If the layout is 'vertical', then the recordCollection will be the
			 *	rows from the layoutTable.  If the layout 'horizontal', then the
			 *	recordCollection will be the columns from the layoutTable.
			 *
			 *	@property recordCollection
			 *	@type {CellCollection}
			 *	@final
			 **/
			this.recordCollection = this.layout == 'vertical' ?
				layoutTable.rows : layoutTable.columns,
			// Record Indices;
			/**
			 *	The parsed indices for the header records in the layoutTable.  These
			 *	are parsed indices, so any string options will be converted to a set
			 *	of integers.
			 *
			 *	@property headerIndices
			 *	@type {array}
			 *	@final
			 **/
			this.headerIndices = parseIndices(
				options.header, this.recordCollection.length);
			/**
			 *	The parsed indices for the data records in the layoutTable.  These
			 *	are parsed indices, so any string options will be converted to a set
			 *	of integers.
			 *
			 *	@property dataIndices
			 *	@type {array}
			 *	@final
			 **/
			this.dataIndices = parseIndices(
				options.data, this.recordCollection.length);
			// Field Indices
			/**
			 *	The parsed indices for the value fields in the layoutTable.  These
			 *	are parsed indices, so any string options will be converted to a set
			 *	of integers.
			 *
			 *	@property valueIndices
			 *	@type {array}
			 *	@final
			 **/
			this.valueIndices = parseIndices(
				options.value, this.fieldCollection.length);
			/**
			 *	The parsed indices for the category fields in the layoutTable.  These
			 *	are parsed indices, so any string options will be converted to a set
			 *	of integers.
			 *
			 *	@property categoryIndices
			 *	@type {array}
			 *	@final
			 **/
			this.categoryIndices = parseIndices(
				options.category, this.fieldCollection.length);
			/**
			 *	The parsed indices for the secondary header fields in the layoutTable.  
			 *	These are parsed indices, so any string options will be converted to a 
			 *	set of integers.
			 *
			 *	@property secondaryHeaderIndices
			 *	@type {array}
			 *	@final
			 **/
			this.secondaryHeaderIndices = options.secondaryHeader !== void 0  ?
				parseIndices(options.secondaryHeader, this.fieldCollection.length) : void 0;
			/**
			 *	Specifies whether the datatable contains any secondary header fields
			 *
			 *	@property hasSecondaryHeaders
			 *	@type {boolean}
			 *	@final
			 **/
			this.hasSecondaryHeaders = Boolean(this.secondaryHeaderIndices);
			
			this.parseTitle(options);
			this.parseUnits(options);
			this.parseFields(options);
			this.parseRecords(options);
		},
		/**
		 *	Parses the units or the title from a regex, record index, or string.
		 *
		 *	@method parseUnitsOrTitle
		 *	@param ops {object} The options for the units or the title
		 *	@return {void}
		 **/
		parseUnitsOrTitle : function(ops){
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
		},
		/**
		 *	Parses the title, wraps parseUnitsOrTitle.  If a caption exists for
		 *	the table, this is used in lieu of the passed options.
		 *
		 *	@method parseTitle
		 *	@param options {object} The options for the title
		 *	@return {void}
		 **/
		parseTitle : function(options){
			var caption;
			
			if(!options.title){
				if((caption = this.layoutTable.element.find('caption')).length > 0)
					this.title = caption.text();
				else
					this.title = void 0
			}
			else{
				this.title = this.parseUnitsOrTitle.call(this, options.title);
			}
			
		},
		/**
		 *	Parses the units, wraps parseUnitsOrTitle.
		 *
		 *	@method parseUnits
		 *	@param options {object} The options for the units
		 *	@return {void}
		 **/
		parseUnits : function(options){
			if(options.units === void 0){
				this.units = void 0;
			}else{
				this.units = this.parseUnitsOrTitle.call(this, options.units);
			}
		},
		/**
		 *	Parses the fields in the table based on the passed options.  Fields are
		 *	divided into three SparseDataCollections, one for category fields, one
		 *	for value fields, and one for all fields.
		 *
		 *	@method parseFields
		 *	@param options {object} The options for the table.
		 *	@return {void}
		 *	@private
		 **/
		parseFields : function(options){
			var categoryFields = {},
			valueFields = {},
			secondaryHeaderFields = {},
			i, index, field, cellCollection;
			
			for(var i=0; i< this.categoryIndices.length; i++){
				index = this.categoryIndices[i];
				cellCollection = this.fieldCollection[index];
				categoryFields[index] = field = new Field({
					'cellCollection' : cellCollection,
					'dataCells' : cellCollection.getUniqueCells(this.dataIndices),
					'headerCells' : cellCollection.getUniqueCells(this.headerIndices),
					'isCategory' : true,
					'isValue' : false,
					'isSecondaryHeader' : false
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
					'isSecondaryHeader' : false,
					'units' : typeof this.units == 'string' ?
						this.units : typeof this.units != 'undefined' ?
						this.units.cells[index].getValue() : ''
				});
			}
			if(this.hasSecondaryHeaders){
				for(var i=0; i< this.secondaryHeaderIndices.length; i++){
				index = this.secondaryHeaderIndices[i];
				cellCollection = this.fieldCollection[index];
				secondaryHeaderFields[index] = field = new Field({
					'cellCollection' : cellCollection,
					'dataCells' : cellCollection.getUniqueCells(this.dataIndices),
					'headerCells' : cellCollection.getUniqueCells(this.headerIndices),
					'isCategory' : false,
					'isValue' : false,
					'isSecondaryHeader' : true
				});
			}
			}
			/**
			 *	A collection of all Fields parsed from the table.
			 *
			 *	@property fields
			 *	@type {SparseDataCollection}
			 *	@final
			 **/
			this.fields = new SparseDataCollection({
				'values' : $.extend({}, categoryFields, valueFields, secondaryHeaderFields),
				'orderBy' : 'ascending'
			});
			/**
			 *	A collection of all category Fields parsed from the table.
			 *
			 *	@property categoryFields
			 *	@type {SparseDataCollection}
			 *	@final
			 **/
			this.categoryFields = new SparseDataCollection({
				'values' : categoryFields,
				'orderBy' : 'ascending'
			});
			/**
			 *	A collection of all value fields parsed from the table.
			 *
			 *	@property valueFields
			 *	@type {SparseDataCollection}
			 *	@final
			 **/
			this.valueFields = new SparseDataCollection({
				'values' : valueFields,
				'orderBy' : 'ascending'
			});
			/**
			 *	A collection of all secondary header fields parsed from the table.
			 *
			 *	@property secondaryHeaderFields
			 *	@type {SparseDataCollection}
			 *	@final
			 **/
			this.secondaryHeaderFields = new SparseDataCollection({
				'values' : secondaryHeaderFields,
				'orderBy' : 'ascending'
			});
		},
		/**
		 *	Parses the records in the table based on the passed options.  Records are
		 *	divided into three SparseDataCollections, one for header records, one for 
		 *	data records, and one for all records.
		 *
		 *	@method parseRecords
		 *	@param options {object} The options for the table.
		 *	@return {void}
		 *	@private
		 **/
		parseRecords : function(options){
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
					'secondaryHeaderCells' : this.hasSecondaryHeaders ?
						cellCollection.getUniqueCells(this.secondaryHeaderIndices) : void 0,
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
					'secondaryHeaderCells' : this.hasSecondaryHeaders ?
						cellCollection.getUniqueCells(this.secondaryHeaderIndices) : void 0,
					'values' : values
				});
			}
			/**
			 *	A collection of all Records parsed from the table.
			 *
			 *	@property records
			 *	@type {SparseDataCollection}
			 *	@final
			 **/
			this.records = new SparseDataCollection({
				'values' : $.extend({}, headerRecords, dataRecords),
				'orderBy' : 'ascending'
			});
			/**
			 *	A collection of all header Records parsed from the table.
			 *
			 *	@property headerRecords
			 *	@type {SparseDataCollection}
			 *	@final
			 **/
			this.headerRecords = new SparseDataCollection({
				'values' : headerRecords,
				'orderBy' : 'ascending'
			});
			/**
			 *	A collection of all data Records parsed from the table.
			 *
			 *	@property dataRecords
			 *	@type {SparseDataCollection}
			 *	@final
			 **/
			this.dataRecords = new SparseDataCollection({
				'values' : dataRecords,
				'orderBy' : 'ascending'
			});
		}
	});
	
	/**
	 *	Proxies a collection of DataTable instances for a single physical table.
	 *	Its constructor takes an array of options, as opposed to a single options
	 *	object, as well as a constructor function to use to generate DataTable
	 *	instances from the options array.
	 *
	 *	@class MultiDataTable
	 *	@constructor
	 **/
	var MultiDataTable = createClass({
		/**
		 *	MultiDataTable Constructor Function
		 *
		 *	@method init
		 *	@param tableEle {jQuery} The physical table to be proxied
		 *	@param options {array} An array of options objects from which to
		 *	generate the collection of datatables.  See jQuery.autoChart module
		 *	for documentation of the options structure and default values.
		 *	@param dataTableClass {function} A constructor function to use to
		 *	generate the individual DataTable instances proxied by this collection.
		 **/
		init : function(tableEle, options, dataTableClass){
			var i;
			dataTableClass = dataTableClass || DataTable;
			
			this.options = $.map(
				$.isArray(options) ? options : [options],
				function(o){
					return $.extend(true, {}, defaultOptions, userDefinedDefaultOptions, o);
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
			var categories = [],
			dateCategories = []
			categoriesHash = {};
			
			if(this.autoParseCategories){
				if(this.isDateTime = !isNaN(Date.parse(this.categories[0]))){
					for(i=0; i<this.categories.length; i++){
						dateCategories.push(Date.parse(this.categories[i]));
					}
						this.dateCategories = dateCategories;
				}
				else if(this.isDateTime = !isNaN(Date.parse('01/01/' + this.categories[0]))){
					for(i=0; i<this.categories.length; i++){
						dateCategories.push(Date.parse('01/01/' + this.categories[i]));
					}
						this.dateCategories = dateCategories;
				}
			}
			if(!this.isDateTime){
				for(i=0; i<this.categories.length; i++){
					if(!categoriesHash.hasOwnProperty(this.categories[i])){
						categories.push(this.categories[i]);
						categoriesHash[this.categories[i]] = true;
					}
				}
				this.categories = categories;
			}
		}
	
		return createClass({
			init : function(properties){
				this.$super(properties);
				this.applyProperties([
					'categories',
					'autoParseCategories'
				], properties);
				parseCategories.call(this);
			}
		}, ChartElement.prototype);
	}();
	
	var YAxis = createClass({
		init : function(properties){
			this.$super(properties);
			this.applyProperties([
				'nonZeroMin'
			], properties);
		}
	}, ChartElement.prototype)
	
	var ChartableTable = createClass({
		getChartData : function(fieldIndices){
			var table = this,
			xAxis = {},
			series = [],
			yAxes = [],
			uniqueUnits = [],
			unitsMap = {},
			nonZeroMin = false,
			dataRegex = /[\,\sA-Za-z]/g,
			fieldTitle;
			
			fieldIndices = parseIndices(
				fieldIndices, this.fieldCollection.length);
			
			series = $.map(fieldIndices, function(i, j){
				var field = table.valueFields.get(i),
				secondaryHeaderField, dataCell, leastIndices, seriesOptions,
				serie, series, axisIndex, l, m, n, dataCells, unitsKey;
				
				fieldTitle = $.map(field.cellCollection.getUniqueIndices(table.headerIndices), function(k, l){
						// Use the cached value instead of the cell's current
						// value to account for additions to the cell content
						// due to the addition of charting controls.
						return table.records.get(k).values[i];
					}).join(' ');
				
				var unitsKey = field.units.toLowerCase();
				if(unitsKey in unitsMap){
					axisIndex = unitsMap[unitsKey];
				}
				else{
					axisIndex = unitsMap[unitsKey] = uniqueUnits.length;
					uniqueUnits.push(field.units);
				}
				if(field){
					if(table.secondaryHeaderFields.getLength() > 0){
						series = [];
						seriesMap = {};
						$.each(table.dataIndices, function(k, l){
							var currentRecord = table.dataRecords.get(l),
							currentDatum = parseFloat(field.dataCells[k].getValue().replace(dataRegex, '')),
							secondaryTitle = $.map(currentRecord.secondaryHeaderCells, function(c, n){
									return c.getValue();
								}).join(' ');
							
							currentDatum = !isNaN(currentDatum) ? currentDatum : null;
							
							var currentSeriesOpts = {
								'title' : fieldIndices.length > 1 ? fieldTitle + ' ' + secondaryTitle : secondaryTitle,
								'data' : [currentDatum],
								'units' : field.units,
								'axis' : axisIndex
							};
							
							if(currentSeriesOpts.title in seriesMap){
								seriesMap[currentSeriesOpts.title].data.push(currentDatum);
							}
							else{
								series.push(currentSeriesOpts);
								seriesMap[currentSeriesOpts.title] = currentSeriesOpts;
							}
						})
						return series;
					}
					else{
						serie = new Series({
							'title' : $.map(field.headerCells, function(c, i){
								return c.getValue();
							}).join(' '),
							'data' : $.map(field.dataCells, function(c, i){
								var val = parseFloat(
									c.getValue()
									// Strip letters, commas, and spaces
									.replace(dataRegex, '')
								)
								nonZeroMin |= val < 0;
								return !isNaN(val) ? val : [null];
							}),
							'units' : field.units,
							'axis' : axisIndex
						}); 
					}
					return serie;
				}
				else
					return [];
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
					}).join(' ');
				}),
				'autoParseCategories' : this.options.autoParseCategories
			});
			
			yAxes = $.map(uniqueUnits, function(u, i){
				var axis = new YAxis({
					'title' : u,
					'nonZeroMin' : nonZeroMin
				});
				return axis;
			});
			
			return {
				'title' : this.title + (fieldIndices.length == 1 ? ', ' + fieldTitle : ''),
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
						'name' : s.title + (chartData.yAxes.length > 1 ? '(' + s.units + ')' : ''),
						'data' : chartData.xAxis.isDateTime ? $.map(s.data,
							function(d, i){
								return [[chartData.xAxis.dateCategories[i], d]]
							}) : s.data,
						'yAxis' : s.axis
					}
				}),
				'legend' : {
					'enabled' : chartData.series.length > 1
				},
				'xAxis' : $.extend(true, {
					'categories' : chartData.xAxis.isDateTime ? void 0 :
						chartData.xAxis.categories,
					'type' : chartData.xAxis.isDateTime  ? 'datetime' : 'linear'
				}, baseOptions.xAxis),
				'yAxis' : $.map(chartData.yAxes, function(a, i){
					return $.extend(true, {
						'title' : {
							'text' : a.title,
							'align' : chartData.yAxes.length > 2 ? 'middle' : void 0
						},
						'min' : a.nonZeroMin ? null : 0,
						'opposite' : i % 2
					}, baseOptions.yAxis);
				})
			});
		}
	}, DataTable.prototype);
	/**
	 *	An extension of the MultiDataTable class.  Utilizes the ChartableTable class to
	 *	create a set of interactive chartable tables using checkboxes and buttons.
	 *
	 *	@class InteractiveChartableTable
	 *	@extends MultiDataTable
	 *	@constructor
	 **/
	var InteractiveChartableTable = createClass({
		/**
		 *	InteractiveChartableTable Constructor Function
		 *
		 *	@method init
		 *	@param tableEle {jQuery} The physical table to be proxied
		 *	@param options {array} An array of options objects from which to
		 *	generate the collection of datatables.  See jQuery.autoChart module
		 *	for documentation of the options structure and default values.
		 *	@param onCharted {function} A callback to be invoked when a charting
		 *	button is clicked.  The function should take an array of selectedfield
		 *	indices as an argument.
		 *	@param onSeriesSelected {function} A callback to be invoked when a
		 *	series is selected for charting in multi-chartable tables.  The function
		 *	should take an array of selected field indices as an argument.  Returning
		 *	false from the callback disables all unchecked checkboxes.  Returning true
		 *	form the callback enables all disabled checkboxes, and returning an array
		 *	of indices disables all checkboxes at the associated field indices.
		 **/
		init : function(tableEle, options, onCharted, onSeriesSelected){
			var chartableTable, valueCell, checkboxes, categoryCell,
			addRows = [], addColumns = [], addGroup, addArray, cloneCells,
			addIndex, categoryCellStartIndex, categoryCellEndIndex,
			buttons, checkbox, valueIndex, buttonCell, i, j, k,
			rowsAdded, columnsAdded, isMultiChartTable, intersects;
			
			this.$super(tableEle, options, ChartableTable);
			
			for(i=0; i<this.dataTables.length; i++){
				// The current chartable table being processed
				chartableTable = this.dataTables[i];
				// Is this a multichartable tabl
				isMultiChartTable = chartableTable.options.multiChart !== void 0 ?
					chartableTable.options.multiChart : chartableTable.valueFields.getLength() > 1;
				if(chartableTable.options.addControlCells !== false){
					// Are we adding columns or rows
					addGroup =  chartableTable.layout == 'vertical' ? addRows : addColumns;
					// The index for the ror/column to be added
					addIndex = chartableTable.options.controlsIndex ||
						chartableTable.headerIndices[chartableTable.headerIndices.length - 1];
					// The current row/column being processed, represented by an array
					addArray = addGroup[addIndex] || (addGroup[addIndex] = []);
					// The row/column indices where the category cell will start and end
					categoryCellStartIndex = /*chartableTable.hasSeconaryHeaders ?
						Math.min(chartableTable.categoryIndices[0], chartableTable.secondaryHeaderIndices[0]) :
						chartableTable.categoryIndices[0]*/0;
					categoryCellEndIndex = chartableTable.valueIndices[0];
					
					// Loop from the start and end indices for the category cell, adding it
					// to that position in the addArray, and incrementing its column/rowspan
					// for vertical/horizontal tables
					for(j=categoryCellStartIndex; j<categoryCellEndIndex; j++){
						// The category cell where we will add the graph and clear buttons for
						// multi-chartable tables, or a spacer for single chartable tables
						cloneCells = chartableTable.fieldCollection[j].cells;
						categoryCell = new Cell(
							{
								'element' : cloneCells[Math.min(cloneCells.length - 1, addIndex)].element.clone().empty().addClass('category_cell')
							}
						);
						categoryCell.setColspan(1, true);
						categoryCell.setRowspan(1, true);
						
						intersects = chartableTable.fieldCollection[j].intersects(addIndex + 1);
						addArray[j] = addArray[j] || intersects || categoryCell;
						if(intersects){
							chartableTable.layout == 'vertical' ?
								intersects.incrementRowspan(true) :
								intersects.incrementColspan(true);
						}
					}
					// If this is a multichartable table, create a jQuery collection to store the
					// checkboxes, used later when generating the charting buttons.
					if(isMultiChartTable)
						checkboxes = $();
					
					// Loop through the value indices, adding cells and checkboxes/buttons for multi/single
					// chartable tables
					for(j=0; j<chartableTable.valueIndices.length; j++){
						valueIndex = chartableTable.valueIndices[j];
						cloneCells = chartableTable.fieldCollection[valueIndex].cells;
						addArray[valueIndex] = valueCell = new Cell({
							'element' : cloneCells[Math.min(cloneCells.length - 1, addIndex)].element.clone().empty().addClass('value_cell')
						});
						valueCell.setColspan(1, true);
						valueCell.setRowspan(1, true);
						if(isMultiChartTable){
							checkboxes = checkboxes.add(checkbox = this.generateMultiChartCheckbox(valueIndex));
							valueCell.element.append(checkbox);
						}
						else{
							valueCell.element.append(this.generateSingleChartButton(valueIndex, chartableTable, onCharted))
						}
					}
					// If this is a multi-chartable table, create and add the charting buttons
					if(isMultiChartTable){
						buttons = this.generateMultiChartButtons(checkboxes, chartableTable, onCharted, onSeriesSelected);
						categoryCell.element.append(buttons.graphButton);
						categoryCell.element.append(buttons.clearButton);
					}
				}
				else{
					var controlsIndex = chartableTable.options.controlsIndex ||
						chartableTable.headerIndices[chartableTable.headerIndices.length - 1];;
					
					categoryCell = chartableTable.recordCollection[controlsIndex].cells[chartableTable.valueIndices[0] - 1];
					
					if(isMultiChartTable)
						checkboxes = $();
					
					// Loop through the value indices, adding cells and checkboxes/buttons for multi/single
					// chartable tables
					for(j=0; j<chartableTable.valueIndices.length; j++){
						valueIndex = chartableTable.valueIndices[j];
						valueCell = chartableTable.fieldCollection[valueIndex].cells[controlsIndex];
						if(isMultiChartTable){
							checkboxes = checkboxes.add(checkbox = this.generateMultiChartCheckbox(valueIndex));
							valueCell.element.append(checkbox);
						}
						else{
							valueCell.element.append(this.generateSingleChartButton(valueIndex, chartableTable, onCharted))
						}
					}
					
					if(isMultiChartTable){
						buttons = this.generateMultiChartButtons(checkboxes, chartableTable, onCharted, onSeriesSelected);
						categoryCell.element.append(buttons.graphButton);
						categoryCell.element.append(buttons.clearButton);
					}
				}
			}
			
			rowsAdded = 0;
			columnsAdded = 0;
			
			// Loop through the add rows and fill in any empty spots with new cells
			for(i=0; i<addRows.length; i++){
				if(addRows[i]){
					for(j=0; j<this.layoutTable.columns.length; j++){
						if(!addRows[i][j]){
							addRows[i][j] = new Cell();
						}
					}
				}
			}
			
			// Loop through the add columns, and fill in any empty spots by incrementing
			// the colspan of existing cells
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
			
			// Add the rows
			for(i=0; i<addRows.length; i++){
				if(addRows[i])
					this.layoutTable.addRow(i + rowsAdded++, addRows[i]);
			}
			// Add the columns
			for(i=0; i<addColumns.length; i++){
				if(addColumns[i])
					this.layoutTable.addColumn(i + columnsAdded++, addColumns[i]);
			}
		},
		
		generateMultiChartButtons : function(checkboxes, chartableTable, onCharted, onSeriesSelected){
			var graphButton = $(chartableTable.options.graphButtonHTML),
			clearButton = $(chartableTable.options.clearButtonHTML);
			
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
			
			if(onSeriesSelected){
				checkboxes.change(function(){
					var indices = [],
					disabledIndices;
					
					checkboxes.filter(':checked').each(function(i, ele){
						indices.push($(ele).data('index'));
					});
					disabledIndices = onSeriesSelected.call(chartableTable, indices);
					
					if(disabledIndices === false)
						checkboxes.not(':checked').attr('disabled', true);
					else if(disabledIndices instanceof Array)
						$.each(disabledIndices, function(i, j){
							checkboxes.eq(j).attr('disabled', true);
						});
					else
						checkboxes.filter(':disabled').attr('disabled', false);
					
				});
			}
			
			return {
				'graphButton' : graphButton,
				'clearButton' : clearButton
			};
		},
		
		generateMultiChartCheckbox : function(dataIndex){
			return $('<input></input>')
				.attr('type', 'checkbox')
				.data('index', dataIndex);
		},
		
		generateSingleChartButton : function(valueIndex, chartableTable, onCharted){
			button = $(chartableTable.options.singleChartButtonHTML);
			
			button.click(function(){
				onCharted.call(chartableTable, [valueIndex]);
			});
			
			return button;
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
			
			this.$super(tableEle, options,
			// onCharted
			function(indices){
				if(self.chart){
					self.chart.destroy();
					self.chart = null;
				}
				self.highchartsDiv.css(this.options.chartContainerStyles);
				self.highchartsLink.click();
				self.chart = new Highcharts.Chart(this.createHighchartOptions(indices,
					$.extend(true, {}, this.options.chartOptions, {
					chart : {
						renderTo : self.highchartsDiv.get(0)
					}
				})));
			},
			// onSeriesSelected
			function(indices){
				var table = this,
				unitsMap = {},
				// loop through the selected indices and generate an array of unique units
				unitsList = $.map(indices, function(i, j){
					var field = table.valueFields.get(i);
					var unitsKey = field.units.toLowerCase();
					
					if(!(unitsKey in unitsMap)){
						unitsMap[unitsKey] = true;
						return field.units;
					}
					else{
						return null;
					}
				});
				// if the current number of units equals the maxium number of chartable
				// units, return an array of indices related to non-charted units so that
				// the associated checkboxes will be disabled.
				if(unitsList.length == table.options.maxChartableUnits){
					return table.valueFields.map(function(i, j){
						var field = this;
						var unitsKey = field.units.toLowerCase();
						if(!(unitsKey in unitsMap))
							return i
						else
							return null
					});
				}
				else
					return true;
			});
		}
	}, InteractiveChartableTable.prototype);
	
	//////////////////////
	// Plugin Functions //
	//////////////////////
	
	function setOptions(options){
		userDefinedDefaultOptions = options;
	}
	
	$(function(){
		$('table.scrape-horizontal, table.scrape-vertical').each(function(){
			var tableEle = $(this);
			tableEle.autoChart(generateOptions(tableEle));
		});
	});

	$.fn.autoChart = function(options, urlOverride){
		if(urlOverride === void 0) urlOverride = 'autochart';
		if(!urlOverride || !~window.location.search.indexOf(urlOverride + '=false'))
			return new FancyboxChartableTable(this, options);
		else
			return void 0
	};
	
	$.extend($.fn.autoChart, {
		// Functions
		'setOptions' : setOptions,
		// Constructors
		'TableElement' : TableElement,
		'Cell' : Cell,
		'CellCollection' : CellCollection,
		'Row' : Row,
		'LayoutTable' : LayoutTable,
		'DataTable' : DataTable,
		'MultiDataTable' : MultiDataTable,
		'ChartableTable' : ChartableTable,
		'InteractiveChartableTable' : InteractiveChartableTable,
		'FancyboxChartableTable' : FancyboxChartableTable
	});
	
}(jQuery))