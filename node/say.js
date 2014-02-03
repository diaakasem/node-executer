// Generated by CoffeeScript 1.6.3
(function() {
  var Executer, fs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Executer = require('./executer').Executer;

  fs = require('fs');

  exports.Say = (function(_super) {
    __extends(Say, _super);

    Say.prototype.voices = {
      en: ['tom', 'ava']
    };

    function Say(defaultlang) {
      this.defaultlang = defaultlang;
      Say.__super__.constructor.call(this);
    }

    Say.prototype.voice = function(lang) {
      var arr, res;
      if (lang == null) {
        lang = this.defaultlang;
      }
      arr = lang ? this.voices[lang] : [];
      if (!arr.length) {
        return null;
      }
      res = arr[Math.floor(Math.random() * arr.length)];
      console.log("Speaking " + res + " voice.");
      return res;
    };

    Say.prototype.say = function(something, callback) {
      var cmd, v;
      v = this.voice();
      cmd = {
        name: 'say',
        command: "say " + something
      };
      if (v) {
        cmd.command += " -v " + v;
      }
      return this.execute(cmd, callback);
    };

    Say.prototype.toMp3 = function(file, callback) {
      var _this = this;
      return fs.unlink("" + file + ".mp3", function() {
        var cmd;
        cmd = {
          name: 'convert',
          command: "ffmpeg -i \"" + file + "\" -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 \"" + file + "\".mp3"
        };
        return _this.execute(cmd, function() {
          return typeof callback === "function" ? callback(file + ".mp3") : void 0;
        });
      });
    };

    Say.prototype.produce = function(audioFile, textFile, callback) {
      var cmd, v,
        _this = this;
      v = this.voice();
      cmd = {
        name: 'say',
        command: "say -o \"" + audioFile + "\" -f \"" + textFile + "\" "
      };
      if (v) {
        cmd.command += "-v " + v + " ";
      }
      return this.execute(cmd, function() {
        return _this.toMp3(audioFile, function(file) {
          return typeof callback === "function" ? callback(file) : void 0;
        });
      });
    };

    return Say;

  })(Executer);

}).call(this);

/*
//@ sourceMappingURL=say.map
*/
