const pokemonIdx = {
    'Annihilape':'979',
    'Arboliva':'930',
    'Arctibax':'997',
    'Armarouge':'936',
    'Baxcalibur':'998',
    'Bellibolt':'939',
    'Bombirdier':'962',
    'Brambleghast':'947',
    'Bramblin':'976',
    'Brute Bonnet':'986',
    'Capsakid':'951',
    'Ceruledge':'937',
    'Cetitan':'975',
    'Cetoddle':'974',
    'Charcadet':'935',
    'Chi-Yu':'1004',
    'Chien-Pao':'1002',
    'Clodsire':'980',
    'Crocalor':'910',
    'Cyclizar':'967',
    'Dachsbun':'927',
    'Dolliv':'929',
    'Dondozo':'977',
    'Dundunsparce':'982',
    'Espathra':'956',
    'Farigiraf':'981',
    'Fidough':'926',
    'Finizen':'963',
    'Flamigo':'973',
    'Flittle':'955',
    'Floragato':'907',
    'Flutter Mane':'987',
    'Frigibax':'996',
    'Fuecoco':'909',
    'Garganacl':'934',
    'Gholdengo':'1000',
    'Gimmighoul':'999',
    'Glimmet':'969',
    'Glimmora':'970',
    'Grafaiai':'945',
    'Great Tusk':'984',
    'Greavard':'971',
    'Houndstone':'972',
    'Iron Bundle':'991',
    'Iron Hands':'992',
    'Iron Jugulis':'993',
    'Iron Moth':'994',
    'Iron Thorns':'995',
    'Iron Treads':'990',
    'Iron Valiant':'1006',
    'Kilowattrel':'941',
    'Kingambit':'983',
    'Klawf':'950',
    'Koraidon':'1007',
    'Lechonk':'915',
    'Lokix':'920',
    'Mabosstiff':'943',
    'Maschiff':'942',
    'Maushold':'925',
    'Meowscarada':'908',
    'Miraidon':'1008',
    'Nacli':'932',
    'Naclstack':'933',
    'Nymble':'919',
    'Oinkologne':'916',
    'Orthworm':'968',
    'Palafin':'964',
    'Pawmi':'921',
    'Pawmo':'922',
    'Pawmot':'923',
    'Quaquaval':'914',
    'Quaxly':'912',
    'Quaxwell':'913',
    'Rabsca':'954',
    'Rellor':'953',
    'Revavroom':'966',
    'Roaring Moon':'1005',
    'Sandy Shocks':'989',
    'Scovillain':'952',
    'Scream Tail':'985',
    'Shroodle':'944',
    'Skeledirge':'911',
    'Slither Wing':'988',
    'Smoliv':'928',
    'Spidops':'918',
    'Sprigatito':'906',
    'Squawkabilly':'931',
    'Tadbulb':'938',
    'Tandemaus':'924',
    'Tarountula':'917',
    'Tatsugiri':'978',
    'Ting-Lu':'1003',
    'Tinkatink':'957',
    'Tinkaton':'959',
    'Tinkatuff':'958',
    'Toedscool':'948',
    'Toedscruel':'949',
    'Varoom':'965',
    'Veluza':'976',
    'Wattrel':'940',
    'Wiglett':'960',
    'Wo-Chien':'1001',
    'Wugtrio':'961'
};
//======================================
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
//======================================
var margin = {top:50, bottom:60, right:50, left: 50};
//======================================
/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/// mthh - 2017 /////////////////////////////////////////
// Inspired by the code of alangrafu and Nadieh Bremer //
// (VisualCinnamon.com) and modified for d3 v4 //////////
/////////////////////////////////////////////////////////

const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const HALF_PI = Math.PI / 2;

