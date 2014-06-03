window.onload = function() {
	var width = 900,
		height = 500;

	var y = d3.scale.linear()
	    .range([height, 0]);

	d3.select("body")
		.append("svg")
		.attr("class", "chart");

	d3.select("body")
		.append("svg")
		.attr("class", "country");

	var chart = d3.select(".chart")
					.attr("width", width)
					.attr("height", height);

	d3.csv("../data/argentina.csv", type, function(error, data) {
		if(error) 
			console.log(error)
		else {
			console.log(data)
			y.domain([0, d3.max(data, function(d) { return Math.round(Math.round(d.rural * 100) / 100 * 100) / 100; })]);
			var barWidth = width / data.length;

			var bar = chart.selectAll("g")
      						.data(data)
   							.enter().append("g")
       						.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)" ; });

			bar.append("rect")
				.attr("y", function(d){return y(Math.round(d.rural * 100) / 100)})
			    .attr("height", function(d) { return height - y(Math.round(d.rural * 100) / 100) })
			    .attr("width", barWidth - 1);

			bar.append("text")
			    .attr("y", function(d) { return y(Math.round(d.rural * 100) / 100) + 3; })
			    .attr("x", barWidth / 1.4)
			    .attr("dy", "1em")
			    .text(function(d) { return Math.round(d.rural * 100) / 100; });
			
			//createTags(data);
		}		
	});

	function type(d) {
 		d.rural = +d.rural;
  		return d;
	}


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


