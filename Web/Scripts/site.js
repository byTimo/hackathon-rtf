// Write your Javascript code.
function getData(query) {
    return $.ajax({
        url: "/Home/GetData",
        method: "POST",
        dataType: "json",
        data: {
            data: query
        }
    })
}
var childrenCount = 0;

$(document).ready(function () {
    var sendButton = $("#send_button");
    var queryInput = $("#query_input");
    var tables = $("#tables");

    sendButton.click(function (q) {
        $("svg").remove();
        var query = queryInput.val();
        getData(query)
            .done(function (data) {
                //console.log(JSON.stringify(data))
                //out.text(JSON.stringify(data))
                drawGraph(data);
                tables.text(JSON.stringify(data.columns))
            })
    });
});


function getDeps(key, array) {
    return array.map(function (x) {
        childrenCount++;
        return {
            "name": x.TableName+ " --> " + x.Name,
            "parent": key
        }
    })
}

function getColumns(data) {
    var columns = [];
    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            columns.push({"name": property, "parent": "Query", "children": getDeps(property, data[property])})
        }
    }
    return columns;
}

function drawGraph(data) {
    childrenCount = 0;
    var deps = data.dependency;
    
    var first = {
        "name": "Query",
        "parent": "null",
        "children": getColumns(deps)
    };
    
    
    var tree = [{
        "name": "Top Level",
        "parent": "null",
        "children": [
            {
                "name": "Level 2: A",
                "parent": "Top Level",
                "children": [
                    {
                        "name": "Son of A",
                        "parent": "Level 2: A"
                    },
                    {
                        "name": "Daughter of A",
                        "parent": "Level 2: A"
                    }
                ]
            },
            {
                "name": "Level 2: B",
                "parent": "Top Level"
            }
        ]
    }];
    root = first;
    root.x0 = childrenCount*20 / 2;
    root.y0 = 0;
    
    init(300, childrenCount*20);
    
    update(root);
}
var margin, i, tree, diagonal, svg, duration, root;

// ************** Generate the tree diagram	 *****************
function init(width, height) {

    margin = {top: 20, right: 120, bottom: 20, left: 120};

    i = 0;
    duration = 750;

    tree = d3.layout.tree()
        .size([height, width]);

    diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    svg = d3.select("#graph").append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select(self.frameElement).style("height", "700px");
}

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
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
