// Generated by CoffeeScript 1.11.1
(function() {
  'use strict';
  var controller;

  controller = function(scope, http) {
    return scope.trendsFor = function(place) {
      var promise;
      promise = http.get('/trends/' + place);
      promise.success(function(res) {
        console.log(res);
        if (!res || !res.length) {
          console.log("No result for " + place);
          return scope.trends = [];
        } else {
          return scope.trends = res;
        }
      });
      return promise.error(function(res) {
        return console.error(res);
      });
    };
  };

  angular.module('nodeExecuterApp').controller('TrendsCtrl', ['$scope', '$http', controller]);

}).call(this);

//# sourceMappingURL=trends.js.map
