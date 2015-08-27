var margin = {top: 20, right: 30, bottom: 30, left: 50},
	width = 600 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

var years = d3.scale.linear()
	.domain([1994, 2012])
	.range([0, width]);

var population = d3.scale.linear()
	.domain([0,100])
    .range([height, 0]);

var gni = d3.scale.linear()
	.domain([0,55000])
	.range([height, 0]);

var infant = d3.scale.linear()
	.domain([0, 130])
	.range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(years)
	.orient("bottom")
	.ticks(19)
	.tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
	.scale(population)
	.ticks(10)
	.orient("left");

var gniAxis = d3.svg.axis()
	.scale(gni)
	.ticks(20)
	.orient("left");

var infantAxis = d3.svg.axis()
	.scale(infant)
	.ticks(10)
	.orient("left");

d3.select("body")
	.append("svg")
	.attr("class", "chart");
d3.select("body")
	.append("svg")
	.attr("class", "chart2");

var chart1 = d3.select(".chart")
				.attr("width", width + 30 + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
					.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart2 = d3.select(".chart2")
				.attr("width", width + 30 + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
					.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var codes = new Object();
	codes["Argentina"] = "ARG";
	codes["Cambodia"] = "KHM";
	codes["United States"] = "USA";
	codes["Congo, Democratic Republic"] = "COD";
	codes["Haiti"] = "HTI";
	codes["Moldova"] = "MDA";
	codes["Paraguay"] = "PRY";
	codes["Iceland"] = "ISL";
	codes["Japan"] = "JPN";
	codes["Seychelles"] = "SYC";

function get(key) {
	return codes[key];
}

var map;

var norm = "Argentina";	
d3.csv("./data/" + norm.toLowerCase() + ".csv", type, function(error, data) {
	if(error) 
		console.log(error)
	else {
		console.log(data)
	
	var count = 1;
	var bar = chart1.selectAll("g")
		.attr("class", "data")
		.data(data)
		.enter().append("g")
		.selectAll(".bar")
			.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		    .attr("x", function(d) { return years(d.year) + 22; })
		    .attr("y", function(d) { return population(Math.round(d.rural * 100) / 100); })
		    .attr("height", function(d) { return height - population(Math.round(d.rural * 100) / 100); })
		    .attr("width", 15)
		    .attr("transform", "translate(0, -0.55)")
		    .attr("fill", function(d) { count+=2; return "rgb(53, 214, " + ((90 + 3 * count) % 255) + ")"});

	chart1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(30," + height + ")")
		.call(xAxis);

		// Add title to graph
		chart1.append("g")
			.attr("class", "y axis")
			.call(yAxis)
				.append("text")
			.attr("class", "title")
			.attr("x", width + 35)             
	        .attr("y", (height /  60))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "14px") 
	        .style("font-weight", "100")
	        .style("font-family", "Helvetica Neue")
	        .text(norm + ": Rural Population Percentage vs Years");

	// Append the metric title for y-axis
	chart1.append("g")
		.attr("class", "y axis")
		.call(yAxis)
			.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 15)
		.attr("dy", "-4.5em")
		.style("text-anchor", "end")
		.style("font-size", "10px")
		.text("Rural Population (% of Total Population)");

/***************************** BREAK BETWEEN CHARTS ****************************/

		count = 1;
		bar = chart2.selectAll("g")
				.attr("class", "data")
				.data(data)
				.enter().append("g")
			.selectAll(".bar")
					.data(data)
			.enter().append("rect")
				.attr("class", "bar")
			    .attr("x", function(d) { return years(d.year) + 22; })
			    .attr("y", function(d) { return infant(Math.round(d.infant_mortality * 100) / 100); })
			    .attr("height", function(d) { return height - infant(Math.round(d.infant_mortality * 100) / 100); })
			    .attr("width", 15)
			    .attr("transform", "translate(0, -0.55)")
			    .attr("fill", function(d) { count+=2; return "rgb(254, 185, " + ((90 + 3 * count) % 255) + ")"});

		chart2.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(30," + height + ")")
			.call(xAxis);

  		// Add title to graph
  		chart2.append("g")
			.attr("class", "y axis")
			.call(infantAxis)
			.append("text")
			.attr("class", "title")
			.attr("x", width + 35)             
	        .attr("y", (height /  60))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "14px") 
	        .style("font-weight", "100")
	        .style("font-family", "Helvetica Neue")
	        .text(norm + ": Infant Mortality Rate vs Years");

		// Append the metric title for y-axis
		chart2.append("g")
			.attr("class", "y axis")
			.call(infantAxis)
				.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 15)
			.attr("dy", "-4.5em")
			.style("text-anchor", "end")
			.style("font-size", "10px")
			.text("Infant Mortality Rate (Per 1000 Live Births)");

	}		
});

