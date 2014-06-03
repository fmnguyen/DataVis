var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 800 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
	.domain([1994, 2012])
	.range([0, width]);

var y = d3.scale.linear()
	.domain([0,120])
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

d3.csv("../data/argentina.csv", type, function(error, data) {
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
							.enter().append("rect")
							.attr("class", "bar")
					    .attr("x", function(d) { return x(d.year) + 18; })
					    .attr("y", function(d) { return y(Math.round(d.rural * 100) / 100); })
					    .attr("height", function(d) { return height - y(Math.round(d.rural * 100) / 100); })
					    .attr("width", 25)
					    .attr("transform", "translate(0, -0.55)")
					    .style("opacity", "0.75")
					    .attr("fill", function(d) { count+=2; return "rgb(53, 214, " + ((90 + 3 * count) % 255) + ")"});

		bar.append("g")
			.append("text")
		    .attr("y", 5)
		    .attr("x", 0)
		    //.attr("dy", "1em")
		    .text(function(d) { return Math.round(d.rural * 100) / 100; })
		    .style("color", "black")
		    .style("font-size", "16pt");

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
			.attr("dy", "-3.8em")
			.style("text-anchor", "end")
			.text("Rural Population (% of Total Population)");
		
		//createTags(data);
	}		
});

function update() {
	d3.csv("../data/cambodia.csv", type, function(error, data) {
	  	//y.domain([d3.min(data, function(d) { return d.rural;}) - 10
	  	//	, 5 + d3.max(data, function(d) { return d.rural; })]);

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
		    	.attr("dy", "-3.8em")
		    	.style("text-anchor", "end")
		    	.text("Rural Population (% of Total Population)");

	  	chart.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.year) + 18; })
			.attr("width", 25)
			.attr("y", function(d) { return y(Math.round(d.rural * 100) / 100); })
			.attr("height", function(d) { return height - y(Math.round(d.rural * 100) / 100); })

	    // update axes
		chart.select(".x")
			.remove()
			.attr("transform", "translate(45," + height + ")")
			.call(xAxis);
		chart.select(".x")
			.attr("transform", "translate(30," + height + ")");

		chart.select(".y")
			.remove()
			.attr("transform", "translate(0,0)")
			.call(yAxis);
  		
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
		        .text("Cambodia: Rural Population vs Years Graph");

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

var footer = d3.select("body")
				.append("div")
				.attr("class", "footer")
				.text("@author: Francis Nguyen")
				.style("font-size", "8px");


function createTags(data) {
	console.log(data)
	d3.select(".country")
		.selectAll("div")
		.data(data)
		.enter()
		.append("div")
		.text(function(d){	
			console.log(d); 
			return d["Year"];	
		});
}


