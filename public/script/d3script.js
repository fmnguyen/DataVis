var margin = {top: 20, right: 30, bottom: 30, left: 50},
	width = 800 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
	.domain([1994, 2012])
	.range([0, width]);

var y = d3.scale.linear()
	.domain([0,20])
    .range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(19)
	.tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
	.scale(y)
	.ticks(10)
	.orient("left");

d3.select("body")
	.append("svg")
	.attr("class", "chart");

/*d3.select("body")
	.append("svg")
	.attr("class", "country");
*/

var chart = d3.select(".chart")
				.attr("width", width + 30 + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
					.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var norm = "argentina";

d3.csv("./data/" + norm + ".csv", type, function(error, data) {
	if(error) 
		console.log(error)
	else {
		console.log(data)
		//y.domain([0, d3.max(data, function(d) { return Math.round(d.rural * 100) / 100; })]);
		
		var count = 1;
		var bar = chart.selectAll("g")
						.attr("class", "data")
						.data(data)
						.enter().append("g")
					.selectAll(".bar")
  						.data(data)
  						.style("opacity", "0.2")
					.enter().append("rect")
						.attr("class", "bar")
					    .attr("x", function(d) { return x(d.year) + 18; })
					    .attr("y", function(d) { return y(Math.round(d.rural * 100) / 100); })
					    .attr("height", function(d) { return height - y(Math.round(d.rural * 100) / 100); })
					    .attr("width", 25)
					    .attr("transform", "translate(0, -0.55)")
					    .attr("fill", function(d) { count+=2; return "rgb(53, 214, " + ((90 + 3 * count) % 255) + ")"});

		chart.append("g")
 				.attr("class", "x axis")
  				.attr("transform", "translate(30," + height + ")")
  				.call(xAxis);

  		// Add title to graph
  		chart.append("g")
  				.attr("class", "y axis")
 				.call(yAxis)
 				.append("text")
 				.attr("class", "title")
 				.attr("x", 1100 / 1.75)             
		        .attr("y", (height /  60))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "26px") 
		        .style("font-weight", "100")
		        .style("font-family", "Helvetica Neue")
		        .text("Argentina: Rural Population vs Years Graph");

		// Append the metric title for y-axis
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
				.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 15)
			.attr("dy", "-4.5em")
			.style("text-anchor", "end")
			.style("font-size", "12px")
			.text("Rural Population (% of Total Population)");
	}		
});

function update(country) {
	var path = "../data/" + country + ".csv";
	d3.csv(path, type, function(error, data) {
		chart.select(".y").remove();

	  	y.domain([d3.min(data, function(d) {return d.rural;}), 
	  			d3.max(data, function(d) {return d.rural;})]);
		
		chart.selectAll("rect")
			.style("opacity", "0.7");
		
		chart.select(".y").remove();

	  	chart.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(xAxis);

	 	 chart.append("g")
		    	.attr("class", "y axis")
		    	.call(yAxis)
		    .append("text")
		    	.attr("transform", "rotate(-90)")
		    	.attr("y", 15)
		    	.attr("dy", "-4.5em")
		    	.style("text-anchor", "end")
				.style("font-size", "12px")
		    	.text("Rural Population (% of Total Population)");

	  	chart.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
			.attr("class", "newbar")
			.attr("x", function(d) { return x(d.year) + 18; })
			.attr("width", 25)
			.attr("y", function(d) { return y(Math.round(d.rural * 100) / 100); })
			.attr("height", function(d) { return height - y(Math.round(d.rural * 100) / 100); });

	    // update axes
		chart.select(".x")
			.remove()
			.attr("transform", "translate(45," + height + ")")
			.call(xAxis);

		chart.select(".x")
			.attr("transform", "translate(30," + height + ")");
  		
  		// Add title to graph
  		chart.append("g")
  				.attr("class", "y axis")
 				.call(yAxis)
 				.append("text")
 				.attr("class", "title")
 				.attr("x", 1100 / 1.75)             
		        .attr("y", (height /  60))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "26px") 
		        .style("font-weight", "100")
		        .style("font-family", "Helvetica Neue")
		        .text(country.charAt(0).toUpperCase() + country.slice(1) 
		        	+ ": Rural Population vs Years Graph");

		// update bars
		var sel = chart.selectAll(".bar").data(data);

		// add new bars
		sel.enter().append("rect")
			.attr("class", "bar");

		// update existing (and new) bars
		sel.transition()
			.duration(1000)
			.attr("x", function(d) { return x(d.year) + 18; })
			.attr("width", 25)
			.attr("y", function(d) { return y(Math.round(d.rural * 100) / 100); })
			.attr("height", function(d) { return height - y(Math.round(d.rural * 100) / 100); })
		
		// remove bars no longer present
		sel.exit().remove();
	})
}

function type(d) {
		d.rural = +d.rural;
		return d;
}

$('select').on('change', function (d) {
	var optionSelected = $("", this);
	var valueSelected = this.value;
	update("" + valueSelected);

});


var footer = d3.select("body")
				.append("div")
				.attr("class", "footer")
				.text("@author: Francis Nguyen")
				.style("font-size", "8px");


