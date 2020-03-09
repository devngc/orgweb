var c = d3.select("div#tools_diagram");
// var i = d3.select("img.img-software-icon");


var width = parseFloat(c.style('width')) - 30;
var height = width;

var graph = {
    "nodes": [
        {"id": "Anthony", "group": 1, "img": "anthony.png", "size": 100, "text": "Anthony", "link": ""},
        {"id": "John", "group": 2, "img": "john.png", "size": 100, "text": "John", "link": ""},
        {"id": "Paul", "group": 3, "img": "paul.png", "size": 100, "text": "Paul", "link": ""},
        {"id": "Arash", "group": 4, "img": "arash.png", "size": 100, "text": "Arash", "link": ""},
        {"id": "Jacquie", "group": 5, "img": "jacquie.png", "size": 70, "text": "Jacquie", "link": ""},
        {"id": "Ioana", "group": 6, "img": "ioana.png", "size": 80, "text": "Ioana", "link": ""},
        {"id": "Mark", "group": 7, "img": "mark.png", "size": 80, "text": "Mark", "link": ""},
        {"id": "Yigit", "group": 7, "img": "yigit.png", "size": 70, "text": "Yigit", "link": ""},
        {"id": "Duncan", "group": 1, "img": "duncan.png", "size": 60, "text": "Duncan", "link": ""},
        {"id": "Stefan", "group": 2, "img": "stefan.png", "size": 60, "text": "Stefan", "link": ""},
        {"id": "Aaron", "group": 6, "img": "aaron.png", "size": 60, "text": "Aaron", "link": ""},
        {"id": "Brian", "group": 8, "img": "brian.png", "size": 70, "text": "Brian", "link": ""},
        {"id": "Carol", "group": 8, "img": "carol.png", "size": 60, "text": "Carol", "link": ""},
        {"id": "Giulia", "group": 4, "img": "giulia.png", "size": 60, "text": "Giulia", "link": ""},
        {"id": "Lori", "group": 8, "img": "lori.png", "size": 60, "text": "Lori", "link": ""},


    ],
    "links": [
        {"source": "Paul", "target": "Anthony", "value": 4},
        {"source": "Paul", "target": "John", "value": 4},
        {"source": "Paul", "target": "Arash", "value": 4},
        {"source": "Paul", "target": "Jacquie", "value": 4},
        {"source": "Paul", "target": "Ioana", "value": 4},
        {"source": "Paul", "target": "Brian", "value": 4},
        {"source": "Paul", "target": "Lori", "value": 4},
        {"source": "Anthony", "target": "John", "value": 4},
        {"source": "Anthony", "target": "Arash", "value": 4},
        {"source": "Anthony", "target": "Jacquie", "value": 4},
        {"source": "Anthony", "target": "Ioana", "value": 4},
        {"source": "Anthony", "target": "Mark", "value": 4},
        {"source": "Anthony", "target": "Duncan", "value": 4},
        {"source": "John", "target": "Arash", "value": 4},
        {"source": "John", "target": "Jacquie", "value": 4},
        {"source": "John", "target": "Stefan", "value": 4},
        {"source": "John", "target": "Mark", "value": 4},
        {"source": "Mark", "target": "Yigit", "value": 4},
        {"source": "Arash", "target": "Ioana", "value": 4},
        {"source": "Arash", "target": "Giulia", "value": 4},
        {"source": "Ioana", "target": "Aaron", "value": 4},
        {"source": "Brian", "target": "Carol", "value": 4},
    ]
}


var transform = d3.zoomIdentity;
var svg = d3.select("#tools_diagram").append("svg")
    .attr("width", width)
    .attr("height", width)
    .attr("fill", "black")
    .attr("stroke-width", "1px");


var zooming = false;
var zoom = d3.zoom().scaleExtent([1 / 2, 8])
  .on("zoom", zoomed);

svg.on("dblclick.zoom", null); //disable double click zoom


g = svg.append("g")
    .attr("transform", "translate(0,0)");

function zoomed() {
  // only zoom and pan when ctrl key is pressed.
  if (zooming){
    g.attr("transform", d3.event.transform);
  }
}

d3.select("body").on("keydown", function () {
  	zooming = d3.event.ctrlKey;
    svg.call(zoom);
	});

d3.select("body").on("keyup", function () {
  svg.on('.zoom', null);
  zooming = false;
});

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-1500))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(75).iterations(6))
    .force("y", d3.forceY(0))
    .force("x", d3.forceX(0))
    .on("tick", ticked);

simulation.nodes(graph.nodes);

simulation
  .force("link")
  .links(graph.links);

var link = g.selectAll(".link")
    .data(graph.links)
  .enter().append("line")
    .attr("class", "link");

var node = g.selectAll(".node")
    .data(graph.nodes)
  .enter().append("g")
    .attr("class", "node");

simulation.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  });

node.append("image")
    .attr("xlink:href", function(d) { return "./assets/img/graph/" + d.img; })
    .attr("x", function(d) { return -d.size / 2; })
    .attr("y", function(d) { return -d.size / 2; })
    .attr("width", function(d) { return d.size; })
    .attr("height", function(d) { return d.size; })
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

node.append("text")
    .attr("dx", function(d) { return d.size / 2 + 4; })
    .attr("dy", ".35em")
    .attr("font-size", "13px")
    .text(function(d) { return d.text; });

node.on("dblclick", function(d){
      d3.event.preventDefault(); //stop showing browser menu
      window.open(d.link, '_blank')
      //location.href = d.link;
    });

// for touch interface
node.on("click", function(d){
      d3.event.preventDefault(); //stop showing browser menu
      window.open(d.link, '_blank')
      //location.href = d.link;
    });

// add titles
d3.selectAll("image")
    .append("title")
    .text(function(d) { return d.text; })


// add border
var borderPath = svg.append("rect")
 			.attr("x", 0)
 			.attr("y", 0)
      .attr("width", width)
 			.attr("height", height)
 			.style("fill", "none")

d3.select(window).on("resize", center);

function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

function center(){
    // var x = parseFloat(c.style('width')) - 30; // 30 px for bootstrap padding
    // var y = 4 * parseFloat(c.style('height')) - 30;
    var x = $(window).screenLeft();
    var y = $(window).screenTop();

    svg.attr("width", x).attr("height", y);
    borderPath.attr("width", x).attr("height", y);

    simulation.force("center")
        .x(x / 2)
        .y(y / 2);

    simulation.alphaTarget(0.1).restart();
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