const RadarChart = function RadarChart(parent_selector, data, options) {
	//Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
    d3.select("#chart").select('svg').remove();
	const wrap = (text, width) => {
	  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
	  });
	}//wrap

	const cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
	 format: '.2%',
	 unit: '',
	 legend: false
	};

	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	// var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	let maxValue = 0;
	for (let j=0; j < data.length; j++) {
		for (let i = 0; i < data[j].axes.length; i++) {
			data[j].axes[i]['id'] = data[j].name;
			if (data[j].axes[i]['value'] > maxValue) {
				maxValue = data[j].axes[i]['value'];
			}
		}
	}
	maxValue = max(cfg.maxValue, maxValue);

	const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format(cfg.format),			 	//Formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

	//Scale for the radius
	const rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);

	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////
	const parent = d3.select(parent_selector);

	//Remove whatever chart with the same id/class was present before
	parent.select("svg").remove();

	//Initiate the radar chart SVG
	let svg = parent.append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar");

	//Append a g element
	let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////

	//Filter for the outside glow
	let filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////

	//Wrapper for the grid & axes
	let axisGrid = g.append("g").attr("class", "axisWrapper");

	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => radius / cfg.levels * d)
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", d => -d * radius / cfg.levels)
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////

	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => rScale(maxValue *1.1) * cos(angleSlice * i - HALF_PI))
		.attr("y2", (d, i) => rScale(maxValue* 1.1) * sin(angleSlice * i - HALF_PI))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", (d,i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
		.attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
		.text(d => d)
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////

	//The radial line function
	const radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => rScale(d.value))
		.angle((d,i) => i * angleSlice);

	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed)
	}

	//Create a wrapper for the blobs
	const blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");

	//Append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", d => radarLine(d.axes))
		.style("fill", (d,i) => cfg.color(i))
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function(d, i) {
			//Dim all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);
		})
		.on('mouseout', () => {
			//Bring back all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});

	//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.axes); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", (d,i) => cfg.color(i))
		.style("fill", "none")
		.style("filter" , "url(#glow)");

	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
		.style("fill", (d) => cfg.color(d.id))
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////

	//Wrapper for the invisible circles on top
	const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d => d.axes)
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice*i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice*i - HALF_PI))
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			tooltip
				.attr('x', this.cx.baseVal.value - 10)
				.attr('y', this.cy.baseVal.value - 10)
				.transition()
				.style('display', 'block')
				.text(Format(d.value) + cfg.unit);
		})
		.on("mouseout", function(){
			tooltip.transition()
				.style('display', 'none').text('');
		});

	const tooltip = g.append("text")
		.attr("class", "tooltip")
		.attr('x', 0)
		.attr('y', 0)
		.style("font-size", "12px")
		.style('display', 'none')
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em");

	if (cfg.legend !== false && typeof cfg.legend === "object") {
		let legendZone = svg.append('g');
		let names = data.map(el => el.name);
		if (cfg.legend.title) {
			let title = legendZone.append("text")
				.attr("class", "title")
				.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.attr("x", cfg.w - 70)
				.attr("y", 10)
				.attr("font-size", "12px")
				.attr("fill", "#404040")
				.text(cfg.legend.title);
		}
		let legend = legendZone.append("g")
			.attr("class", "legend")
			.attr("height", 100)
			.attr("width", 200)
			.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
		// Create rectangles markers
		legend.selectAll('rect')
		  .data(names)
		  .enter()
		  .append("rect")
		  .attr("x", cfg.w - 65)
		  .attr("y", (d,i) => i * 20)
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", (d,i) => cfg.color(i));
		// Create labels
		legend.selectAll('text')
		  .data(names)
		  .enter()
		  .append("text")
		  .attr("x", cfg.w - 52)
		  .attr("y", (d,i) => i * 20 + 9)
		  .attr("font-size", "11px")
		  .attr("fill", "#737373")
		  .text(d => d);
	}
	return svg;
}
//======================================
var pokemonName = 'Annihilape';
const pokemonStats = 'gen9_pokemon_stats.csv';
const pokemonMoves = 'gen9_pokemon_moves.csv';

