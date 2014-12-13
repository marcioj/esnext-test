import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },
  model: async function() {
     var users = await this.store.find('user');
     console.log(users.get('firstObject.name'));
     return users;
  }
});
