import {csv} from "d3";
const color_dict = {
  'normal': '#A5A552',
  'fighting': '#984B4B',
  'flying': '#8080C0',
  'poison': '#7E3D76',
  'ground': '#D9B300',
  'rock': '#737300',
  'bug': '#548C00',
  'ghost': '#8600FF',
  'steel': '#7B7B7B',
  'fire': '#F75000',
  'water': '#0080FF',
  'grass': '#019858',
  'electric': '#FFD306',
  'psychic': '#FF7575',
  'ice': '#B9B9FF',
  'dragon': '#2828FF',
  'dark': '#9F5000',
  'fairy': '#FFAAD5'}
var num_range = {};
var wanted_id = "map";

var map = L.map(wanted_id).setView([23.85, 120.5], 10);

  var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      minZoom: 9, 
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var imageUrl = 'https://imgur.com/jwapDAm.png';
  var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
  var latLngBounds = L.latLngBounds([[15.3, 130], [30.4, 100]]);

  var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
      opacity: 1,
      errorOverlayUrl: errorOverlayUrl,
      alt: altText,
      interactive: true
  }).addTo(map);


  var imageUrl = 'https://assets.game8.co/tools/map/Paldea_map.jpg';
  var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
  var altText = '';
  // var latLngBounds = L.latLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);
  var latLngBounds = L.latLngBounds([[24.3, 121], [23.4, 120]]);

  var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
      opacity: 1,
      errorOverlayUrl: errorOverlayUrl,
      alt: altText,
      interactive: true
  }).addTo(map);

  function getcordlist(cord_str){
    var res = [];
    if(cord_str == "")
      return res;
    var cord_list = cord_str.split(';');
    cord_list.forEach(cord=>{
      var xycord = cord.split(',');
      res.push([+xycord[0], +xycord[1]]);
    });
    return res;
  }
  var marker_lis = new Array();
  function clear_all_marker(){
    var i=0;
    for(i=0;i<marker_lis.length;i++) {
        map.removeLayer(marker_lis[i]);
    }
    marker_lis = [];
  }
  function render(tar_type){
      // tar_type = ['normal']
      clear_all_marker();
      csv('../pokemon_cord.csv').then(data=> {
          data.forEach(d=> {
              d['Pokemon'] = d['Pokemon'];
              d['cord'] = d['cord'];
              d['Type 1'] = d['Type 1'];
              d['Type 2'] = d['Type 2'];
              d['hp'] = +d['HP'];
              d['atk'] = +d['Attack'];
              d['def'] = +d['Defense'];
              d['satk'] = +d['Special Attack'];
              d['sdef'] = +d['Special Defense'];
              d['spd'] = +d['Speed'];
          });
          data = data.filter( d => {
              if(tar_type.includes(d['Type 1'])){
                 return true;
              }
              else{
                return false;
              }
            });
          data = data.filter( d => {
              for (const [key, value] of Object.entries(num_range)) {
                  if(d[key] < value[0] || d[key] > value[1]){
                     return false;
                  }
              }
              return true
            });
          // console.log(data);
          data.forEach(d=> {
              var pokemon_cords = getcordlist(d['cord']);
              pokemon_cords.forEach(cord=> {
                  const myCustomColour = color_dict[d['Type 1']];
                  const markerHtmlStyles = `
                    background-color: ${myCustomColour};
                    width: 1rem;
                    height: 1rem;
                    display: block;
                    left: -0.5rem;
                    top: -0.5rem;
                    position: relative;
                    border-radius: 1rem 1rem 0;
                    transform: rotate(45deg);
                    border: 2px solid #000000`
                  const icon = L.divIcon({
                    className: "my-custom-pin",
                    iconAnchor: [0, 24],
                    labelAnchor: [-6, 0],
                    popupAnchor: [0, -36],
                    html: `<span style="${markerHtmlStyles}" />`
                  })
                  var mm = L.marker(cord, {icon: icon}).addTo(map)
                  .bindPopup(d['Pokemon'] + '<br>Type 1: ' + d['Type 1'] + '<br>Type 2: ' + d['Type 2']);
                  marker_lis.push(mm);
              });
          });
      });
  }
 	var array = []
  let allCheckBox = document.querySelectorAll('.type_checkbox')

    allCheckBox.forEach((checkbox) => { 
    checkbox.addEventListener('change', (event) => {
      var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
			array = []
      for (var i = 0; i < checkboxes.length; i++) {
            array.push(checkboxes[i].value);
      }
      render(array);
      // console.log(array);
    })
  })
  // render(array);

