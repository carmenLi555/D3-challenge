// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("height", height)
  .attr("width", width)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

//create a scatter plot that represents each state with circle elements.
//Include state abbreviations in the circles.
// Create and situate your axes and labels to the left and bottom of the chart.
//`Healthcare vs. Poverty
d3.csv("/assets/data/data.csv").then(function(RiskData) {
  RiskData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    state=data.abbr;
  });
    
  var xScale = d3.scaleLinear()
    .domain([2,d3.max(RiskData, d => d.poverty)])
    .range([0, width]);
      
  var yScale = d3.scaleLinear()
    .domain([2, d3.max(RiskData, d => d.healthcare)])
    .range([height, 0]);
      
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);
      
  chartGroup.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);
  
  chartGroup.append("g")
   .attr("stroke", "green") // NEW!
   .call(leftAxis);
   
  var circlesGroup = chartGroup.selectAll("circle")
    .data(RiskData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", "10");
      

      // state name to show on the circle

 chartGroup.selectAll("text")
    .data(RiskData)
    .enter()
    .append("text")
    .attr("x", (d,i) => xScale(d.poverty))
    .attr("y", d => (yScale(d.healthcare-0.20)))
    .classed("stateText", true)
    .text(d => d.abbr)
    .on("mouseover", function(d) {
      toolTip.show(d);
    })
    .on("mouseout", function(d,i) {
      toolTip.hide(d);
    });

  // tooltip set up
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .style("position", "absolute")
    .style("background", "lightsteelblue")
    .style("pointer-events", "none")
    .html(function(d) {
      return (`${d.abbr} <br> Poverty: ${d.poverty} <hr> Healthcare (%) ${d.healthcare}`);
    });
  chartGroup.call(toolTip);

          
  circlesGroup.on("click", function(d) {
    toolTip.show(d, this);
  }) 
  .on("mouseout", function(d) {
    toolTip.hide(d);
  });
  
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("In Poverty (%)");
      
    // Step 4: Create "mouseout" event listener to hide tooltip
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");
      

}).catch(function(error) {
  console.log(error);
});

        // Step 5: Create Circles
        // ==============================
      //var elemEnter = elem.enter() 
      //.append("g")
      //.attr("transform", function(d){return "translate("+d.x+",80)"})

        /* Create the text for each block */
      ///elemEnter.append("text")
      //.attr("dx", function(d){return -20})
      //.text(function(d){return d.abbr})