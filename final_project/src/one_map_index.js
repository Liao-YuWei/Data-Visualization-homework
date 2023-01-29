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
  'fairy': '#FFAAD5'};

// const tar_pokemon = "Flamigo";
// draw_map("abc", [tar_pokemon]);
var marker_lis = new Array();
var map = L.map("pokemon_map").setView([23.85, 120.5], 10);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    minZoom: 9, 
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var imageUrl = './asset/blue.png';
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

export function draw_map(tar_pokemon){
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
  function clear_all_marker(){
    var i=0;
    for(i=0;i<marker_lis.length;i++) {
        map.removeLayer(marker_lis[i]);
    }
    marker_lis = [];
  }
  clear_all_marker();
  d3.csv('pokemon_cord.csv', function(data){
      data.forEach(d=> {
          d['Pokemon'] = d['Pokemon'];
          d['cord'] = d['cord'];
          d['Type 1'] = d['Type 1'];
          d['Type 2'] = d['Type 2'];
          // d['hp'] = +d['HP'];
          // d['atk'] = +d['Attack'];
          // d['def'] = +d['Defense'];
          // d['satk'] = +d['Special Attack'];
          // d['sdef'] = +d['Special Defense'];
          // d['spd'] = +d['Speed'];
      });
      data = data.filter( d => {
          if(tar_pokemon.includes(d['Pokemon'])){
             return true;
          }
          else{
            return false;
          }
        });
    	// console.log(data);
      data.forEach(d=> {
          var pokemon_cords = getcordlist(d['cord']);
          if(pokemon_cords == []){
            console.log('no cord for', d['Pokemon']);
          }
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