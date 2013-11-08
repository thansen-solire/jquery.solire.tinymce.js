/**
 * @author thansen <thansen@solire.fr>
 * @licence solire.fr
 *
 * @param jQuery $
 * @param tinymce tinymce
 *
 * @returns jQuery
 */
(function($, tinymce) {
    /**
     *
     * @param {string} method
     *
     * @returns jQuery
     */
    $.fn.tinymce = function(method) {
        var base = this;
            publicMethods = {};

        /**
         *
         * @param {int} length
         *
         * @returns {String}
         */
        function randomString(length)
        {
            var i,
                text = '',
                possible    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                            + 'abcdefghijklmnopqrstuvwxyz'
                            + '0123456789';

            for(i=0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }

        /**
         * Génére un attribut id unique (pour element HTML)
         *
         * @returns {String}
         */
        function randomId()
        {
            do{
                tmpId = randomString(10);
            } while ($('#tinymce-' + tmpId).length > 0)

            return 'tinymce-' + tmpId;
        }

        /**
         * Adds a public method to the base element, to allow methods calls
         * to be made on the returned object.
         *
         * @param {String}   name
         * @param {function} func
         *
         * @return {void}
         */
		function addMethod(name, func) {
            publicMethods[name] = func;
		}

        /**
         *
         *
         * @returns void
         */
        function _enable()
        {
            tinyMCE.execCommand('mceAddEditor', false, this.id);
        }

        /**
         *
         *
         * @returns void
         */
        function _disable()
        {
            tinyMCE.execCommand('mceFocus', false, this.id);
            tinyMCE.execCommand('mceRemoveEditor', false, this.id);
            tinyMCE.triggerSave(true, true);
        }

        /**
         *
         *
         * @returns void
         */
        function change()
        {
            if(typeof tinyMCE.get(this.id) !== 'undefined') {
                _disable.call(this);
            } else {
                _enable.call(this);
            }

            // tinyMCE.execCommand('mceToggleEditor',false,this.id);
        };

        /**
         *
         *
         * @returns void
         */
        function disable()
        {
            if (typeof tinyMCE.get(this.id) !== 'undefined') {
                _disable.call(this);
            }
        }

        /**
         *
         *
         * @returns void
         */
        function enable()
        {
            if (typeof tinyMCE.get(this.id) === 'undefined') {
                _enable.call(this);
            }
        }

        function isFunc(func)
        {
            return $.isFunction(func);
        }

        function init()
        {
            if (!$(this).data('tynimce')) {
                if (this.id === null || this.id === ''
                    || $('[id=' + this.id + ']').length > 1
                ) {
                    this.id = randomId();
                    $(this).attr('tynimce-id', this.id);
                }

                $(this).data('tynimce', true);
            }
        }

        addMethod('disable', disable);
        addMethod('enable', enable);
        addMethod('change', change);

        return base.each(function(){
            init.call(this);

            if (method in publicMethods && isFunc(publicMethods[method])) {
                publicMethods[method].call(this);
            }
        });
    };
})(jQuery, tinymce);

