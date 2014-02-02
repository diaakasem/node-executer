// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  var controller;

  controller = function(root, scope, http, params, timeout) {
    var promise,
      _this = this;
    scope.project = {};
    scope.project.images = [];
    scope.pathOf = function(img) {
      return "projects/" + scope.project.name + "/images/" + img;
    };
    scope.isSvg = function(name) {
      var res;
      if (!name) {
        return false;
      }
      name = name.toLowerCase();
      res = _.str.endsWith(name, 'svg');
      return res;
    };
    promise = http({
      method: 'get',
      url: "/project/" + params.name
    });
    return promise.success(function(result) {
      var i, imgPath;
      scope.project = result;
      scope.project.images = _.filter(scope.project.images, function(image) {
        return !scope.isSvg(image);
      });
      i = 0;
      imgPath = scope.pathOf(scope.project.images[i++]);
      $('.image img').attr('src', imgPath);
      timeout(function() {
        return fit($('.image img')[0], $('.image')[0], {
          vAlign: fit.CENTER
        });
      }, 1000);
      return scope.start = function() {
        var onAudio,
          _this = this;
        root.audioElement.src = scope.project.audio;
        root.audioElement.play();
        onAudio = function(event) {
          var changeImage, scroll, time;
          scope.duration = root.audioElement.duration;
          time = Math.floor(scope.duration * 1000 / scope.project.images.length);
          scroll = $('.text')[0].scrollHeight / scope.project.images.length;
          changeImage = function() {
            var _this = this;
            if (i >= scope.project.images.length) {
              return;
            }
            return $('.image img').fadeOut(500, function() {
              var scrollTo;
              $('.image img').attr('src', scope.pathOf(scope.project.images[i++]));
              $('.image img').fadeIn(500);
              timeout(function() {
                return fit($('.image img')[0], $('.image')[0], {
                  vAlign: fit.CENTER
                });
              }, 80);
              scrollTo = scroll * (i - 1);
              console.log(scroll);
              console.log(i);
              console.log("Scroll to " + scrollTo);
              $('.text').animate({
                scrollTop: scrollTo - 60
              }, 1000);
              return scope.imageTimer = timeout(changeImage, time);
            });
          };
          return scope.imageTimer = timeout(changeImage, time);
        };
        root.audioElement.addEventListener("loadedmetadata", onAudio);
        return root.$on('$routeChangeStart', function() {
          timeout.cancel(scope.imageTimer);
          return root.audioElement.removeEventListener("loadedmetadata", onAudio);
        });
      };
    });
  };

  angular.module("nodeExecuterApp").controller("ProjectCtrl", ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', controller]);

}).call(this);

/*
//@ sourceMappingURL=project.map
*/
