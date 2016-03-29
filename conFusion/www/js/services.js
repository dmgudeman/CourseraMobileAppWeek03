'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL","http://localhost:3000/")
  .factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

    return $resource(baseURL + "dishes/:id", null, {
        'update': {
          method: 'PUT'
        }
    });
  }])

  .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "promotions/:id");
  }])

  .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {

 //   console.log("This is in the corporate factory. leadership = ");
   //
    return $resource(baseURL+"leadership/:id");

  }])

  .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    return $resource(baseURL+"feedback/:id");
  }])

  // the $resource and the baseURL are to be used for persistent storage functions
  .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    // this is to be returned
    var favFac = {};
    // this is an array to keep track of all the favorites, tracked by id
    var favorites = [];

    favFac.addToFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index)
        return;
      }
      // this is where the array is defined as storing the favorites as "id"
      favorites.push({id:index});
    }

    favFac.deleteFromFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index) {
          favorites.splice(i, 1);
        }
      }
    }

    favFac.getFavorites = function () {
      return favorites;
    };

    return favFac;

  }])

  .factory('$localStorage', ['$window', function($window) {
    return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    }
  }])
;
