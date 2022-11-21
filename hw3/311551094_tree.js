const svg = d3.select('svg#scatter-plot');

const width = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--width'));
const height = parseInt(getComputedStyle(document.querySelector(':root'))
    .getPropertyValue('--height'));

let unfiltered_data;
let data;
let columns;

let options = ['duration_s', 'danceability', 'energy', 'key',
              'loudness', 'mode','speechiness', 'acousticness',
              'instrumentalness', 'liveness', 'valence', 'tempo', 'time_signature']

let artists_popularity;
let tree_json;

const render = () => {
  /**
   * Draw Collapsible tree
   */
  const margin = { top: 30, right: 110, bottom: 88, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container')
      .attr('transform',`translate(${margin.left},${margin.top})`);


}

function split_multiple_artists_data(data) {
  data.forEach(d => {
    var current_artists = d['artists'].split(';');
    
    if(current_artists.length > 1){
      d['artists'] = current_artists[0];

      for(i = 1; i < current_artists.length; i++){
        data.push({'number': d['number'],
                  'track_id': d['track_id'], 
                  'artists': current_artists[i],
                  'album_name': d['album_name'],
                  'track_name': d['track_name'],
                  'popularity': d['popularity'],
                  'duration_s': d['duration_s'],
                  'explicit': d['explicit'],
                  'danceability': d['danceability'],
                  'energy': d['energy'],
                  'key': d['key'],
                  'loudness': d['loudness'],
                  'mode': d['mode'],
                  'speechiness': d['speechiness'],
                  'acousticness': d['acousticness'],
                  'instrumentalness': d['instrumentalness'],
                  'liveness': d['liveness'],
                  'valence': d['valence'],
                  'tempo': d['tempo'],
                  'time_signature': d['time_signature'],
                  'track_genre': d['track_genre']
        });
      }
    }
  });

  return data;
}

function artists_popularity_order(data) {
  var popularities = data.reduce((acc, e)=>{
    if(!acc[e.artists]) {
      acc[e.artists] = {'count': 1, 'total_popularity': e.popularity}
    }
    else {
      acc[e.artists]['count'] += 1;
      acc[e.artists]['total_popularity'] += e.popularity;
    }
    return acc;
  }, {})

  popularities = Object.entries(popularities).map(([key, value]) => ({artist: key, ...value}));

  popularities.forEach(d => {
    d['averege_popularity'] = d['total_popularity'] / d['count'];
  });

  popularities.sort(function(first, second) {
    return second['averege_popularity']  - first['averege_popularity'] ;
  });
  //console.log(popularities);

  return popularities;
}

function create_tree_json(artists_popularity, data) {
  var tree_json = {};
  tree_json["name"] = "Top 10 artists";
  tree_json["children"] = [];
  for(i = 0; i < 10; i++){
    current_artist = artists_popularity[i]['artist']
    current_artist_list = [];
    data.forEach(d => {
      if(d['artists'] === current_artist){
        current_artist_list.push({'number': d['number'],
        'track_id': d['track_id'], 
        'artists': current_artist,
        'album_name': d['album_name'],
        'track_name': d['track_name'],
        'popularity': d['popularity'],
        'duration_s': d['duration_s'],
        'explicit': d['explicit'],
        'danceability': d['danceability'],
        'energy': d['energy'],
        'key': d['key'],
        'loudness': d['loudness'],
        'mode': d['mode'],
        'speechiness': d['speechiness'],
        'acousticness': d['acousticness'],
        'instrumentalness': d['instrumentalness'],
        'liveness': d['liveness'],
        'valence': d['valence'],
        'tempo': d['tempo'],
        'time_signature': d['time_signature'],
        'track_genre': d['track_genre']
        });
      }
    });
    //console.log(current_artist_list);

    album_list = [];
    current_artist_list.forEach(d => {
      if(album_list.some(e => e['name'] === d['album_name'])){
        album_list.forEach(a => {
          if(a['name'] === d['album_name']){
            a['children'].push({'number': d['number'],
                                'track_id': d['track_id'], 
                                'artists': current_artist,
                                'album_name': d['album_name'],
                                'name': d['track_name'],
                                'popularity': d['popularity'],
                                'duration_s': d['duration_s'],
                                'explicit': d['explicit'],
                                'danceability': d['danceability'],
                                'energy': d['energy'],
                                'key': d['key'],
                                'loudness': d['loudness'],
                                'mode': d['mode'],
                                'speechiness': d['speechiness'],
                                'acousticness': d['acousticness'],
                                'instrumentalness': d['instrumentalness'],
                                'liveness': d['liveness'],
                                'valence': d['valence'],
                                'tempo': d['tempo'],
                                'time_signature': d['time_signature'],
                                'track_genre': d['track_genre']})
          }
        })
      }
      else{
        album_list.push({
          "name": d['album_name'],
          "children": [{'number': d['number'],
                        'track_id': d['track_id'], 
                        'artists': current_artist,
                        'album_name': d['album_name'],
                        'name': d['track_name'],
                        'popularity': d['popularity'],
                        'duration_s': d['duration_s'],
                        'explicit': d['explicit'],
                        'danceability': d['danceability'],
                        'energy': d['energy'],
                        'key': d['key'],
                        'loudness': d['loudness'],
                        'mode': d['mode'],
                        'speechiness': d['speechiness'],
                        'acousticness': d['acousticness'],
                        'instrumentalness': d['instrumentalness'],
                        'liveness': d['liveness'],
                        'valence': d['valence'],
                        'tempo': d['tempo'],
                        'time_signature': d['time_signature'],
                        'track_genre': d['track_genre']
          }]
        });
      }
    });
    //console.log(album_list);

    tree_json["children"].push({
      "name": current_artist,
      "children": album_list
    });
  };
  //console.log(tree_json)

  return tree_json;
}

d3.csv('http://vis.lab.djosix.com:2020/data/spotify_tracks.csv')
  .then(loadedData => {
    unfiltered_data = loadedData;
    unfiltered_data.forEach(d => {
      d["number"] = +d[""];
      delete d[""];
      d["popularity"] = +d["popularity"];
      d["duration_s"] = +d["duration_ms"] / 1000;
      delete d["duration_ms"];
      d["explicit"] = (d["explicit"] === 'True');
      d["danceability"] = +d["danceability"];
      d["energy"] = +d["energy"];
      d["key"] = +d["key"];
      d["loudness"] = +d["loudness"];
      d["mode"] = +d["mode"];
      d["speechiness"] = +d["speechiness"];
      d["acousticness"] = +d["acousticness"];
      d["instrumentalness"] = +d["instrumentalness"];
      d["liveness"] = +d["liveness"];
      d["valence"] = +d["valence"];
      d["tempo"] = +d["tempo"];
      d["time_signature"] = +d["time_signature"];
    });
    data = [...new Map(unfiltered_data.map(item => [item["track_id"], item])).values()]
    columns = Object.values(unfiltered_data.columns);
    columns[0] = 'number';

    data = split_multiple_artists_data(data);
    artists_popularity = artists_popularity_order(data);

    tree_json = create_tree_json(artists_popularity, data);
    
    render();
});