import { get_weakness, data } from './weakness_data.js';
import { collapsible_tree } from './tree.js';
import { circular_barplot } from './circular_bar.js';
import { draw_map } from './one_map_index.js';

let pokemon_index = 1;

const btnEl = document.querySelector('#button')

function select_pokemon() {
    var cur_pokemon = document.getElementById('pokemon').value;
    pokemon_index = pokemons.indexOf(cur_pokemon);
    console.log(cur_pokemon, pokemon_index);
    
    if(pokemon_index == -1) {
      document.getElementById('pokemon').value = "Annihilape";
      cur_pokemon = "Annihilape";
      pokemon_index = 0;
    }
    else {
      document.getElementById('pokemon').value = cur_pokemon;
    }

    document.getElementById('nametag').innerHTML = '<span class="badge text-bg-info" id="name">'+cur_pokemon+'</span>';
    picChange(cur_pokemon);
    statsInfo(cur_pokemon);
    skillInfo(cur_pokemon);
    draw_map(cur_pokemon);

    const pokemon_weakness = get_weakness(data[pokemon_index]);
    collapsible_tree(pokemon_weakness);
    circular_barplot(pokemon_weakness);
}

btnEl.addEventListener('click', select_pokemon)