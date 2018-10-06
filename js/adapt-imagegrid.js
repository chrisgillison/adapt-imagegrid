
define([
    'core/js/adapt',
    'core/js/views/componentView'
], function(Adapt, ComponentView) {

    var Imagegrid = ComponentView.extend({

        preRender: function () {
            this.listenTo(Adapt, 'device:changed', this.resizeControl);

            this.setDeviceSize();

            this.checkIfResetOnRevisit();
        },

        setDeviceSize: function() {
            if (Adapt.device.screenSize === 'large') {
                this.$el.addClass('desktop').removeClass('mobile');
                this.model.set('_isDesktop', true);
            } else {
                this.$el.addClass('mobile').removeClass('desktop');
                this.model.set('_isDesktop', false);
            }
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$('.component-widget').off('inview');
                    this.setCompletionStatus();
                }

            }
        },

        remove: function() {
          // Remove any 'inview' listener attached.
          this.$('.component-widget').off('inview');

          ComponentView.prototype.remove.apply(this, arguments);
        },

        postRender: function() {
            this.setUpColumns();

            this.$('.imagegrid-widget').imageready(_.bind(function() {
                this.setReadyStatus();

                // Bind 'inview' once the image is ready.
                this.$('.component-widget').on('inview', _.bind(this.inview, this));

            }, this));
        },

        resizeControl: function() {
            this.setDeviceSize();
            this.render();
        },

        setUpColumns: function() {
            var columns = this.model.get('_columns');

            if (columns && Adapt.device.screenSize === 'large') {
                this.$('.imagegrid-grid-item').css('width', (100 / columns) + '%');
            }
        }

    },{
        template: "imagegrid"
    });

    return Adapt.register("imagegrid", Imagegrid);
});
