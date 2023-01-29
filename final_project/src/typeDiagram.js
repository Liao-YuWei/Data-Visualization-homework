let typeArr= [false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false];

const colorArr = [
    '#A5A552',
    '#984B4B',
    '#8080C0',
    '#7E3D76',
    '#D9B300',
    '#737300',
    '#548C00',
    '#8600FF',
    '#7B7B7B',
    '#F75000',
    '#0080FF',
    '#019858',
    '#FFD306',
    '#FF7575',
    '#B9B9FF',
    '#2828FF',
    '#9F5000',
    '#FFAAD5'
];

const typeName = [
    'normal',
    'fighting',
    'flying',
    'poison',
    'ground',
    'rock',
    'bug',
    'ghost',
    'steel',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'ice',
    'dragon',
    'dark',
    'fairy'
]

let axis = ['HP','Attack','Defense','Special Attack','Special Defense','Speed'];
let axisScatter = ['HP','Attack'];

const submitBtn = document.getElementById('submit');

const statsCsv = "gen9_pokemon_stats_adj.csv";

//=====================plot size=========================
var margin = {top:50, bottom:50, right:50, left: 50};
var widthAxis = 800-margin.left-margin.right;
var heightAxis = 320-margin.bottom-margin.top;
var widthScatter = 400-margin.left-margin.right;
var heightScatter = 320-margin.bottom-margin.top;


function createAxisGraph(checkedType){
    let type =[];
    let colorSelec =[];
    checkedType.forEach(element => {
        type.push(typeName[element]);
        colorSelec.push(colorArr[element]);
    });
    //console.log(type);
    //svg create=========================================
    d3.select('#axisDia').select('svg').remove();
    var svg = d3.select('#axisDia')
    .append("svg")
    .attr("width", widthAxis+margin.left+margin.right)
    .attr("height", heightAxis+margin.bottom+margin.top)
    .append("g")
    .attr("transform", "translate("+margin.left+","+margin.right+")");

    d3.csv(statsCsv, function(data){
        //=======data process================
        data.forEach(element => {
            element['HP'] = +element['HP'];
            element['Attack']= +element['Attack'];
            element['Defense'] = +element['Defense'];
            element['Special Attack'] = +element['Special Attack'];
            element['Special Defense'] = +element['Special Defense'];
            element['Speed'] = +element['Speed'];
        });
        //console.log(data);
        //color dimension
        var colorIdx = d3.scaleOrdinal()
        .domain(typeName)
        .range(colorArr);
        //scaling
        var y ={};
        for (i in axis){
            var name = axis[i];
            y[name] = d3.scaleLinear()
            .domain([0,200])
            .range([heightAxis,0]);
        }
        var x =d3.scalePoint()
        .range([0,widthAxis])
        .domain(axis);

        function path (d) {
            return d3.line()(axis.map(function(p) { return [x(p), y[p](d[p])]; }));
        }
        svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .filter(function(d){
            for(let i in type){
                if (d.Type == type[i]) return d;
            }
        })
        .append("path")
        .attr("class", function (d) { return "line " + d.Type } ) 
        .attr("d",  path)
        .style("fill", "none" )
        .style("stroke", function(d){ return( colorIdx(d.Type))} )
        .style("opacity", 0.8)
        svg.selectAll("myAxis")
        .data(axis)
        .enter()
        .append("g")
        .attr("class","axis")
        .attr("transform", function(d){ return "translate("+ x(d) +")";})
        .each(function(d){ d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));})
        .append("text")
        .style("text-anchor","middle")
        .attr("y",-9)
        .text(function(d){ return d;})
        .style("fill","black");
    })
}

function createScatterPlot(checkedType){
    let type =[];
    let colorSelec =[];
    checkedType.forEach(element => {
        type.push(typeName[element]);
        colorSelec.push(colorArr[element]);
    });
    //===============svg create=============
    d3.select('#scatterPlot').select('svg').remove();
    var svg = d3.select('#scatterPlot')
    .append("svg")
    .attr("width", widthScatter+margin.left+margin.right)
    .attr("height", heightScatter+margin.bottom+margin.top)
    .append("g")
    .attr("transform", "translate("+margin.left+","+margin.right+")");
    console.log('a');
    //======================================
    d3.csv(statsCsv, function(data){
        //=======data process================
        data.forEach(element => {
            element['HP'] = +element['HP'];
            element['Attack']= +element['Attack'];
            element['Defense'] = +element['Defense'];
            element['Special Attack'] = +element['Special Attack'];
            element['Special Defense'] = +element['Special Defense'];
            element['Speed'] = +element['Speed'];
        });
        //======color Idx======================
        var colorIdx = d3.scaleOrdinal()
        .domain(typeName)
        .range(colorArr);
        //====================scaling axis=============
        var x = d3.scaleLinear()
        .domain([0, 200])
        .range([ 0, widthScatter ]);
        svg.append("g")
        .attr("transform", "translate(0," + heightScatter + ")")
        .call(d3.axisBottom(x));
        var y = d3.scaleLinear()
        .domain([0, 200])
        .range([ heightScatter, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));
        //==================
        for (i in type){
            svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { if (d.Type==type[i])return x(d[axisScatter[0]]); } )
            .attr("cy", function (d) { if (d.Type==type[i])return y(d[axisScatter[1]]); } )
            .attr("r", 5)
            .style("fill", function(d){ return( colorIdx(d.Type))})
            .attr("opacity", 0.7);
        }
    })

}

function GetInputVal(){
    //============type checkbox===========
        typeArr[0] = document.getElementById('Normal').checked;
        typeArr[1] = document.getElementById('Fighting').checked;
        typeArr[2] = document.getElementById('Flying').checked;
        typeArr[3] = document.getElementById('Poison').checked;
        typeArr[4] = document.getElementById('Ground').checked;
        typeArr[5] = document.getElementById('Rock').checked;
        typeArr[6] = document.getElementById('Bug').checked;
        typeArr[7] = document.getElementById('Ghost').checked;  
        typeArr[8] = document.getElementById('Steel').checked; 
        typeArr[9] = document.getElementById('Fire').checked;
        typeArr[10] = document.getElementById('Water').checked;
        typeArr[11] = document.getElementById('Grass').checked;
        typeArr[12] = document.getElementById('Electric').checked;
        typeArr[13] = document.getElementById('Psychic').checked;
        typeArr[14] = document.getElementById('Ice').checked;
        typeArr[15] = document.getElementById('Dragon').checked;
        typeArr[16] = document.getElementById('Dark').checked;
        typeArr[17] = document.getElementById('Fairy').checked;
     //=========================
     //===========axis==================================
        for (i=0;i<6;i++){
            axis[i] = document.getElementById('axis'+(i+1)).value;
        }
    //====================================================
    //=============scatter==============================
        axisScatter[0] = document.getElementById('axisX').value;
        axisScatter[1] = document.getElementById('axisY').value;
    //=================================================
    //==============checked type=========================
    let checkedType =[];
    for (i =0; i<18; i++){
        if(typeArr[i]==true){
            checkedType.push(i);
        }
    }
    createAxisGraph(checkedType);
    createScatterPlot(checkedType);
}

///eventListener
submitBtn.addEventListener('mousedown',e=>{
    console.log('testMsg');
    GetInputVal();
    //debug msg===========================
    console.log(typeArr);
    console.log(axis);
    console.log(axisScatter);
})

GetInputVal();
//createAxisGraph();