// pokemon_map("map", {});
const bottom = document.querySelector('#num_submit_bottom');
bottom.onclick = () => {render(array);}
// render(array);

function controlFromInput(fromSlider, fromInput, toInput, controlSlider, toSliderString) {
    const [from, to] = getParsed(fromInput, toInput);
  	checkToSliderString(toSliderString, from, to)
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider, toSliderString) {
    const [from, to] = getParsed(fromInput, toInput);
		checkToSliderString(toSliderString, from, to)
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput, toSliderString);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput, toSliderString) {
  const [from, to] = getParsed(fromSlider, toSlider);
  checkToSliderString(toSliderString, from, to)
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput, toSliderString) {
  const [from, to] = getParsed(fromSlider, toSlider);
	checkToSliderString(toSliderString, from, to)
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider, toSliderString);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  // console.log(from+","+to)
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget, toSliderString) {
  const toSlider = document.querySelector(toSliderString);
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

function checkToSliderString(toSliderString, from, to){
	const Status = toSliderString.split('_')[1].toUpperCase()
  num_range[Status] = [from, to]
  // console.log(num_range[Status])
}

function UseDRangeSlider(fromSlider, toSlider, fromInput, toInput, toSliderString) {
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider, toSliderString);
  fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput, toSliderString);
  toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput, toSliderString);
  fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider, toSliderString);
  toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider, toSliderString);
}

const fromSlider_hp = document.querySelector('#fromSlider_hp');
const toSlider_hp = document.querySelector('#toSlider_hp');
const fromInput_hp = document.querySelector('#fromInput_hp');
const toInput_hp = document.querySelector('#toInput_hp');
UseDRangeSlider(fromSlider_hp, toSlider_hp, fromInput_hp, toInput_hp, '#toSlider_hp')

const fromSlider_atk = document.querySelector('#fromSlider_atk');
const toSlider_atk = document.querySelector('#toSlider_atk');
const fromInput_atk = document.querySelector('#fromInput_atk');
const toInput_atk = document.querySelector('#toInput_atk');
UseDRangeSlider(fromSlider_atk, toSlider_atk, fromInput_atk, toInput_atk, '#toSlider_atk')

const fromSlider_def = document.querySelector('#fromSlider_def');
const toSlider_def = document.querySelector('#toSlider_def');
const fromInput_def = document.querySelector('#fromInput_def');
const toInput_def = document.querySelector('#toInput_def');
UseDRangeSlider(fromSlider_def, toSlider_def, fromInput_def, toInput_def, '#toSlider_def')


const fromSlider_satk = document.querySelector('#fromSlider_satk');
const toSlider_satk = document.querySelector('#toSlider_satk');
const fromInput_satk = document.querySelector('#fromInput_satk');
const toInput_satk = document.querySelector('#toInput_satk');
UseDRangeSlider(fromSlider_satk, toSlider_satk, fromInput_satk, toInput_satk, '#toSlider_satk')

const fromSlider_sdef = document.querySelector('#fromSlider_sdef');
const toSlider_sdef = document.querySelector('#toSlider_sdef');
const fromInput_sdef = document.querySelector('#fromInput_sdef');
const toInput_sdef = document.querySelector('#toInput_sdef');
UseDRangeSlider(fromSlider_sdef, toSlider_sdef, fromInput_sdef, toInput_sdef, '#toSlider_sdef')

const fromSlider_spd = document.querySelector('#fromSlider_spd');
const toSlider_spd = document.querySelector('#toSlider_spd');
const fromInput_spd = document.querySelector('#fromInput_spd');
const toInput_spd = document.querySelector('#toInput_spd');
UseDRangeSlider(fromSlider_spd, toSlider_spd, fromInput_spd, toInput_spd, '#toSlider_spd')