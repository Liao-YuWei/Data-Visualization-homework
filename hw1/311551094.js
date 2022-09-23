let data; //load csv which data type has changed to number into variable "data"



d3.csv('iris.csv')
    .then(loadedData => {
      data = loadedData;
      data.forEach(d => {
        d["sepal length"] = +d["sepal length"];
        d["sepal width"] = +d["sepal width"];
        d["petal length"] = +d["petal length"];
        d["petal width"] = +d["petal width"];
      });
      console.log(data);
      console.log(typeof(data[0]["sepal length"]));
      console.log(typeof(data[0]["class"]));
      /*xColumn = data.columns[4];
      yColumn = data.columns[0];
      render();*/
});