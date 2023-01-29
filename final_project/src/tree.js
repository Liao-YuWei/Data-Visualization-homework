const colorMap = {'Normal': '#A5A552', 'Fighting': '#984B4B', 'Flying': '#8080C0', 'Poison': '#7E3D76',
  'Ground': '#D9B300', 'Rock': '#737300', 'Bug': '#548C00', 'Ghost': '#8600FF', 'Steel': '#7B7B7B',
  'Fire': '#F75000', 'Water': '#0080FF', 'Grass': '#019858', 'Electric': '#FFD306', 'Psychic': '#FF7575',
  'Ice': '#B9B9FF', 'Dragon': '#2828FF', 'Dark': '#9F5000', 'Fairy': '#FFAAD5'}

let tree_json;

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 20, left: 110},
    width = 400 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

const link_length_multiplier = 0.5

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg_tree = d3.select("#collapsible_tree")
  .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

export function draw_column(){
  var svg_col = d3.select("#collapsible_tree_column")
  .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", 20)
  .append("g")
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("text-anchor", "middle");
  
  svg_col.append("text")
    .text("Multiplier")
    .attr("fill", "black")
    .attr("x", 197)
	  .attr("dy", 15)
    .attr("font-size", "18px")
    .attr("font-weight", 700);
  
  svg_col.append("text")
    .text("Type")
    .attr("fill", "black")
    .attr("x", 291)
	  .attr("y", 15)
    .attr("font-size", "18px")
    .attr("font-weight", 700);
}

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

export function collapsible_tree(data) {
  tree_json = create_tree_json(data);
  read_json(tree_json);
}

function create_tree_json(data) {
  let sort_data = Array.from(data)
  sort_data.sort(function(first, second) {
    return first['Multiplier']  - second['Multiplier'] ;
  });

  var tree_json = {};
  tree_json["name"] = "Weakness-Type";
  tree_json["children"] = [];
  const unique = [...new Set(sort_data.map(item => item['Multiplier']))];

  for (const current_multiplier of unique){
    let current_multiplier_list = [];
    sort_data.forEach(d => {
      if(d['Multiplier'] === current_multiplier){
        current_multiplier_list.push({'Type': d['Type'], 'Multiplier': d['Multiplier']});
      }
    });
    
    let type_list = [];
    current_multiplier_list.forEach(d => {
      type_list.push({
        'name': d['Type'],
        'toolTipData': {
          'Type': d['Type'],
          'Multiplier': d['Multiplier']}
        })

    });
    // console.log(type_list)

    tree_json["children"].push({
      "name": current_multiplier,
      "children": type_list
    });
  }

  return tree_json;
}

function read_json(tree_json){
  root = d3.hierarchy(tree_json, function(d) { return d.children; });;
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);
};

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg_tree.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });
  
  node.select("text")
    .data(nodes)
    .text(function(d) {return d.data.name; });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr("transform", function(d) {
      return "translate(" + source.y0 * link_length_multiplier + "," + source.x0 + ")";
  })
    .on('click', click)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  // Add Circle for the nodes
  nodeEnter.append('circle')
    .attr('class', 'node')
    .attr('r', 1e-6)
    .style("fill", function(d) {
        return d._children ? "#b6d7f0" : "#fff";
    })
    .style("stroke", function(d) { return colorMap[d.data.name]; });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y * link_length_multiplier + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "#b6d7f0" : "#fff";
    })
    .attr('cursor', 'pointer');

  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y * link_length_multiplier + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg_tree.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    let path = `M ${s.y * link_length_multiplier} ${s.x}
            C ${(s.y + d.y) / 2 * link_length_multiplier} ${s.x},
              ${(s.y + d.y) / 2 * link_length_multiplier} ${d.x},
              ${d.y * link_length_multiplier} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }

  //show information when mouse hover on node
  const toolTipG = svg_tree.append("g");
  const toolTipRect = toolTipG
    .append("rect")
    .attr("id", "rectTooltip")
    .attr("rx", 5)
    .style("visibility", "hidden");
  const toolTipText = toolTipG
    .append("text")
    .attr("id", "textTooltip")
    .style("visibility", "hidden");
    const typeText = toolTipText.append("tspan");
    const multiplierText = toolTipText.append("tspan");

  function mouseover(d) {
    if (d.data.toolTipData) {
      const el = d3.select(this).select(".node");
      el.style("r", 13).style("fill", "#ff8f34");

      toolTipText.style("visibility", "visible");

      const data = d.data.toolTipData;

      let a = d.y * link_length_multiplier
      let b = d.x

      typeText
        .attr("x", a - 15)
        .attr("y", b - 7)
        .text(() => {
          return `Type: ${data["Type"]}`;
        });

      let maxTextWidth = typeText.node().getBBox().width;

      multiplierText
        .attr("x", a - 15)
        .attr("y", b + 18)
        .text(() => {
          return `Multiplier: ${data["Multiplier"]}`;
        });

      const multiplierTextWidth = multiplierText.node().getBBox().width;
      if (multiplierTextWidth >= maxTextWidth) {
        maxTextWidth = multiplierTextWidth;
      }

      toolTipRect
        .attr("x", a - 20)
        .attr("y", b - 29)
        .attr("width", maxTextWidth + 10)
        .style("visibility", "visible");
    }
  }

  function mouseout(d) {
    if (d.data.toolTipData) {
      const circle = d3.select(this).select(".node");
      circle.style("r", 10).style("fill", "#fff");
      toolTipRect.style("visibility", "hidden");
      toolTipText.style("visibility", "hidden");
    }
  }
}