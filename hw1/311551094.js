d3.csv('iris.csv')
    .then(/*loadedData => {
      data = loadedData;
      data.forEach(d => {
        d.mpg = +d.mpg;
        d.cylinders = +d.cylinders;
        d.displacement = +d.displacement;
        d.horsepower = +d.horsepower;
        d.weight = +d.weight;
        d.acceleration = +d.acceleration;
        d.year = +d.year;  
      });
      xColumn = data.columns[4];
      yColumn = data.columns[0];
      render();
    }*/
    data => {console.log(data);}
    );