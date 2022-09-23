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
      options = Object.values(data.columns);
      options = options.slice(0,4);

      selectedX = options[1];
      selectedY = options[0];
      render();

      /*console.log(data);
      console.log(options);*/
});