function skillInfo(pokemonName){
	d3.csv(pokemonMoves, function(data){
		//var specialSkill;
		//var physicalSkill;
		var lgTypeS;
		var lgNameS;
		var lgPowerS = 0;
		var lgTypeP;
		var lgNameP;
		var lgPowerP = 0;
		data.forEach(element=>{
			if (element['Pokemon']==pokemonName){
				element['Base Power']=+element['Base Power'];
				
				if(element['Category']=='special' && element['Base Power']>=lgPowerS && element['Move']!='Hyper Beam'){
					lgTypeS = element['Type'];
					lgNameS = element['Move'];
					lgPowerS = element['Base Power'];
					console.log(element['Base Power']);
				} 
				else if(element['Category']=='physical' &&element['Base Power']>=lgPowerP && element['Move']!='Giga Impact'){
					lgTypeP = element['Type'];
					lgNameP = element['Move'];
					lgPowerP = element['Base Power'];
					console.log(lgNameP);
				}
			}
			document.getElementById('skillCon').innerHTML = 
			'<div id="skillBox"><div id="skillType" style="background-color:'+colorArr[typeName.indexOf(lgTypeS)]+
			';"><h3>'+lgTypeS+
			'</h3></div><div id="skillName"><h4>'+lgNameS+
			'</h4></div></div><div id="Damage"><h4>Special: '+lgPowerS+
			'</h4></div><div id="skillBox"><div id="skillType" style="background-color: '+colorArr[typeName.indexOf(lgTypeP)]+
			';"><h3>'+lgTypeP+
			'</h3></div><div id="skillName"><h4>'+lgNameP+
			'</h4></div></div><div id="Damage"><h4>Pyhscial: '+lgPowerP+'</h4></div>';
		})

		
		/*specialSkill.forEach(element=>{
			if (element['Base Power']>=lgPowerS){
				lgTypeS = element['Type'];
				lgNameS = element['Move'];
				lgPowerS = element['Base Power'];
			}
		})*/
		/*physicalSkill.forEach(element=>{
			if (element['Base Power']>=lgPowerP){
				lgTypeP = element['Type'];
				lgNameP = element['Move'];
				lgPowerP = element['Base Power'];
			}
		})*/

		//=================html change================
		

	})
}

function statsInfo(pokemonName){
	d3.csv(pokemonStats, function(data){
		var pokemonData;
		console.log('a');
		data.forEach(element=>{
			if(element['Pokemon'] == pokemonName){
				//============================
				//document.getElementById('typeBox').innerHTML = 
				var htmlVal;
				if (element['Type 2'] == 'NA'){
					htmlVal = '<div id="type1" style="background-color:'+colorArr[typeName.indexOf(element['Type 1'])]+
					';"><h3>'+element['Type 1']+
					'</h3></div><div id="type2" style="opacity: 0;"><h3>NA</h3></div>';
					document.getElementById('typeBox').innerHTML = htmlVal;
				}
				else{
					htmlVal = '<div id="type1" style="background-color:'+colorArr[typeName.indexOf(element['Type 1'])]+
					';"><h3>'+element['Type 1']+
					'</h3></div><div id="type2" style="background-color:'+colorArr[typeName.indexOf(element['Type 2'])]+
					'"><h3>'+element['Type 2']+'</h3></div>';
					document.getElementById('typeBox').innerHTML = htmlVal;
				}
				//====================================
				pokemonData=[ {name: 'pokemon stats',
                                axes:[
                                    {axis: 'HP', value:+element['HP']},
                                    {axis: 'Attack', value:+element['Attack']},
                                    {axis: 'Defense', value:+element['Defense']},
                                    {axis: 'Special Attack', value:+element['Special Attack']},
                                    {axis: 'Special Defense', value:+element['Special Defense']},
                                    {axis: 'Speed', value:+element['Speed']}
                                ]              
                    }
                ];
				return;
			}
		})
		console.log(pokemonData);
		var radarChartOptions = {
            w: 250,
            h: 250,
            margin: margin,
            levels: 5,
            roundStrokes: true,
              color: d3.scaleOrdinal().range(["#06aabf"]),
              format: '.0f'
        };
		var svg =RadarChart("#statsChart", pokemonData, radarChartOptions);
	})

}

function picChange(pokemonName){
    document.getElementById('pic').innerHTML = '<img src="https://www.serebii.net/scarletviolet/pokemon/new/'+pokemonIdx[pokemonName]+'.png">';
}

function getPokemonInfo(){
    pokemonName = document.getElementById("inputPlace").value;
	document.getElementById('nametag').innerHTML = '<span class="badge text-bg-info" id="name">'+pokemonName+'</span>';
    picChange();
	statsInfo();
	skillInfo();
    console.log(pokemonName);
}

picChange(pokemonName);
statsInfo(pokemonName);
skillInfo(pokemonName);