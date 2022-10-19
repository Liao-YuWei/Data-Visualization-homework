const svg = d3.select('svg');

const width = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--width'));
const height = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--height'));

let data;
let columns;

const render = () => {
  const margin = { top: 30, right: 80, bottom: 88, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scalePoint()
    .range([0, innerWidth])
    .domain(columns);

  var yScale = {}
  for (i in columns){
    axis_name = columns[i]
    yScale[axis_name] = d3.scaleLinear()
      .domain(d3.extent(data, d => d[axis_name]))
      .range([innerHeight, 0])
      .nice();
  }

  const g = svg.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container')
      .attr('transform',`translate(${margin.left},${margin.top})`);

  var dragging = {};

  /**
   * Draw path
   */
  function position(d) {
    return dragging[d] == null ? xScale(d) : dragging[d];
  } 

  function path(d) {
    return d3.line()(columns.map(p => [position(p), yScale[p](d[p])] ));
  }

  var paths = g.merge(gEnter)
    .selectAll('.line-path').data(data);
  
  paths = paths
    .enter().append('path')
      .attr('class', d => d.class)
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke-width', 1.5)
      .style('opacity', 0.7);
  
  /**
   * Draw Axes
   */
  const drag = d3.drag()  
    .on('start', function(d) { 
      dragging[d] = xScale(d);
    })
    .on('drag', function(d) { 
      paths.attr('d', path)
      dragging[d] = Math.min(innerWidth + 50, Math.max(-50, d3.event.x));
      columns.sort( (a, b) => position(a) - position(b));
      xScale.domain(columns);
      yAxisG
        .attr("transform", d => "translate(" + position(d) + ")");
    })
    .on('end', function(d) { 
      delete dragging[d];
      paths
        .transition().duration(500)
        .attr('d', path)
      d3.select(this)
        .transition().duration(500)
        .attr("transform", d => "translate(" + position(d) + ")");
    });

  const dragAxisG = g.merge(gEnter)
    .selectAll('.yAxis').data(columns);

  const yAxisG = dragAxisG
    .enter().append('g')
      .call(drag)
      .attr("transform",d => "translate(" + position(d) + ")");
  
  yAxisG
    .each(function(d) { 
          d3.select(this)
            .call(d3.axisLeft(yScale[d])
              .tickPadding(10));})
      .style('font-size', '1em')
      .style('stroke-width', '1.5px')
      .style("cursor", "pointer")
    .append('text')
      .attr('class', 'axis-label')
      .text(function(d) { return d; })
      .attr('y', -13)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .style('font-size', '1.15em')
      .style('font-weight', 750);
}

d3.csv('http://vis.lab.djosix.com:2020/data/iris.csv')
  .then(loadedData => {
    data = loadedData;
    data.forEach(d => {
      d["sepal length"] = +d["sepal length"];
      d["sepal width"] = +d["sepal width"];
      d["petal length"] = +d["petal length"];
      d["petal width"] = +d["petal width"];
    });
    data.pop();
    columns = Object.values(data.columns);
    columns = columns.slice(0,4);

    render();
});