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
    containerInnerWidth,
    containerInnerHeight,
    xScale,
    yScale
  } = props;
  
  /*const yAxis = d3.axisLeft(yScale)
    .tickSize(-containerInnerWidth)
    .tickPadding(10);*/

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

  /*const yAxisGEnter = gEnter
    .append('g')
      .attr('class', 'yAxis');
  yAxisG
    .merge(yAxisGEnter)
      .attr("transform", function(d) {return "translate(" + xScale(d) + ")";})
      .each(function(d) { 
            d3.select(this)
              .call(d3.axisLeft(yScale[d])
                .tickSize(-containerInnerWidth)
                .tickPadding(10));})
      .selectAll('.domain').remove();*/
  /*yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -65)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -containerInnerHeight / 2)
      .text(columns);*/
}

const drawScatterPlot = (props) => {
  const {
    g,
    gEnter,
    containerInnerWidth,
    containerInnerHeight,
    xScale,
    yScale,
    xValue,
    yValue,
  } = props;

  /*const dataPoints = g.merge(gEnter)
    .selectAll('circle').data(data);
  dataPoints
    .enter().append('circle')
      .attr('r', 0)
      .attr('cx', containerInnerWidth/2)
      .attr('cy', containerInnerHeight/2)
      .attr('class', d => d.class)
    .merge(dataPoints)
    .transition().duration(2000)
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', radius);*/
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

  drawAxis({
    g: g,
    gEnter: gEnter,
    containerInnerWidth: innerWidth,
    containerInnerHeight: innerHeight,
    xScale: xScale,
    yScale: yScale
  })

  drawPath({
    g: g,
    gEnter: gEnter,
    containerInnerWidth: innerWidth,
    containerInnerHeight: innerHeight,
    xScale: xScale,
    yScale: yScale,
    xValue: xValue,
    yValue: yValue,
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