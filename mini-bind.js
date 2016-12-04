(function(that){
  'use strict'
  that.MiniBind = {
    $data : {},
    run : function(name, context){
      var self = this,
          func = this.$data[name],
          depends;
      if(!func){
        throw new Error('Can not find :' + name);
      }
      depends = func.toString()
                    .replace(/\s+/g,'')
                    .match(/\(([^\)]*)\)\{/) || [];
      depends = depends[1] ? depends[1].split(',') : [];
      depends = depends.map(function(name){
        if(!self.$data[name]){
          throw new Error('Can not find :' + name);
        }
        return function(){
          self.run(name);
        }
      })
      return func.apply(context || null, depends);
    },
    register : function(name, func, force){
      if(this.$data[name] && !force){
        throw new Error(name + ' has already defined;');
      }
      this.$data[name] = func;
      return this;
    }
  };
})(window);