function updateA(country) {
	var path = "../data/" + country.toLowerCase() + ".csv";
	d3.csv(path, type, function(error, data) {
		chart1.select(".y").remove();
		
		chart1.selectAll("rect")
			.style("opacity", "0.8");
		
		chart1.select(".y").remove();

	  	chart1.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(xAxis);

	 	 chart1.append("g")
		    	.attr("class", "y axis")
		    	.call(yAxis)
		    .append("text")
		    	.attr("transform", "rotate(-90)")
		    	.attr("y", 15)
		    	.attr("dy", "-4.5em")
		    	.style("text-anchor", "end")
				.style("font-size", "10px")
		    	.text("Rural Population (% of Total Population)");

	    // update axes
		chart1.select(".x")
			.remove()
			.attr("transform", "translate(45," + height + ")")
			.call(xAxis);

		chart1.select(".x")
			.attr("transform", "translate(30," + height + ")");
  		
  		// Add title to graph
  		chart1.append("g")
  				.attr("class", "y axis")
 				.call(yAxis)
 				.append("text")
 				.attr("class", "title")
 				.attr("x", width + 35)             
		        .attr("y", (height /  60))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "14px") 
		        .style("font-weight", "100")
		        .style("font-family", "Helvetica Neue")
		        .text(country.charAt(0).toUpperCase() + country.slice(1) 
		        	+ ": Rural Population Percentage vs Years");

		// update bars
		var sel = chart1.selectAll(".bar").data(data);

		// add new bars
		sel.enter().append("rect")
			.attr("class", "bar");

		// update existing (and new) bars
		sel.transition()
			.duration(1000)
			.attr("x", function(d) { return years(d.year) + 22; })
			.attr("width", 15)
			.attr("y", function(d) { return population(Math.round(d.rural * 100) / 100); })
			.attr("height", function(d) { return height - population(Math.round(d.rural * 100) / 100); })
		
		// remove bars no longer present
		sel.exit().remove();
	})
}

/***************************** BREAK BETWEEN CHARTS ****************************/

