module.exports = (function(matcher,ds){
    
    var list = ds.List.make(4);
    
    matcher.obj(list).isObject();

    list.add(1);
    
    matcher.obj(list.root.data).is(1);
    
    list.prepend(2);

    matcher.obj(list.root.data).is(2);
      
    list.append(3);

    matcher.obj(list.tail.data).is(3);

    matcher.scoped('list should not be full').obj(list.isFull()).is(false);

    list.append(5);

    list.append(6);

    matcher.scoped('last item should be 6').obj(list.tail.data).isNot(6);

    matcher.scoped('list is full').obj(list.isFull()).is(true);

    matcher.scoped('removing head');
    

    list.removeHead();

    matcher.obj(list.root.data).is(1);

    list.removeHead();

    matcher.obj(list.root.data).is(3);

    list.removeHead();

    matcher.obj(list.root.data).is(5);
    
    list.removeHead();
    
    matcher.obj(list.isEmpty()).is(true);

});
