import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;
var originalConfirm;
var confirmCalledWith;

function defineFixturesFor(name, fixtures) {
  var modelClass = App.__container__.lookupFactory('model:' + name);
  modelClass.FIXTURES = fixtures;
}

module('Acceptance: User', {
  setup: function() {
    App = startApp();
    defineFixturesFor('user', []);
    originalConfirm = window.confirm;
    window.confirm = function() {
      confirmCalledWith = [].slice.call(arguments);
      return true;
    };
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    window.confirm = originalConfirm;
    confirmCalledWith = null;
  }
});

test('visiting /users without data', function() {
  visit('/users');

  andThen(function() {
    equal(currentPath(), 'users.index');
    equal(find('#blankslate').text().trim(), 'No Users found');
  });
});

test('visiting /users with data', function() {
  defineFixturesFor('user', [{ id: 1, name: 'MyString', age: 42 }]);
  visit('/users');

  andThen(function() {
    equal(currentPath(), 'users.index');
    equal(find('#blankslate').length, 0);
    equal(find('table tbody tr').length, 1);
  });
});

test('create a new user', function() {
  visit('/users');
  click('a:contains(New User)');

  andThen(function() {
    equal(currentPath(), 'users.new');

    fillIn('label:contains(Name) input', 'MyString');
    fillIn('label:contains(Age) input', 42);

    click('input:submit');
  });

  andThen(function() {
    equal(find('#blankslate').length, 0);
    equal(find('table tbody tr').length, 1);
  });
});

test('update an existing user', function() {
  defineFixturesFor('user', [{ id: 1 }]);
  visit('/users');
  click('a:contains(Edit)');

  andThen(function() {
    equal(currentPath(), 'users.edit');

    fillIn('label:contains(Name) input', 'MyString');
    fillIn('label:contains(Age) input', 42);

    click('input:submit');
  });

  andThen(function() {
    equal(find('#blankslate').length, 0);
    equal(find('table tbody tr').length, 1);
  });
});

test('show an existing user', function() {
  defineFixturesFor('user', [{ id: 1, name: 'MyString', age: 42 }]);
  visit('/users');
  click('a:contains(Show)');

  andThen(function() {
    equal(currentPath(), 'users.show');

    equal(find('p strong:contains(Name:)').next().text(), 'MyString');
    equal(find('p strong:contains(Age:)').next().text(), 42);
  });
});

test('delete a user', function() {
  defineFixturesFor('user', [{ id: 1, name: 'MyString', age: 42 }]);
  visit('/users');
  click('a:contains(Remove)');

  andThen(function() {
    equal(currentPath(), 'users.index');
    deepEqual(confirmCalledWith, ['Are you sure?']);
    equal(find('#blankslate').length, 1);
  });
});