function updateB(country) {
	var path = "../data/" + country.toLowerCase() + ".csv";
	d3.csv(path, type, function(error, data) {
		chart2.select(".y").remove();

		chart2.selectAll("rect")
			.style("opacity", "0.8");

		chart2.select(".y").remove();

	  	chart2.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(xAxis);

	 	 chart2.append("g")
		    	.attr("class", "y axis")
		    	.call(infantAxis)
		    .append("text")
		    	.attr("transform", "rotate(-90)")
		    	.attr("y", 15)
		    	.attr("dy", "-4.5em")
		    	.style("text-anchor", "end")
				.style("font-size", "10px")
		    	.text("Infant Mortality Rate (Per 1000 Live Births)");

	    // update axes
		chart2.select(".x")
			.remove()
			.attr("transform", "translate(45," + height + ")")
			.call(xAxis);

		chart2.select(".x")
			.attr("transform", "translate(30," + height + ")");
  		
  		// Add title to graph
  		chart2.append("g")
  				.attr("class", "y axis")
 				.call(infantAxis)
 				.append("text")
 				.attr("class", "title")
 				.attr("x", width + 35)             
		        .attr("y", (height /  60))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "14px") 
		        .style("font-weight", "100")
		        .style("font-family", "Helvetica Neue")
		        .text(country.charAt(0).toUpperCase() + country.slice(1) 
		        	+ ": Infant Mortality Rate vs Years");

		// update bars
		var sel = chart2.selectAll(".bar").data(data);

		// add new bars
		sel.enter().append("rect")
			.attr("class", "bar");

		// update existing (and new) bars
		sel.transition()
			.duration(1000)
			.attr("x", function(d) { return years(d.year) + 22; })
			.attr("width", 15)
			.attr("y", function(d) { return infant(Math.round(d.infant_mortality * 100) / 100); })
			.attr("height", function(d) { return height - infant(Math.round(d.infant_mortality * 100) / 100); })
		
		// remove bars no longer present
		sel.exit().remove();
	})
}

function type(d) {
		d.rural = +d.rural;
		d.urban = +d.urban;
		d.infant_mortality = +d.infant_mortality;
		return d;
}

$('button').on('click', function (d) {
	var valueSelected = this.value;
	//if($(this).parent().data("chart") == "a")
		updateA("" + valueSelected);
	//else 
		updateB("" + valueSelected);
});

var footer = d3.select("body")
				.append("div")
				.attr("class", "footer")
				.text("@author: Francis Nguyen")
				.style("font-size", "6px");


/********************************/
/* World Map Visualization Code */
/********************************/

window.onload = function(){
	var container = document.getElementById("map");
	container.style.width = window.innerWidth / 2;
	container.style.height = window.innerHeight / 1.2;

	map = new Datamap({
		element: document.getElementById("map"),
		projection: 'mercator',
		dataUrl: "../data/cambodia.csv",
		fills: {
            0: 'rgb(181, 207, 137)',
            10: 'rgb(166, 198, 150)',
            20:'rgb(154, 191, 161)',
            30: 'rgb(150, 189, 164)',
            40: 'rgb(147, 187, 167)',
            50: 'rgb(140, 182, 173)',
            60:'rgb(134, 179, 178)',
            70: 'rgb(126, 174, 185)',
            80: 'rgb(122, 172, 189)',
            90:'rgb(119, 170, 191)',
            100: 'rgb(119, 170, 192)',

            UNKNOWN: 'rgb(245,245,245)',
            defaultFill: 'rgb(240,240,240)'
        },
        data: {
            KHM: {
                fillKey: '90',
            },
            USA: {
                fillKey: '20',
            },
            ARG: {
            	fillKey: "0"
            },
            COD: {
            	fillKey: "70"
            },
            HTI: {
            	fillKey: "70"
            },
            MDA: {
            	fillKey:"50"
            },
            PRY: {
            	fillKey:"50"
            },
            ISL: {
            	fillKey:"0"
            },
            JPN: {
            	fillKey:"20"
            },
            SYC: {
            	fillKey: "50"
            }
        }
	});
	
	d3.select("body").append("text")
		.attr("class", "year")
		.text("1994")
		.attr("font-size", "30px");
	
	map.legend();

	console.log(map.options.data["ARG"].fillKey)
	$(".chartA").data("chart", "a");
	$(".chartB").data("chart", "b");

}

var current = 1994;

window.setInterval(function(){
	current++;
	if(current > 2012)
		current = 1994;
	d3.select(".year").text(current);
	d3.csv("./data/master_dataset.csv", function(data) {
		for(var i = 0; i < data.length; i++) {
			var d = data[i];
			var cont = get(d.country);
			d.year = +d.year;
			if(d.year == current && cont != "SYC") {
			}
		}
	});
}, 4000);


