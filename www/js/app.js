// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('sqliteEx', ['ionic', 'sqliteEx.controllers', 'sqliteEx.services', 'sqliteEx.constants'])

.run(function($ionicPlatform, DB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    DB.init();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.todos', {
      url: '/todos',
      views: {
        'tab-todos': {
          templateUrl: 'templates/tab-todos.html',
          controller: 'TodosCtrl',
          resolve: {
            todos: function(Todos) {
              return Todos.all();
            }
          }
        }
      }
    })
    .state('tab.todo-detail', {
      url: '/todos/:todoId',
      views: {
        'tab-todos': {
          templateUrl: 'templates/todo-detail.html',
          controller: 'TodoDetailCtrl'
        }
      }
    })
    .state('tab.todo-new', {
      url: '/todos/new',
      views: {
        'tab-todos': {
          templateUrl: 'templates/todo-new.html',
          controller: 'TodoNewCtrl'
        }
      }
    })

  .state('tab.done', {
    url: '/done',
    views: {
      'tab-done': {
        templateUrl: 'templates/tab-done.html',
        controller: 'DoneCtrl',
        resolve: {
          todos: function(Todos) {
            return Todos.all();
          }
        }
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
