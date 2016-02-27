import Ember from 'ember';

export default Ember.Service.extend({
  /**
    Store the default document title

    @method storeDefaultTitle
  */
  storeDefaultTitle: function(){
    this.set('defaultTitle', window.document.title);
  },

  /**
    Set metas to be injected

    For example :

    ```js
      this.get('meta').update({
        title: 'This Is News Title',
        description: 'This Is News Description',
        'og:image': 'https://example.net/latest-news.png'
      });
    ```

    @method update
    @param {Object} attributes
  */
  update: function(attributes) {
    this.set('attributes', attributes);
  },

  /**
    Inject given metas in document after completed didTransition

    @method insert
  */
  insert: function() {
    var self = this,
        attributes = this.get('attributes') || { title: this.get('defaultTitle') },
        metas = [].slice.call(document.querySelectorAll('meta[data-meta-meta="true"]'));

    // Remove previously set metas
    metas.forEach(function(meta){
      meta.removeAttribute('content');
    });

    // Set new metas
    Object.keys(attributes).forEach(function(key){
      self.setMeta(key, attributes[key])
    });

    // Reset for next transition
    this.set('attributes', null);
  },

  /**
    Returns the title, exists solely to be reopen for your needs

    @method title
  */
  title: function(value) {
    return value;
  },

  /**
    Inject given meta in document.

    Example :

    ```js
      self.router.setMeta('title', 'Homepage of the Crew');
    ```

    @method setMetas
    @param {Object} attributes
  */
  setMeta: function(name, value) {
    var meta, key;

    if (name === 'title') {
      window.document.title = this.title(value);
    } else {
      key = (name.indexOf('og:') === -1) ? 'name' : 'property';
      meta = document.querySelector('meta[' + key + '="' + name + '"]');

      // Create meta tag if does not exist
      if(!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(key, name);
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      meta.setAttribute('data-meta-meta', 'true');
      meta.setAttribute('content', value);
    }
  }
});
