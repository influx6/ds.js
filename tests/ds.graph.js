 module.exports  = function(ma,ds){
    
    var node = ds.GraphNode.make(20);
    var node2 = ds.GraphNode.make(10);
    var node3 = ds.GraphNode.make(10);
    var arc = ds.GraphArc.make(node,5);
    
    ma.scoped('Graph Node').obj(node).isValid();
    ma.obj(node).obj(node.data).isValid();
    ma.obj(node).obj(node.data).isNumber();
    ma.obj(arc.node).isValid();
    ma.obj(arc.node).is(node);

    node.bind(node2);
    node.bind(node3);
    node.bind(ds.GraphNode.make(14));
    
    console.log(node.find(10));
    
 };
