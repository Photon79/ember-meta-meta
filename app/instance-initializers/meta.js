import Meta from '../services/meta/service';

export default {
  name: 'meta',

  initialize: function(application) {
    application.register('service:meta', Meta, {
      instantiate: true,
      singleton: true
    });

    application.inject('route', 'meta', 'service:meta');

    // Store default values
    const meta = application.lookup('service:meta');
    meta.storeDefaultTitle();

    // Bind on didTransition
    application.lookup('router:main').on('didTransition', function() { meta.insert() });
  }
};
