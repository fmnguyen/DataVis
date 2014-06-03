window.onload = function() {

	var margin = {top: 20, right: 30, bottom: 30, left: 40},
    	width = 800 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.domain([1994, 2012])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([0,14])
	    .range([height, 0]);

	var xaxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(19)
		.tickFormat(d3.format("d"));

	var yaxis = d3.svg.axis()
		.scale(y)
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

			chart.append("g")
     				.attr("class", "x axis")
      				.attr("transform", "translate(30," + height + ")")
      				.call(xaxis);

      		chart.append("g")
      				.attr("class", "y axis")
     				.call(yaxis)
     				.append("text")
     				.attr("x", 1100/2)             
			        .attr("y", (height /  15))
			        .attr("text-anchor", "middle")  
			        .style("font-size", "26px") 
			        .style("font-weight", "100")
			        .style("font-family", "Helvetica Neue")
			        .text("Rural Population vs Years Graph");

			chart.append("g")
    			.attr("class", "y axis")
    			.call(yaxis)
 				.append("text")
    			.attr("transform", "rotate(-90)")
    			.attr("y", 15)
    			.attr("dy", "-3.8em")
    			.style("text-anchor", "end")
    			.text("Rural Population (% of Total Population)");

    		var count = 1;
			var bar = chart.selectAll(".bar")
      						.data(data)
   							.enter().append("rect")
   							.attr("class", "bar")
						    .attr("x", function(d) { return x(d.year) + 18; })
						    .attr("y", function(d) { return y(Math.round(d.rural * 100) / 100); })
						    .attr("height", function(d) { return height - y(Math.round(d.rural * 100) / 100); })
						    .attr("width", 25)
						    .attr("transform", "translate(0, -0.55)")
						    .attr("fill", function(d) { count+=2; return "rgb(53, 214, " + ((90 + 3 * count) % 255) + ")"});

			bar.append("text")
			    .attr("y", function(d) { return y(Math.round(d.rural * 100) / 100) + 3; })
			    .attr("x", 20 / 1.4)
			    .attr("dy", "1em")
			    .text(function(d) { return Math.round(d.rural * 100) / 100; })
			    .style("color", "black");
			

			//createTags(data);
		}		
	});

	function type(d) {
 		d.rural = +d.rural;
  		return d;
	}

	var footer = d3.select("body")
					.append("div")
					.attr("class", "footer")
					.text("@author: Francis Nguyen")
					.style("font-size", "8px");

}

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


