YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Cell",
        "CellCollection",
        "Column",
        "DataCollection",
        "DataTable",
        "DynamicClass",
        "Field",
        "InteractiveChartableTable",
        "LayoutTable",
        "MultiDataTable",
        "Record",
        "Row",
        "SparseDataCollection",
        "TableElement"
    ],
    "modules": [
        "jQuery.autoChart"
    ],
    "allModules": [
        {
            "displayName": "jQuery.autoChart",
            "name": "jQuery.autoChart",
            "description": "The jQuery.autoChart plugin scrapes html tables, and exposes the data\nfor charting.  The plugin can also add a set of controls to the table\nto allow for series selection, and charting using Highcharts in a\nfancybox modal window.\n\n\tdefaultOptions = {\n\n\t\t//\tSpecifies the layout of the table.  A horizontal table has its\n\t\t//\trecords as columns, and it's fields as rows. A vertical table\n\t\t//\thas its records as rows, and fields as columns.\n\n\t\tlayout : 'horizontal',\n\n\t\t//\tSpecify either a text value, or a column/row address for the\n\t\t//\tTitle.  Optionally, a regular expression and a match index\n\t\t//\tcan be provided to extract a portion of the text in a cell.\n\t\t//\t\n\t\t//\ttitle : {\n\t\t//\t\ttext : (String or undefined)\n\t\t//\t\trow : (Number or undefined)\n\t\t//\t\tcolumn : (Number or undefined)\n\t\t//\t\tregex : {\n\t\t//\t\t\tpattern : (String or RegEx)\n\t\t//\t\t\tmatch : (Number)\n\t\t//\t\t}\n\t\t//\t}\n\t\t\n\t\ttitle : void 0,\n\t\n\t\t//\tSame as title but for the chart units.  Additionally for the\n\t\t//\tunits, if only a row or column is provided, it is assumed\n\t\t//\tthat the record contains multiple units that are associated\n\t\t//\twith various fields.  This allows for multiple units to be\n\t\t//\tcontained in the same table.\n\t\t//\t\n\t\t//\tunits : {\n\t\t//\t\ttext : (String or undefined)\n\t\t//\t\trow : (Number or undefined)\n\t\t//\t\tcolumn (Number or undefined)\n\t\t//\t\tregex : {\n\t\t//\t\t\tpattern : (String or RegEx)\n\t\t//\t\t\tmatch : (Number)\n\t\t//\t\t}\n\t\t//\t}\n\n\t\tunits : void 0,\n\t\n\t\t//\tFormat is {Number} for a specific record, {Number}-{Number}\n\t\t//\tfor a range, and {Number}+ for all records after and including a\n\t\t//\tspecific record.\n\t\t\n\t\theader : void 0,\n\t\t\n\t\t//\tSame as header but for the data (data) records.\n\t\t\n\t\tdata : void 0,\n\t\t\n\t\t//\tSame as header but for the footer rows (footers are always rows).\n\t\t\n\t\tfooter : void 0,\n\t\t\n\t\t//\tSame as header but for the category fields\n\t\t\n\t\tcategory : void 0,\n\t\t\n\t\t//\tSame as header but for the value fields\n\t\t\n\t\tvalue : void 0,\n\t\t\n\t\t//\tSpecifies a record index to insert the charting controls,\n\t\t//\tdefaults to the last header record\n\t\t\n\t\tcontrolsIndex : void 0,\n\t\t\n\t\t//\tSpecifies whether or not the table supports multi-charting,\n\t\t//\tdefaults to true for multi-field and false for single-field\n\t\t//\ttables\n\t\n\t\tmultiChart : void 0,\n\n\t\t// The maximum number of value fields units that can be charted at one time.\n\n\t\tmaxChartableUnits : 4\n\t};"
        }
    ]
} };
});