var Base = require('ribcage-view')
  , Button = require('ribcage-button')
  , Menu = require('ribcage-menu')
  , defer = require('lodash.defer')
  , bind = require('lodash.bind');

var Modal = Base.extend({
  shown: false

, template: function () {
    return '\
      <div class="main">\
        <div class="menu"></div>\
      </div>';
  }

, open: function () {
    this.$el.show();
    this.shown = true;
  }

, close: function () {
    this.$el.hide();
    this.shown = false;
    Modal.__super__.close.apply(this, arguments);
  }

, setContent: function (view) {
    this.view = view;
    this.render();
  }

, clearButtons: function () {
    this.menu.clearButtons();
  }

, addButton: function (opts) {
    this.menu.addButton(opts);
  }

, afterInit: function () {
    this.view = this.options.view;
  }

, afterRender: function () {
    var self = this;

    if (this.view) {

      this.view.on('showBack', function () {
        self.backButton.$el.show();
        self.closeButton.$el.hide();
      });

      this.view.on('hideBack', function () {
        self.backButton.$el.hide();
        self.closeButton.$el.show();
      });

      this.view.on('close', function () {
        self.trigger('close');
      });

      this.view.on('clearButtons', bind(this.clearButtons, this));
      this.view.on('addButton',    bind(this.addButton, this));

      this.appendSubview(this.view, this.$('.main'));
      // Wait for iiiiiiittttttt.
      defer(function () {
        self.view.render();
        self.view.$el.css('height', '100%');
        self.view.$('.pane-holder').css('height', '100%');
      });
    }

    this.menu = new Menu({className: 'pull-right'});
    this.appendSubview(this.menu, this.$('.menu'));

    this.closeButton = new ButtonBase({
      label: 'Close'
    , classStr: 'btn-primary btn-text closeBtn'
    , action: function () {
        self.trigger('close');
      }
    });
    this.appendSubview(this.closeButton, this.$('.menu'));

    this.backButton = new ButtonBase({
      label: 'Back'
    , classStr: 'btn-primary btn-text hidden backBtn'
    , action: function () {
        self.view.paneSwitcher.previous();
        if (self.view.paneSwitcher.currentPane == 0) {
          self.backButton.$('button').hide();
          self.closeButton.$('button').show();
        }
      }
    });
    this.appendSubview(this.backButton, this.$('.menu'));
  }

});

module.exports = Modal;
