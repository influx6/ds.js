// ds - a data structure library

require('em')('ds',function(em){

  var as = em('appstack'), ds = {}, util = as.Utility;
  
  ds.Node = as.Class.create('Node',{
    init: function(data){ this.data = data; },
    data: null,
    _marker: false,
    mark: function(){ this._marker = true; },
    unmark: function(){ this._marker = false },
    marked: function(){ return !!(this._marker); }
  });

  ds.ListNode = ds.Node.extend('ListNode',{
    left:null,
    right: null,
    root: null,
  });

  ds.TreeNode = ds.Node.extend('TreeNode',{
    left:null,
    right: null,
    root: null,
    denseness: function(){ },
    height: function(){ }
  });
  

  ds.List  = as.Class.create('List',{
    max: 0,
    counter: as.Counter(),
    root: null,
    tail: null,
    init: function(max){
      this.max = max;
    },
    size: function(){ return this.counter.count(); },
    isEmpty: function(){
       return ((this.root && this.tail) === null);
    },
    isFull: function(){
      return (this.counter.count() >= this.max && this.max !== null); 
    },
    add: function(data){
      if(this.isFull()) return;
      if(this.isEmpty()){
        (this.root = this.tail = ds.ListNode.make(data));
        this.counter.up();
        return;
      }

      var cur = this.tail;
      var left = cur.left;
      var right = cur.right;

      this.tail = ds.ListNode.make(data);
      if(left) this.tail.left = cur;
      if(right) this.tail.right = right;

      this.tail.left = cur;
      cur.right = this.tail;

      this.counter.up();
    },
    append: function(d){ this.add(d); },
    prepend: function(data){
      if(this.isFull()) return;
      if(this.isEmpty()){
        (this.root = this.tail = ds.ListNode.make(data));
        this.counter.up();
        return;
      }

      var cur = this.root;
      var left = cur.left;
      var  right = cur.right;

      this.root = ds.ListNode.make(data);
      if(left) this.tail.left = cur;
      if(right) this.tail.right = cur;

      this.root.right = cur;
      cur.left = this.root;

      this.counter.up();
    }
  });

  ds.GraphArc = as.Class.create('GraphArc',{
    node: null,
    weight: null,
    init: function(n,w){ 
      if(util.instanceOf(n,ds.GraphNode)) 
        throw "first argument must be an instanceof ds.GraphNode";

      this.node = n; this.weight = w; 
    }
  });
  
  ds.GraphNode = ds.Node.extend('GraphNode',{
    arcs: ds.List.make(),
    bind: function(node,weight){
      if(!util.isTypeOf(node,'GraphNode'))  return;
      this.arcs.add(ds.GraphArc.make(node,weight));
    },
    unbind: function(node){
      if(!util.isTypeOf(node,'GraphNode'))  return;
      this.arcs.removeByCall(function(n){ if(n.node === node) return true; return false;});
    },
  });

  ds.Iterator = as.Class.create('Iterator',{
    events: as.Events(),
    state: 0,
    current: null,
    currentNode: null,
    init: function(ds){
      this.ds = ds;
    },
    move: function(pre,cur,post){
      if(state === -1) return false;
      if(this.ds === null || this.ds.root === null) return false;
      if(pre(this.ds,this)) return true;
      if(cur(this.ds,this)) return true;
      if(post(this.ds,this)) return true;
      return false;
    },
    moveNext: function(){},
    movePrevious: function(){},
    done: function(){
        this.state = 0;
        this.current = this.currentNode = null;
    }
  });

  ds.ListIterator = ds.Iterator.extend('ListIterator',{
     moveNext:  function(){
        return this.move(function(ds,list){
              if(list.current === null ){
                list.current = ds.root;
                list.state = 1;
                return true;
               }
              return false;
          },
          function(ds,list){
            if(list.current !== (ds.tail && null)){
                list.current = list.current.next;
                return true;
            }
            return false;
          },
          function(ds,list){
            if(list.current.right === (ds.root || null)){
                list.state = -1;
                return true;
            }
             return false;
          });
    }
  });

  this.exports = ds;

},this);
