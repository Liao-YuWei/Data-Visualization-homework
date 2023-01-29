import { draw_column, collapsible_tree} from './tree.js';
import { circular_barplot_axis, circular_barplot } from './circular_bar.js';

export let data;

export function get_weakness(pokemon) {
  let weakness = [];
  let i = 0;

  for (const [key, value] of Object.entries(pokemon)) {
    i++;
    if (i <= 9) // Other columns which are irrelevant to weakness
      continue;
    var dict = {};
    dict["Type"] = key;
    dict["Multiplier"] = value;
    weakness.push(dict);
  }
  
  return weakness;
}


d3.csv('./gen9_pokemon_stats.csv', loadedData => {
  data = loadedData;
  data.forEach(d => {
    d["Normal"] = +d["Weakness-Normal"];
    d["Fire"] = +d["Weakness-Fire"];
    d["Water"] = +d["Weakness-Water"];
    d["Electric"] = +d["Weakness-Electric"];
    d["Grass"] = +d["Weakness-Grass"];
    d["Ice"] = +d["Weakness-Ice"];
    d["Fighting"] = +d["Weakness-Fighting"];
    d["Poison"] = +d["Weakness-Poison"];
    d["Ground"] = +d["Weakness-Ground"];
    d["Flying"] = +d["Weakness-Flying"];
    d["Psychic"] = +d["Weakness-Psychic"];
    d["Bug"] = +d["Weakness-Bug"];
    d["Rock"] = +d["Weakness-Rock"];
    d["Ghost"] = +d["Weakness-Ghost"];
    d["Dragon"] = +d["Weakness-Dragon"];
    d["Dark"] = +d["Weakness-Dark"];
    d["Steel"] = +d["Weakness-Steel"];
    d["Fairy"] = +d["Weakness-Fairy"];
    delete d["Weakness-Normal"];
    delete d["Weakness-Fire"];
    delete d["Weakness-Water"];
    delete d["Weakness-Electric"];
    delete d["Weakness-Grass"];
    delete d["Weakness-Ice"];
    delete d["Weakness-Fighting"];
    delete d["Weakness-Poison"];
    delete d["Weakness-Ground"];
    delete d["Weakness-Flying"];
    delete d["Weakness-Psychic"];
    delete d["Weakness-Bug"];
    delete d["Weakness-Rock"];
    delete d["Weakness-Ghost"];
    delete d["Weakness-Dragon"];
    delete d["Weakness-Dark"];
    delete d["Weakness-Steel"];
    delete d["Weakness-Fairy"];
  });

  const pokemon_weakness = get_weakness(data[0]);

  draw_column();
  collapsible_tree(pokemon_weakness);
  circular_barplot_axis();
  circular_barplot(pokemon_weakness);
});

