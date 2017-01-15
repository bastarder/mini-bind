(function (that) {
  'use strict'

  var parttern_1 = /\s+/g;
  var parttern_2 = /\(([^\)]*)\)\{/;

  /**
   * 拎出来，比如你可以从 func.$jnjects 属性获取依赖
   */
  function findDeps (func) {
    var depends = func.toString()
      .replace(parttern_1, '')
      .match(parttern_2) || [];
    return depends[1] ? depends[1].split(',') : [];
  }

  that.MiniBind = {
    $data: {},
    run: function (name, context) {
      var self = this,
        func = this.$data[name],
        depends;
      if (!func) {
        throw new Error('Can not find :' + name);
      }

      depends = findDeps(func).map(function (name) {
        if (!self.$data[name]) {
          throw new Error('Can not find :' + name);
        }
        // 这里应该是最大的区别，
        // ng 的依赖注入中，一个要点是单例模式，一个 service 只被实例化一次，你这里没有做到
        // 关于循环依赖的检测我觉得是否可以在 register 时做。需要维护一个依赖关系的树型结构
        return function () {
          self.run(name);
        }
      });

      return func.apply(context || null, depends);
    },
    register: function (name, func, force) {
      if (this.$data[name] && !force) {
        throw new Error(name + ' has already defined;');
      }
      this.$data[name] = func;
      return this;
    }
  };
})(window);