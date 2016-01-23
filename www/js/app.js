// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app=angular.module('starter', ['ionic','todo.services','ui.router'])
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('new', {
    url: '/new',
    templateUrl: 'templates/new.html',
    controller: 'TodoCtrl'

  })
  $stateProvider.state('list', {
       cache: false,
      url: '/',
      templateUrl: 'templates/list.html',
      controller: 'TodoCtrl'
    })
})
app.controller('TodoCtrl', function($scope,$ionicPopup,$ionicModal,$state,$ionicHistory,$ionicListDelegate,SQLService) {
    
    SQLService.setup();
    $scope.tasks ='';

    $scope.loadTask = function() {
      SQLService.all().then(function (results) {
          $scope.tasks = results;
        }); 
    }

   $scope.loadTask();

    $scope.newTask = function() {
          $scope.taskModal.show();
    };


    $scope.goBack = function(){
      $state.go("list");
  } 
    // Called when the form is submitted
  $scope.createTask = function(task) {
    SQLService.set(task.task_name);
    $state.go("list");
  };

    $scope.show = function(task) {
      $scope.data = { response: task.task_name };
      $ionicPopup.alert({
        title: "Show Task",
        template: task.task_name
      }).then(function(res) {    // promise 
        if (res !== undefined) task.task_name = $scope.data.response;
        $ionicListDelegate.closeOptionButtons();
      })
    };
    $scope.edit = function(task) {
      $scope.data = { response: task.task_name };
      $ionicPopup.prompt({
        title: "Edit Task",
        scope: $scope
      }).then(function(res) {    // promise 
        if (res !== undefined){
              SQLService.edit($scope.data.response, task.task_id);
               $scope.loadTask();

        } 
        $ionicListDelegate.closeOptionButtons();
      })
    };

    $scope.onItemDelete = function(taskid) {
        $ionicPopup.confirm({
          title: 'Confirm Delete',
          content: 'Are you sure you want to delete this task?'
        }).then(function(res) {
          if(res) {
          SQLService.del(taskid);
          } 
        
          $ionicListDelegate.closeOptionButtons();
          $scope.loadTask();

        });
  };
})
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
