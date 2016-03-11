angular.module('sqliteEx.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('TodosCtrl', function($scope, $state, Todos, todos) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  $scope.todos = todos;

  $scope.new = function() {
    $state.go('tab.todo-new');
  }

  $scope.done = function(todo) {
    Todos.done(todo);
  }
})

.controller('TodoDetailCtrl', function($scope, $state, $stateParams, Todos) {
  $scope.todo = {}
  Todos.get($stateParams.todoId)
    .then(function(result) {
      $scope.todo = result;
    })

  $scope.remove = function(todo) {
    Todos.remove(todo);
    $state.go('tab.todos');
  };
})

.controller('TodoNewCtrl', function($scope, $state, Todos) {
  $scope.todo = {title: "", content: "", done: false};

  $scope.save = function(todo) {
    Todos.insert(todo)
      .then(function(result) {
        $state.go('tab.todos');
      })
  }
})

.controller('DoneCtrl', function($scope, Todos, todos) {
  $scope.todos = todos;

  $scope.done = function(todo) {
    Todos.done(todo);
  }
});
