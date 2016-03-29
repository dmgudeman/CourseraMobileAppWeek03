angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal and reservation modal
 $scope.loginData = $localStorage.getObject('userinfo', '{}');
 $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    // userinfo is the key and $scope.logiinData is the value
    $localStorage.storeObject('userinfo', $scope.loginData);

    // SIMULATION ONLY a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

    //*********************** Activating the Reserve Modal ******************
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.reserveForm = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
      $scope.reserveForm.hide();
    };

    // Open the reserve modal
    $scope.reserve = function() {
      $scope.reserveForm.show();
    };

    // Perform the serve action when the user submits the reserve form
    $scope.doReserve = function() {
      console.log('Doing Reservation', $scope.reservation);

      // SIMULATION ONLY a reservation delay. Remove this and replace with your reservation
      // code if using a reservation
      $timeout(function() {
        $scope.closeReserve();
      }, 1000);
    }
})

  .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate',
    function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    menuFactory.query(
      function(response) {
        $scope.dishes = response;
        $scope.showMenu = true;
      },
      function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
      });


    $scope.select = function(setTab) {
      $scope.tab = setTab;

      if (setTab === 2) {
        $scope.filtText = "appetizer";
      }
      else if (setTab === 3) {
        $scope.filtText = "mains";
      }
      else if (setTab === 4) {
        $scope.filtText = "dessert";
      }
      else {
        $scope.filtText = "";
      }
    };

    $scope.isSelected = function (checkTab) {
      return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };

    $scope.addFavorite = function(index) {
      console.log("index is " + index);

      favoriteFactory.addToFavorites(index);
      // the option button is closed by the ionicListDelegate service to get rid of it once it has been used
      $ionicListDelegate.closeOptionButtons();
    }
  }])

  .controller('ContactController', ['$scope', function($scope) {

    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

    var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

    $scope.sendFeedback = function() {

      console.log($scope.feedback);

      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      }
      else {
        $scope.invalidChannelSelection = false;
        feedbackFactory.save($scope.feedback);
        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
        $scope.feedback.mychannel="";
        $scope.feedbackForm.$setPristine();
        console.log($scope.feedback);
      }
    };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'dish','menuFactory', 'favoriteFactory', 'baseURL',
    '$ionicPopover', '$ionicModal', function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {

    $scope.baseURL = baseURL;
    $scope.dish = dish;
    $scope.showDish = false;
    $scope.message="Loading ...";

    $scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
      .$promise.then(
      function(response){
        $scope.dish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
      }
    );


  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

    $scope.mycomment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function () {

      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);

      $scope.dish.comments.push($scope.mycomment);
      menuFactory.update({id:$scope.dish.id},$scope.dish);

      $scope.commentForm.$setPristine();

      $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    }
  }])

  // implement the IndexController and About Controller here

  .controller('IndexController', ['$scope', 'leader', 'dish', 'promotion','baseURL',
    function($scope, leader, dish, promotion, baseURL) {


    $scope.baseURL = baseURL;
   // $scope.leader = corporateFactory.get({id:3});
    $scope.leader = leader;
    $scope.showDish = false;
    $scope.message="Loading ...";
    $scope.dish = dish;
    $scope.promotion = promotion;

  }])

  .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
    $scope.baseURL = baseURL;
    $scope.leaders = leaders;
  //  $scope.leader = corporateFactory.get({id:3});
    console.log("This fired in AboutController");
    console.log($scope.leaders);

  }])

  .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
    function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate,$ionicPopup, $ionicLoading, $timeout ) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;
      $scope.favorites = favorites;
      $scope.dishes = dishes;

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
      });


    $scope.favorites = favoriteFactory.getFavorites();

    $scope.dishes = menuFactory.query(
      function (response) {
        $scope.dishes = response;
        $timeout(function () {
          $ionicLoading.hide();
        }, 1000);
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
        $timeout(function () {
          $ionicLoading.hide();

        }, 1000);
      });
    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm Delete',
        template: 'Are you sure you want to delete this item?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('OK to delete');
          favoriteFactory.deleteFromFavorites(index);
        } else {
          console.log('Canceled Delete')
        }
      })
      $scope.shouldShowDelete = false;

    }}])

  .filter('favoriteFilter', function () {
    return function (dishes, favorites) {
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favorites[i].id)
            out.push(dishes[j]);
        }
      }
      return out;

    }});


;
