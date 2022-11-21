const svg = d3.select('svg#scatter-plot');

const width = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--width'));
const height = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--height'));

let unfiltered_data;
let data;
let columns;

let options = ['duration_s', 'danceability', 'energy', 'key',
              'loudness', 'mode','speechiness', 'acousticness',
              'instrumentalness', 'liveness', 'valence', 'tempo', 'time_signature']
let selectedX;
let selectedY;

let filter_down = 0;
let filter_up = 100;

let filter_data;

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
  const margin = { top: 20, right: 30, bottom: 88, left: 80};
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
      margin = {top: 10, right: 60, bottom: 10, left: 265};

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

  var legend_svg = d3.select("#legend")
    .append("svg")
      .attr("height", (legendheight) + "px")
      .attr("width", (legendwidth) + "px")
      .style("position", "absolute")
      .style("left", "0px")
      .style("top", "0px");

  legend_svg
    .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (margin.left) + "," + (legendheight - margin.top) + ")")
    .call(legendaxis);
};

function draggableSlider() {
  const margin = {top: 0, right: 60, bottom: 0, left: 250}

  const slider_svg = d3.select('svg#slider-range');
  const g = slider_svg.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container')
      .attr('transform',`translate(${margin.left},${margin.top})`)
      .attr('width', 500)
      .attr('height', 100);

  var sliderRange = d3
    .sliderBottom()
    .min(d3.min(data, function(d) {return d["popularity"];}))
    .max(d3.max(data, function(d) {return d["popularity"];}))
    .width(360)
    .ticks(10)
    .default([0, 100])
    .fill('#2196f3')
    .on('onchange', val => {
      d3.select('p#value-range').text(val.map(d3.format('d')).join(' - '));
      filter_down = Math.floor(val[0]);
      filter_up = Math.floor(val[1]);
      filter_data = data.filter(d => d.popularity >= filter_down && d.popularity <= filter_up)
      render();
    });

  /*d3.select('svg#slider-range')
    .append('svg')
      .attr('width', 500)
      .attr('height', 100)*/
  gEnter
    .append('g')
      .attr('transform', 'translate(30,30)')
      .call(sliderRange)
    .append('text')
      .attr('class', 'legend-label')
      .text("popularity")
      .attr('x', 125)
      .attr('y', 60)
      .style("font-size", "26px")
      .attr("font-weight", 1000);

  d3.select('nobr#number-data').text(filter_data.length)
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
    xScale,
    yScale,
    xValue,
    yValue,
    radius,
    colorScale
  } = props;

  const dataPoints = g.merge(gEnter)
    .selectAll('circle').data(filter_data);
  dataPoints
    .enter().append('circle')
    .merge(dataPoints)
      .attr('fill', d => colorScale(d.popularity))
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', radius)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);
    
  dataPoints.exit()
    .remove();

  //show information when mouse hover on node
  const toolTipG = svg.append("g");
  const toolTipRect = toolTipG
    .append("rect")
    .attr("id", "rectTooltip")
    .attr("rx", 5)
    .style("visibility", "hidden");
  const toolTipText = toolTipG
    .append("text")
    .attr("id", "textTooltip")
    .style("visibility", "hidden");
  const artistText = toolTipText.append("tspan");
  const albumText = toolTipText.append("tspan");
  const trackText = toolTipText.append("tspan");
  const popText = toolTipText.append("tspan");
  const genreText = toolTipText.append("tspan");

  function mouseover(d) {
    dx = xScale(xValue(d))
    dy = yScale(yValue(d))

    const el = d3.select(this);
    el.style("r", 8);

    toolTipText.style("visibility", "visible");

    artistText
      .attr("x", dx + 3)
      .attr("y", dy + 17)
      .text(() => {
        return `Artist: ${d.artists}`;
      });

    let maxTextWidth = artistText.node().getBBox().width;

    albumText
      .attr("x", dx + 3)
      .attr("y", dy + 40)
      .text(() => {
        return `Album: ${d.album_name}`;
      });

    const albumTextWidth = albumText.node().getBBox().width;
    if (albumTextWidth >= maxTextWidth) {
      maxTextWidth = albumTextWidth;
    }

    trackText
      .attr("x", dx + 3)
      .attr("y", dy + 63)
      .text(() => {
        return `Track: ${d.track_name}`;
      });

    const trackTextWidth = trackText.node().getBBox().width;
    if (trackTextWidth >= maxTextWidth) {
      maxTextWidth = trackTextWidth;
    }

    popText
      .attr("x", dx + 3)
      .attr("y", dy + 86)
      .text(() => {
        return `Popularity: ${d.popularity}`;
      });
    const popTextWidth =popText.node().getBBox().width;
    if (popTextWidth >= maxTextWidth) {
      maxTextWidth = popTextWidth;
    }

    genreText
      .attr("x", dx + 3)
      .attr("y", dy + 109)
      .text(() => {
        return `Genre: ${d.track_genre}`;
      });
    const genreTextWidth = genreText.node().getBBox().width;
    if (genreTextWidth >= maxTextWidth) {
      maxTextWidth = genreTextWidth;
    }

    toolTipRect
      .attr("x", dx)
      .attr("y", dy)
      .attr("width", maxTextWidth + 15)
      .style("visibility", "visible");
  }

  function mouseout(d) {
    const circle = d3.select(this);
    circle.style("r", radius);
    toolTipRect.style("visibility", "hidden");
    toolTipText.style("visibility", "hidden");
  }
}

d3.csv('http://vis.lab.djosix.com:2020/data/spotify_tracks.csv')
  .then(loadedData => {
    unfiltered_data = loadedData;
    unfiltered_data.forEach(d => {
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
    data = [...new Map(unfiltered_data.map(item => [item["track_id"], item])).values()]
    columns = Object.values(unfiltered_data.columns);
    columns[0] = 'number';
    selectedX = options[1];
    selectedY = options[0];
    filter_data = data;

    render();
});