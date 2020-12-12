/*\
title: $:/plugins/techpad/widgets/mode-guards/dev-guard
type: application/javascript
module-type: widget

Reveal widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;
var Chart = require("$:/plugins/rimir/chartjs/scripts/ChartLib").Chart;

var ChartWidget = function(parseTreeNode,options) {
	console.log("Calling Constructor");
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ChartWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ChartWidget.prototype.render = function(parent,nextSibling) {
	console.log("Calling render");
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	//if(!this.canvasNode){
		this.canvasNode = this.document.createElement("canvas");
		parent.insertBefore(this.canvasNode,nextSibling);
		this.domNodes.push(this.canvasNode);
	//}
	this.initializeChart();
};

ChartWidget.prototype.initializeChart = function() { 
	console.log("Calling initializeChart");
	let ctx = this.canvasNode.getContext('2d');
	let data = JSON.parse($tw.wiki.renderTiddler("text/plain", this.dataTiddler));
	this.chart = new Chart(ctx, data);
}

ChartWidget.prototype.updateChart = function() { 
	console.log("Calling updateChart");
	let result = false;
	let data = JSON.parse($tw.wiki.renderTiddler("text/plain", this.dataTiddler));
	for (let i = 0; i < data.data.datasets.length; i++) {
		const dataset = data.data.datasets[i];
		for (let j = 0; j < dataset.data.length; j++) {
			const data = dataset.data[j];
			if(this.chart.data.datasets[i].data[j] !== data){
				result = true;
			}
			this.chart.data.datasets[i].data[j] = data;
		}
	}
	if(result){
		this.chart.update();
	}
	return result;
}
	
/*
Compute the internal state of the widget
*/
ChartWidget.prototype.execute = function() {
	console.log("Calling execute");
	// Get parameters from our attributes
	this.dataTiddler = this.getAttribute("data-tiddler");
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ChartWidget.prototype.refresh = function(changedTiddlers) {
	console.log("Calling refresh");
	console.log(changedTiddlers);
	// Re-execute the filter to get the count
	this.computeAttributes();
	this.execute();
	return this.updateChart();
	/*if(changedTiddlers[this.dataTiddler]) {
		// Regenerate and rerender the widget and replace the existing DOM node
		//this.refreshSelf();
		this.updateChart();
		return true;
	} else {
		return false;
	}*/
};

exports.chartjs = ChartWidget;

})();
