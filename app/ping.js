// Generated by CoffeeScript 1.6.3
(function() {
  var Executer, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Executer = require('./executer').Executer;

  exports.Ping = (function(_super) {
    __extends(Ping, _super);

    function Ping() {
      _ref = Ping.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Ping.prototype.ping = function(website, callback) {
      var cmd;
      cmd = {
        name: 'ping',
        command: "ping -c 3 " + website
      };
      return this.execute(cmd, callback);
    };

    Ping.prototype.pingGoogle = function(callback) {
      return this.ping('google.com', callback);
    };

    return Ping;

  })(Executer);

}).call(this);

/*
//@ sourceMappingURL=ping.map
*/
