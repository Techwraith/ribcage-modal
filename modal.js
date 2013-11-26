var Base = require('ribcage-view')
  , Button = require('ribcage-button')
  , TopBar = require('ribcage-top-bar')
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
    this.topbar.setRightButton()
  }

, addButton: function (opts) {
    this.topbar.setRightButton(opts)
  }

, afterInit: function () {
    this.view = this.options.view;
  }

, afterRender: function () {
    var self = this

    if (this.view) {

      this.view.on('showBack', function () {
        self.topbar.setLeftButton(self.backButton())
      })

      this.view.on('hideBack', function () {
        self.topbar.setLeftButton(self.closeButton())
      })

      this.view.on('close', function () {
        self.trigger('close')
      })

      this.view.on('clearButtons', _.bind(this.clearButtons, this))
      this.view.on('addButton',    _.bind(this.addButton, this))

      this.appendSubview(this.view, this.$('.main'))
      // Wait for iiiiiiittttttt.
      _.defer(function () {
        self.view.render()
        self.view.$el.css('height', '100%')
        self.view.$('.pane-holder').css('height', '100%')
      })
    }

    this.closeButton = function () {
      return new Button({
        label: self.options.closeLabel || ''
      , icon: self.options.closeIcon || 'icon-remove'
      , classStr: 'btn-primary btn-text closeBtn'
      , action: function () {
          self.trigger('close')
        }
      })
    }

    this.backButton = function () {
      return new Button({
        label: self.options.backLabel || ''
      , icon: self.options.backIcon || 'icon-chevron-left'
      , classStr: 'btn-primary btn-text backBtn'
      , action: function () {
          self.view.paneSwitcher.previous();
          if (self.view.paneSwitcher.currentPane == 0) {
            self.view.trigger('hideBack')
          }
        }
      })
    }

    this.topbar = new TopBar({
      left: self.closeButton()
    , title: self.view.title
    })
    this.appendSubview(this.topbar, this.$('.menu'))

  }

});

module.exports = Modal;
