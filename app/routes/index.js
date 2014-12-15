import Ember from 'ember';

export default Ember.Route.extend({
  model: async function() {
    var msgPromise = Ember.RSVP.resolve('Hello world');
    var msg = await msgPromise;
    console.log(msg);
    return msgPromise;
  }
})
