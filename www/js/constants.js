angular.module('sqliteEx.constants', [])
.constant('DB_CONFIG', {
  name: 'sqliteEx',
  tables: {
    todo: {
      title: 'text',
      content: 'text',
      done: 'boolean default false not null'
    }
  }
})