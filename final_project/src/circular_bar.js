const colorMap = {'Normal': '#A5A552', 'Fighting': '#984B4B', 'Flying': '#8080C0', 'Poison': '#7E3D76',
  'Ground': '#D9B300', 'Rock': '#737300', 'Bug': '#548C00', 'Ghost': '#8600FF', 'Steel': '#7B7B7B',
  'Fire': '#F75000', 'Water': '#0080FF', 'Grass': '#019858', 'Electric': '#FFD306', 'Psychic': '#FF7575',
  'Ice': '#B9B9FF', 'Dragon': '#2828FF', 'Dark': '#9F5000', 'Fairy': '#FFAAD5'}

// set the dimensions and margins of the graph
var margin = {top: 35, right: 45, bottom: 20, left: 45},
    width = 400 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom,
    innerRadius = 35,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svg_cir = d3.select("#circular_bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

export function circular_barplot_axis() {
  // Scales
  var x = d3.scaleBand()
    .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
    .align(0)                  // This does nothing
    .domain([0, 18]); // The domain of the X axis is the list of states.
  var y = d3.scaleRadial()
    .range([innerRadius, outerRadius])   // Domain will be define later.
    .domain([0, 4]); // Domain of Y is from 0 to the max seen in the data

  // Draw axis
  var yAxis = svg_cir.append("g")
  .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(y.ticks(5).slice(1))
    .enter().append("g");

  yTick.append("circle")
    .attr('class', "axis")
    .attr("fill", "none")
    .attr("stroke", "#c2b7b6")
    .attr("r", y);

  yTick.append("text")
    .attr('class', "axis")
    .attr("y", function(d) { return -y(d); })
    .attr("dy", "0.35em")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 5)
    .text(y.tickFormat(5, "s"));

  yTick.append("text")
    .attr('class', "axis")
    .attr("y", function(d) { return -y(d); })
    .attr("dy", "0.35em")
    .attr("fill", "#56565c")
    .text(y.tickFormat(5, "s"));

  yAxis.append("text")
    .attr("y", function(d) { return -y(y.ticks(5).pop()); })
    .attr("dy", "-1em")
    .attr("font-weight", 700)
    .attr("font-size", "18px")
    .text("Multiplier");
}

export function circular_barplot(weakness) {
  // Scales
  var x = d3.scaleBand()
    .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
    .align(0)                  // This does nothing
    .domain(weakness.map(function(d) { return d.Type; })); // The domain of the X axis is the list of states.
  var y = d3.scaleRadial()
    .range([innerRadius, outerRadius])   // Domain will be define later.
    .domain([0, 4]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  const bars = svg_cir
    .selectAll("path")
    .data(weakness);
  // svg_cir.selectAll("path").remove();
  
  bars.enter()
    .append("path")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
    .merge(bars)
      .attr("fill", function(d) { return colorMap[d.Type]; })
      .attr('class', function(d) { return d.Type; })
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d['Multiplier']); })
        .startAngle(function(d) { return x(d.Type); })
        .endAngle(function(d) { return x(d.Type) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius));

  bars.exit().remove();

  // Add the labels
  const labels = svg_cir
    .selectAll(".label")
    .data(weakness);

  labels.enter()
    .append("g")
    .attr('class', "label")
    .merge(labels)
      .attr("text-anchor", function(d) { return (x(d.Type) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((x(d.Type) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Multiplier'])+10) + ",0)"; })
    .append("text")
      .text(function(d){return(d.Type)})
      .attr("transform", function(d) { return (x(d.Type) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "14px")
      .style("font-weight", 700)
      .attr("alignment-baseline", "middle");
  
  labels.exit().remove();

  //show information when mouse hover on node
  const toolTipG = svg_cir.append("g");
  const toolTipRect = toolTipG
    .append("rect")
    .attr("id", "rectTooltip")
    .attr("rx", 5)
    .style("visibility", "hidden");
  const toolTipText = toolTipG
    .append("text")
    .attr("id", "textTooltip")
    .style("visibility", "hidden");
  const typeText = toolTipText.append("tspan");
  const multiplierText = toolTipText.append("tspan");

  function mouseover(d) {
    if (d) {
      d3.select(this)
        .attr("stroke-width", 4)
        .attr('stroke', '#de0715');

      toolTipText.style("visibility", "visible");

      let a = d3.event.pageX - 1250
      let b = d3.event.pageY - 390

      typeText
        .attr("x", a + 30)
        .attr("y", b + 35)
        .text(() => {
          return `Type: ${d["Type"]}`;
        });

      let maxTextWidth = typeText.node().getBBox().width;

      multiplierText
        .attr("x", a + 30)
        .attr("y", b + 65)
        .text(() => {
          return `Multiplier: ${d["Multiplier"]}`;
        });
      const multipliertWidth = multiplierText.node().getBBox().width;
      if (multipliertWidth >= maxTextWidth) {
        maxTextWidth = multipliertWidth;
      }

      toolTipRect
        .attr("x", a + 20)
        .attr("y", b + 16)
        .attr("width", maxTextWidth + 17)
        .attr("height", 30)
        .style("visibility", "visible");
    }
  }

  function mouseout(d) {
    if (d) {
      d3.select(this)
        .attr("stroke", "none")

      toolTipRect.style("visibility", "hidden");
      toolTipText.style("visibility", "hidden");
    }
  }
};


function get_weakness(pokemon) {
  let weakness = [];
  let i = 0;

  for (const [key, value] of Object.entries(pokemon)) {
    i++;
    if (i <= 9) // Other columns which are irrelevant to weakness
      continue;
    var dict = {};
    dict["Type"] = key;
    dict["Multiplier"] = value;
    weakness.push(dict);
  }
  
  return weakness;
}