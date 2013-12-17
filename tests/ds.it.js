module.exports = (function(matcher,ds){
    
    var list = ds.List.make(4);

    matcher.scoped('new list').obj(list).isObject();

    list.add(1);
    
    matcher.obj(list.root.data).is(1);
    
    list.prepend(2);

    matcher.obj(list.root.data).is(2);
      
    list.append(3);
  
    var it = list.iterator();
    var it2 = list.iterator();
    
    it.events.on('begin',function(data,node){
      matcher.scoped('forward iterator begins with 2').obj(it.current()).is(2);
    });

    it.events.on('node',function(data,node){
      matcher.scoped('forward iterator').obj(it.current()).isNumber();
    });

    it.events.on('end',function(data,node){
      matcher.scoped('forward iterator ends with 3').obj(it.current()).is(3);
    });

    it2.events.on('begin',function(data,node){
      matcher.scoped('backward iterator begins with 3').obj(it2.current()).is(3);
    });

    it2.events.on('node',function(data,node){
      matcher.scoped('backward iterator').obj(it2.current()).isNumber();
    });

    it2.events.on('end',function(data,node){
      matcher.scoped('backward iterator ends with 2').obj(it2.current()).is(2);
    });

    while(it.moveNext() && it2.movePrevious());
    

});
