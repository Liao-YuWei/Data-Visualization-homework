/*import {
  select,
  csv
} from 'd3';*/

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data; //load csv which data type has changed to number into variable "data"
let options;
let selectedX;
let selectedY;


/*const onXClicked = column => {
  selectedX = column;
  render();
};

const onYClicked = column => {
  selectedY = column;
  render();
};*/

const dropdownMenu = (selection, selectedAxis) => {
  /*const {
    onOptionClicked,
    selectedOption
  } = props;*/
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
        //onOptionClicked(this.value);
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
    .call(dropdownMenu, 'y'/*{
      onOptionClicked: onYClicked,
      selectedOption: selectedY
    }*/);

  d3.select('#x-menu')
    .call(dropdownMenu, 'x'/*{
      onOptionClicked: onXClicked,
      selectedOption: selectedX
    }*/);

  /**
   * Draw Scatter Plot
   */
  const margin = { top: 50, right: 60, bottom: 88, left: 110};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
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
    
  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);
  
  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const g = svg.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container')
      .attr('transform',`translate(${margin.left},${margin.top})`);
  
  const xAxisG = g.select('.xAxis');
  const xAxisGEnter = gEnter
    .append('g')
      .attr('class', 'xAxis');
  xAxisG
    .merge(xAxisGEnter)
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('.domain').remove();
  xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 75)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
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
      .attr('y', -65)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .text(selectedY);
}

/*svg.call(scatterPlot, {
  xValue: d => d[xColumn],
  xAxisLabel: xColumn,
  yValue: d => d[yColumn],
  circleRadius: 10,
  yAxisLabel: yColumn,
  margin: { top: 10, right: 40, bottom: 88, left: 150 },
  width,
  height,
  data
});*/

/*const scatterPlot = (selection, props) => {
  const {
    xValue,
    xAxisLabel,
    yValue,
    circleRadius,
    yAxisLabel,
    margin,
    width,
    height,
    data
  } = props;
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  
  const yScale = scaleLinear();
  yScale.domain(extent(data, yValue));
  yScale.range([innerHeight, 0]);
  yScale.nice();
  
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container');
  gEnter
    .merge(g)
      .attr('transform',
        `translate(${margin.left},${margin.top})`
      );
  
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);
  
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);
  
  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
    .append('g')
      .attr('class', 'y-axis');
  yAxisG
    .merge(yAxisGEnter)
      .call(yAxis)
      .selectAll('.domain').remove();
  
  const yAxisLabelText = yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -93)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .text(yAxisLabel);
  
  
  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
    .append('g')
      .attr('class', 'x-axis');
  xAxisG
    .merge(xAxisGEnter)
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('.domain').remove();
  
  const xAxisLabelText = xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 75)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xAxisLabel);

  
  const circles = g.merge(gEnter)
    .selectAll('circle').data(data);
  circles
    .enter().append('circle')
      .attr('cx', innerWidth / 2)
      .attr('cy', innerHeight / 2)
      .attr('r', 0)
    .merge(circles)
    .transition().duration(2000)
    .delay((d, i) => i * 10)
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius);
};*/


d3.csv('http://vis.lab.djosix.com:2020/data/iris.csv')
    .then(loadedData => {
      data = loadedData;
      data.forEach(d => {
        d["sepal length"] = +d["sepal length"];
        d["sepal width"] = +d["sepal width"];
        d["petal length"] = +d["petal length"];
        d["petal width"] = +d["petal width"];
      });
      options = Object.values(data.columns);
      options = options.slice(0,4);

      selectedX = options[1];
      selectedY = options[0];
      render();

      /*console.log(data);
      console.log(options);*/
});
