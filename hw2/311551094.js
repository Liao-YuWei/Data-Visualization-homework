const svg = d3.select('svg');

const width = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--width'));
const height = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--height'));

let data;
let columns;

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