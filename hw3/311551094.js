const svg = d3.select('svg');

const width = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--width'));
const height = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--height'));

let data;
let columns;

let options = ['duration_s', 'danceability', 'energy', 'key',
              'loudness', 'mode','speechiness', 'acousticness',
              'instrumentalness', 'liveness', 'valence', 'tempo', 'time_signature']
let selectedX;
let selectedY;

const dropdownMenu = (selection, selectedAxis) => {
  let select = selection.selectAll('select').data([null]);
  select = select.enter().append('select')
    .merge(select)
      .on('change', function() {
        if (selectedAxis === 'x'){
          selectedX = this.value;
          render();
        }
        else {
          selectedY = this.value;
          render();
        }
      })
  
  if (selectedAxis === 'x'){
    selectedOption = selectedX;
  }
  else {
    selectedOption = selectedY;
  }
  const option = select.selectAll('option').data(options);
  option.enter().append('option')
      .merge(option)
        .attr('value', d => d)
        .property('selected', d => d === selectedOption)
        .text(d => d);
}

const render = () => {
  /** 
   * Create Drop Down Menu
  */
  d3.select('#y-menu')
   .call(dropdownMenu, 'y');

  d3.select('#x-menu')
   .call(dropdownMenu, 'x');
  

  /**
   * Draw Scatter Plot
   */
  const margin = { top: 30, right: 110, bottom: 88, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container')
      .attr('transform',`translate(${margin.left},${margin.top})`);

  const xValue = d => d[selectedX];
  const yValue = d => d[selectedY];

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  
  var colorScale = d3.scaleSequential(d3.interpolateRgb("white", "red"))
   .domain([0, 100]);

  drawAxis({
    g: g,
    gEnter: gEnter,
    containerInnerWidth: innerWidth,
    containerInnerHeight: innerHeight,
    xScale: xScale,
    yScale: yScale
  })

  drawScatterPlot({
    g: g,
    gEnter: gEnter,
    containerInnerWidth: innerWidth,
    containerInnerHeight: innerHeight,
    xScale: xScale,
    yScale: yScale,
    xValue: xValue,
    yValue: yValue,
    radius: 3,
    colorScale: colorScale
  })

  continuousLegend({
    colorScale: colorScale
  })
  
  draggableSlider()
}

// create continuous color legend
const continuousLegend = (props) => {
  const {
    colorScale
  } = props;

  var legendheight = 40,
      legendwidth = 700,
      margin = {top: 10, right: 60, bottom: 10, left: 270};

  var canvas = d3.select("#legend")
    .style("height", legendheight + "px")
    .style("width", legendwidth + "px")
    .style("position", "relative")
    .append("canvas")
    .attr("height", 1)
    .attr("width", legendwidth - margin.left - margin.right)
    .style("height", (legendheight - margin.top - margin.bottom) + "px")
    .style("width", (legendwidth - margin.left - margin.right) + "px")
    .style("border", "1px solid #000")
    .style("position", "absolute")
    .style("top", (margin.top) + "px")
    .style("left", (margin.left) + "px")
    .node();

  var ctx = canvas.getContext("2d");

  var legendscale = d3.scaleLinear()
    .range([1, legendwidth - margin.left - margin.right])
    .domain(colorScale.domain());

  var image = ctx.createImageData(legendwidth, 1);
  d3.range(legendwidth).forEach(function(i) {
    var c = d3.rgb(colorScale(legendscale.invert(i)));
    image.data[4*i] = c.r;
    image.data[4*i + 1] = c.g;
    image.data[4*i + 2] = c.b;
    image.data[4*i + 3] = 255;
  });
  ctx.putImageData(image, 0, 0);

  var legendaxis = d3.axisBottom()
    .scale(legendscale)
    .tickSize(6)
    .ticks(8);

  var svg = d3.select("#legend")
    .append("svg")
    .attr("height", (legendheight) + "px")
    .attr("width", (legendwidth) + "px")
    .style("position", "absolute")
    .style("left", "0px")
    .style("top", "0px")

  svg
    .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (margin.left) + "," + (legendheight - margin.top) + ")")
    .call(legendaxis)
    .append('text')
      .attr('class', 'legend-label')
      .text("popularity")
      .attr('x', (legendwidth - margin.left - margin.right) / 2)
      .attr('y', 50);
};

function draggableSlider(){
  var sliderRange = d3
    .sliderBottom()
    .min(d3.min(data, function(d) {return d["popularity"];}))
    .max(d3.max(data, function(d) {return d["popularity"];}))
    .width(300)
    .ticks(10)
    .default([0, 100])
    .fill('#2196f3')
    .on('onchange', val => {
      d3.select('p#value-range').text(val.map(d3.format('d')).join(' - '));
    });

  d3.select('div#slider-range')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(sliderRange);

  d3.select('p#value-range').text(
    sliderRange
      .value()
      .map(d3.format('d'))
      .join(' - ')
  );
}



const drawAxis = (props) => {
  const {
    g,
    gEnter,
    containerInnerWidth,
    containerInnerHeight,
    xScale,
    yScale
  } = props;

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-containerInnerHeight)
    .tickPadding(15);
  
  const yAxis = d3.axisLeft(yScale)
    .tickSize(-containerInnerWidth)
    .tickPadding(10);
  
  const xAxisG = g.select('.xAxis');
  const xAxisGEnter = gEnter
    .append('g')
      .attr('class', 'xAxis');
  xAxisG
    .merge(xAxisGEnter)
      .attr('transform', `translate(0,${containerInnerHeight})`)
      .call(xAxis)
      .selectAll('.domain').remove();
  xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 53)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
      .attr('x', containerInnerWidth / 2)
      .text(selectedX);

  const yAxisG = g.select('.yAxis');
  const yAxisGEnter = gEnter
    .append('g')
      .attr('class', 'yAxis');
  yAxisG
    .merge(yAxisGEnter)
      .call(yAxis)
      .selectAll('.domain').remove();
  yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -57)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -containerInnerHeight / 2)
      .text(selectedY);
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
    radius,
    colorScale
  } = props;

  const dataPoints = g.merge(gEnter)
    .selectAll('circle').data(data);
  dataPoints
    .enter().append('circle')
      .attr('r', 0)
      .attr('cx', containerInnerWidth/2)
      .attr('cy', containerInnerHeight/2)
      .attr('fill', d => colorScale(d.popularity))
    .merge(dataPoints)
    //.transition().duration(2000)
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', radius);
}

d3.csv('http://vis.lab.djosix.com:2020/data/spotify_tracks.csv')
  .then(loadedData => {
    data = loadedData;
    data.forEach(d => {
      d["number"] = +d[""];
      delete d[""];
      d["popularity"] = +d["popularity"];
      d["duration_s"] = +d["duration_ms"] / 1000;
      delete d["duration_ms"];
      d["explicit"] = (d["explicit"] === 'True');
      d["danceability"] = +d["danceability"];
      d["energy"] = +d["energy"];
      d["key"] = +d["key"];
      d["loudness"] = +d["loudness"];
      d["mode"] = +d["mode"];
      d["speechiness"] = +d["speechiness"];
      d["acousticness"] = +d["acousticness"];
      d["instrumentalness"] = +d["instrumentalness"];
      d["liveness"] = +d["liveness"];
      d["valence"] = +d["valence"];
      d["tempo"] = +d["tempo"];
      d["time_signature"] = +d["time_signature"];
    });
    columns = Object.values(data.columns);
    columns[0] = 'number';
    selectedX = options[1];
    selectedY = options[0];

    render();
});