// ds - a data structure library

require('em')('ds',function(em){

  var as = em('appstack'), ds = {}, util = as.Utility;
  
  this.exports = ds;
  
  ds.DS = as.Class.create('SuperDS',{
     init: function(){},
     isDS: function(){ return true; }
  });

  ds.Node = as.Class.create('Node',{
    init: function(data){ this.data = data; },
    _marker: false,
    mark: function(){ this._marker = true; },
    unmark: function(){ this._marker = false },
    marked: function(){ return !!(this._marker); }
  });

  ds.ListNode = ds.Node.extend('ListNode',{
    init: function(data){ this.data = data; },
    left:null,
    right: null,
    root: null,
  });

  ds.TreeNode = ds.Node.extend('TreeNode',{
    init: function(data){ this.data = data; },
    left:null,
    right: null,
    root: null,
    denseness: function(){ },
    height: function(){ }
  });
  
  ds.List  = ds.DS.extend('List',{
    init: function(max){
      this.max = max;
      this.root = null;
      this.tail = null;
      this.counter = as.Counter();
    },
    size: function(){ return this.counter.count(); },
    isEmpty: function(){
       return ((this.root && this.tail) === null);
    },
    isFull: function(){
      return (this.counter.count() >= this.max && this.max !== null); 
    },
    iterator: function(){
      return ds.ListIterator.make(this);
    },
    add: function(data){
      if(this.isFull()) return;
      if(this.isEmpty()){
        this.root = this.tail = ds.ListNode.make(data);
        this.root.left = this.tail;
        this.tail.right = this.root;
        this.counter.up();
        return;
      }
      
      var cur = this.tail;
      var left = cur.left;
      var right = cur.right;

      this.tail = ds.ListNode.make(data);
      this.tail.right = this.root;
      this.tail.left = cur;

      cur.right = this.tail;
      
      this.root.left = this.tail;
      

      this.counter.up();
    },
    append: function(d){ this.add(d); },
    prepend: function(data){
      if(this.isFull()) return;
      if(this.isEmpty()){
        this.root = this.tail = ds.ListNode.make(data);
        this.root.left = this.tail;
        this.tail.right = this.root;
        this.counter.up();
        return;
      }

      var cur = this.root;
      var left = cur.left; 
      var  right = cur.right; 

      this.root = ds.ListNode.make(data);

      this.root.left = this.tail;
      this.root.right = cur;

      this.tail.right = this.root;
      
      cur.left = this.root;

      this.counter.up();
    },
    removeHead: function(){
      var root = this.root;
      left = root.left;
      right = root.right;
      
      this.root = right;
      right.left = left;
      left.right = right;

      return root;
    },
    removeTail: function(){
      var tail = this.tail;
      left = tail.left;
      right = tail.right;
      
      this.tail = left;
      this.tail.right = right;
      right.left = this.tail;

      return tail;
    }
    
  });


  ds.Iterator = as.Class.create('Iterator',{
    init: function(d){
      if(!util.instanceOf(d,ds.DS)) throw "You must supply a correct structure object";
      this.ds = d;
      this.state = 0;
      this.track = null;
      this.events = as.Events();

      this.events.set('error');
      this.events.set('begin');
      this.events.set('node');
      this.events.set('end');
      this.events.set('append');
      this.events.set('prepend');
      this.events.set('remove');
      this.events.set('done');
    },
    current: function(){
      return this.track.data;
    },
    currentNode: function(){
      return this.track;
    },
    move: function(pre,cur,post){
      if(this.state === -1) this.reset();
      if(this.ds === null || this.ds.root === null){
        this.events.emit('error',new Error('List is not initialized or has no nodes!'));
        return false;
      } 

      if(pre(this.ds,this)){ 
        this.events.emit('begin',this.current(),this.currentNode()); 
        this.events.emit('node',this.current(),this.currentNode()); 
        return true; 
      }
      if(cur(this.ds,this)){ 
        this.events.emit('node',this.current(),this.currentNode()); 
        return true; 
      }
      if(post(this.ds,this)){ 
        return true; 
      }

      this.events.emit('end',this.current(),this.currentNode()); 
      this.reset();
      this.events.emit('done');
      return false;
    },
    moveNext: function(){},
    movePrevious: function(){},
    reset: function(){
        this.state = 0;
        this.track =  null;
        this.events.emit('reset');
        return false;
    },
    prepend: function(item){
      this.events.emit('prepend',item);
    },
    append: function(item){
      this.events.emit('append',item);
    },
    remove: function(item){
      this.events.emit('remove',item);
    },
  });

  ds.ListIterator = ds.Iterator.extend('ListIterator',{
     moveNext:  function(){
        return this.move(function(ds,list){
            if(list.track === null){
              list.track = ds.root;
              list.state = 1;
              return true;
            }
              return false;
          },
          function(ds,list){
            if(list.track.right !== ds.root){
              list.track = list.track.right;
              list.state = 2;
              return true;
            }
            return false;
          },
          function(ds,list){
            if(list.track.right !== ds.root) return true;
            list.state = -1;
            return false;
          });
    },
    movePrevious: function(){
      return this.move(function(ds,list){
          if(list.track === null){
              list.track = ds.tail;
              list.state = 1;
              return true;
          }
          return false;
      },function(ds,list){
            if(list.track.left !== ds.tail){
                list.track = list.track.left;
                list.state = 2;
                return true;
            }
            return false;
      },function(ds,list){
            if(list.track.left !== ds.tail) return true;
            list.state = -1;
            return false;
      });

    },
    append:function(data){
      if(this.state === - 1) return (this.ds.append(data) && this.super.append(data));
    },
    prepend: function(data){
      if(this.state === - 1) return (this.ds.append(data) && this.super.prepend(data));
    
    },
    remove: function(data){
    
    }
  });

  ds.GraphArc = as.Class.create('GraphArc',{
    node: null,
    weight: null,
    init: function(n,w){ 
      if(!util.instanceOf(n,ds.GraphNode)) 
        throw "first argument must be an instanceof ds.GraphNode";
      this.node = n; this.weight = w; 
    },
  });
  
  ds.GraphNode = ds.Node.extend('GraphNode',{
    arcs: ds.List.make(),
    bind: function(node,weight){
      if(!util.instanceOf(node,ds.GraphNode)) return;
      this.arcs.add(ds.GraphArc.make(node,weight || 1));
    },
    unbind: function(node){
      if(!util.instanceOf(node,ds.GraphNode)) return;
      this.arcs.remove(function(n){ if(n.node === node) return true; return false;});
    },
    hasNode: function(node){
      if(!util.instanceOf(node,ds.GraphNode)) return;
      var itr = this.arcs.iterator();
      while(itr.moveNext()){
        if(itr.current().node === node) return true;
      }
      return false;
    },
    find: function(data){
      var itr = this.arcs.iterator(), res = [];
      while(itr.moveNext()){
        if(itr.current().node.data === data) continue
          res.push(itr.current());
      }
      return res;
    },
    compare: function(node){
      if(!util.instanceOf(node,ds.GraphNode)) return;
      return this.data === node.data;
    },
    compareData: function(data){
      return this.data === data;
    }
  });

  ds.GraphFilter = as.Class.create('GraphFilter',{});

  ds.Graph = ds.DS.extend('Graph',{});
  

},this);
