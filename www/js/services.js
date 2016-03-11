angular.module('sqliteEx.services', [])

.factory('DB', function($q, DB_CONFIG) {
  var self = this;
  self.db = null;
  self.init = function() {
    if (window.sqlitePlugin)
      self.db = window.sqlitePlugin.openDatabase({
        name: DB_CONFIG.name
      });
    else if (window.openDatabase)
      self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', '1024*1024');

    for (var tableName in DB_CONFIG.tables) {
      var defs = [];
      var columns = DB_CONFIG.tables[tableName];
      for (var columnName in columns) {
        var type = columns[columnName];
        defs.push(columnName + ' ' + type);
      }
      // self.query("DROP TABLE todo");
      var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + defs.join(', ') + ')';
      self.query(sql);
    }
  };

  self.insertAll = function(tableName, data) {
    var columns = [],
      bindings = [];

    for (var columnName in DB_CONFIG.tables[tableName]) {
      columns.push(columnName);
      bindings.push('?');
    }

    var sql = 'INSERT INTO ' + tableName + ' (' + columns.join(', ') + ') VALUES (' + bindings.join(', ') + ')';
    for (var i = 0; i < data.length; i++) {
      var values = [];
      for (var j = 0; j < columns.length; j++) {
        values.push(data[i][columns[j]]);
      }
      console.log(values)
      self.query(sql, values);
    }
  };

  self.query = function(sql, bindings) {
    bindings = typeof bindings !== 'undefined' ? bindings : [];
    var deferred = $q.defer();

    self.db.transaction(function(transaction) {
      transaction.executeSql(sql, bindings, function(transaction, result) {
        deferred.resolve(result);
      }, function(transaction, error) {
        deferred.reject(error);
        console.log(error);
      });
    });

    return deferred.promise;
  };

  self.fetchAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }

    return output;
  };

  return self;
})

.factory('Todos', function($q, DB) {
  var todos = [];

  return {
    all: function() {
      if (todos.length < 1) {
        var sql = "SELECT rowid, title, content, done FROM todo";

        return DB.query(sql)
          .then(function(result) {
            todos = DB.fetchAll(result);
            todos.forEach(function(e) {
              e.done = JSON.parse(e.done)
            })
            return todos;
          });
      }
      return todos;
    },
    insert: function(todo) {
      return DB.query("INSERT INTO todo VALUES (?,?,?)", [todo.title, todo.content, false])
        .then(function(result) {
          todo.rowid = result.insertId;
          todos.push(todo);
          todo.done = false;
          return todo;
        });
    },
    done: function(todo){
      return DB.query("UPDATE todo SET done=? WHERE rowid=?", [!JSON.parse(todo.done), todo.rowid])
        .then(function(result) {
          var index = todos.map(function(e) { return e.rowid; }).indexOf(todo.rowid);
          todos[index].done = !JSON.parse(todo.done);
          return true;
        });
    },
    remove: function(todo) {
      return DB.query("DELETE FROM todo WHERE rowid=(?)", [todo.rowid])
        .then(function(result) {
          var index = todos.map(function(e) { return e.rowid; }).indexOf(todo.rowid);
          todos.splice(index, 1);
          return true;
        });
    },
    get: function(todoId) {
      return DB.query("SELECT rowid, title, content, done FROM todo WHERE rowid=(?)", [todoId])
        .then(function(result) {
          var todo = DB.fetchAll(result)[0];
          todo.done = JSON.parse(todo.done);
          return todo;
        });
    }
  };
});
