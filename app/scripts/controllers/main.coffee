"use strict"
controller = (scope, http, location) ->
  promise = http
    method: 'post'
    url: '/project/'
    data:
      status: 'created'

  scope.by_name = ''
  promise.success (result)->
    console.log result
    scope.articles = result

angular.module("nodeExecuterApp")
.controller "MainCtrl",
  ['$scope', '$http', '$location', controller]
