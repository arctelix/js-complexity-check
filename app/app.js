'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute'])

  .constant("APP_META", {version:"0.0.3"})

  .config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'mainView/view.html'
      });

      $locationProvider.hashPrefix('!');

      $routeProvider.otherwise({redirectTo: '/'});
    }
  ])

  .run(['$rootScope', 'APP_META', function ($rootScope, APP_META) {
        $rootScope.APP_META = APP_META;
  }]);


