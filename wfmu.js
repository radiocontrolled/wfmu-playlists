
//width and height of the canvas
var w =  document.body.clientWidth;
var h =  document.body.clientHeight;
var r = 7;
var padding = 100;


/* 
 * How many playlists are Free Music Archive curators contributing to the archive?
 */

/*
 * grab json file of recent tracks added to the FMA archive
 * see http://freemusicarchive.org/api/docs/ for more details
 */
function requestCurators() {
  d3.jsonp("http://freemusicarchive.org/api/get/curators.jsonp?callback=foo&limit=200&sort_by=curator_playlists&sort_dir=desc");
}

function foo(data){
	
	var color = d3.scale.category10(); 
        
        var result = {};
        for(var i = 0; i < data.dataset.length; i++){
                
                /*
                 * count the # of times a curator appears
                 * store it in the result object
                 */
                if(!result[data.dataset[i].curator_playlists])
        		 result[data.dataset[i].curator_playlists] = 0;
                 ++result[data.dataset[i].curator_playlists];
        }
	
	    var scatterCoordinates = []; 
		for( var i in result ) {
	    	
	    		/*
	    		 * convert the result object into an array
	    		 * change the key from a string to an integer
	    		 */
	       		scatterCoordinates.push([result[i],parseInt(i)]);
	    	
	    }
	    console.log(scatterCoordinates);
	    
	 //make an SVG element and append it to the article
	 var svg = d3.select("article")
		.append("svg")
	    .attr("viewBox", "0 0 " + w + " " + h )
        .attr("preserveAspectRatio", "xMidYMid meet");
        
    
    /* 
     * create the circles of the scatterplot
     * 0 value is the number of people
     * 1 value is the number of curator playlists
     */
    
    //scales 
    var xScale = d3.scale.linear()
		.domain([0, d3.max(scatterCoordinates, function(d) { return d[1]; })])
        .range([0 + padding, w-padding]);
    
    var yScale = d3.scale.linear()
    	.domain([1, d3.max(scatterCoordinates, function(d) { return d[0]+2; })])
        .range([0 + padding, h]);
            
    var yAxisScale = d3.scale.linear()
    	.domain([1, d3.max(scatterCoordinates, function(d) { return d[0]; })])
        .range([h-padding,0]);
    
    
    var circles = svg.selectAll("circle")
    	.data(scatterCoordinates)
    	.enter()
    	.append("circle")
    	.attr("cx", function(d) {
        	//return d[0];
	   		return xScale(d[1]);
	   	})
	    .attr("cy", function(d) {
	       // return d[1];
	       return h - yScale(d[0]);
	   	})
	    .attr("r", r)
	    .style("fill", function(d,i){
			return color(Math.floor((d[1])));
		});

	
	/*
	svg.selectAll("text")
   	    .data(scatterCoordinates)
        .enter()
        .append("text")
        .text(function(d) {
        	return d[0] + "," + d[1];
        })
        .attr("x", function(d) {
        	//return d[1];
        	return xScale(d[1]) - padding;
   		})
   		.attr("y", function(d) {
        	//return h - d[0];
        	return h - yScale(d[0]) ;
   		})
        .style({  
			"fill": "black",
      		"font-family": "Trebuchet MS,​Lucida Grande,​Arial,​sans-serif",
      		"font-size": "12px",
      		"font-weight": "600"
		})*/
		
	


	var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("class","axis")
        .style({  
			"fill": "black",
      		"font-family": "Trebuchet MS,​Lucida Grande,​Arial,​sans-serif",
      		"font-size": "12px",
      		"font-weight": "600"
		})
    	.call(xAxis);
    	
    var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left");
       
	svg.append("g")
   		.attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .style({  
			"fill": "black",
      		"font-family": "Trebuchet MS,​Lucida Grande,​Arial,​sans-serif",
      		"font-size": "12px",
      		"font-weight": "600"
		})
        .call(yAxis);
        
    svg.append("text")
    	.attr("text-anchor", "end")
    	.attr("x", w-padding)
    //	.attr("dx", "-70%")
    	.attr("dy", "-4em")
    	.attr("y", h)
    	.text("Number of Free Music Archive playlists")
    	.style({  
			"fill": "black",
      		"font-family": "Trebuchet MS,​Lucida Grande,​Arial,​sans-serif",
      		"font-size": "12px",
      		"font-weight": "600"
		});
	
	svg.append("text")
    	.attr("class", "y label")
    	.attr("text-anchor", "end")
    	.attr("y", 6)
    	//.attr("dx", "-25%")
    	.attr("dy", "4em")
    	.attr("transform", "rotate(-90)")
    	.text("Number of Free Music Archive curators")
    	.style({  
			"fill": "black",
      		"font-family": "Trebuchet MS,​Lucida Grande,​Arial,​sans-serif",
      		"font-size": "12px",
      		"font-weight": "600"
		});
	
}

requestCurators();