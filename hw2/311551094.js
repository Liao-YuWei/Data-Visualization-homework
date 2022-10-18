const svg = d3.select('svg');

const width = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--width'));
const height = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--height'));

let data;
let columns;

const drawAxis = (props) => {
  const {
    g,
    gEnter,
    xScale,
    yScale
  } = props;

  const yAxisG = g.merge(gEnter)
    .selectAll('.yAxis').data(columns);
  yAxisG
    .enter().append('g')
      .attr("transform", function(d) {return "translate(" + xScale(d) + ")";})
      .each(function(d) { 
            d3.select(this)
              .call(d3.axisLeft(yScale[d])
                .tickPadding(10));})
      .append('text')
        .attr('class', 'axis-label')
        .text(function(d) { return d; })
        .attr('y', -13)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle');
}

const drawPath = (props) => {
  const {
    g,
    gEnter,
    xScale,
    yScale
  } = props;

  function path(d) {
    return d3.line()(columns.map(function(p) { return [xScale(p), yScale[p](d[p])]; }));
  }

  const paths = g.merge(gEnter)
    .selectAll('.line-path').data(data);
  
  paths
    .enter().append('path')
      .attr('class', d => d.class)
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke-width', 2)
      .style('opacity', 0.7);
}

const render = () => {
  /**
   * Draw Scatter Plot
   */
  const margin = { top: 30, right: 60, bottom: 88, left: 30};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scalePoint()
    .range([0, innerWidth])
    .padding(1)
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

  drawPath({
    g: g,
    gEnter: gEnter,
    xScale: xScale,
    yScale: yScale
  })

  drawAxis({
    g: g,
    gEnter: gEnter,
    xScale: xScale,
    yScale: yScale
  })

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