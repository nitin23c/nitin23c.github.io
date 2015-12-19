(function ($) {

    var settings = {

        // Parallax background effect?
        parallax: true,

        // Parallax factor (lower = more intense, higher = less intense).
        parallaxFactor: 10

    };

    skel.init({
                  reset: 'full',
                  breakpoints: {
                      'global': { range: '*', href: '2015/css/style.css', containers: 1140, grid: { gutters: 40 } },
                      'wide': { range: '-1680', href: '2015/css/style-wide.css', containers: 960 },
                      'narrow': { range: '-840', href: '2015/css/style-narrow.css', grid: { gutters: 30 } },
                      'mobile': { range: '-736', href: '2015/css/style-mobile.css', containers: '95%!', grid: { collapse: true, gutters: 20 } }
                  }
              });

    $(function () {

        var $window = $(window),
            $body = $('body');

        if (skel.vars.isTouch) {

            settings.parallax = false;
            $body.addClass('is-scroll');

        }

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function () {
            $body.removeClass('is-loading');
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // Forms (IE<10).
        var $form = $('form');
        if ($form.length > 0) {

            $form.find('.form-button-submit')
                .on('click', function () {
                        $(this).parents('form').submit();
                        return false;
                    });

            if (skel.vars.IEVersion < 10) {
                $.fn.n33_formerize = function () {
                    var _fakes = new Array(), _form = $(this);
                    _form.find('input[type=text],textarea').each(function () {
                        var e = $(this);
                        if (e.val() == '' || e.val() == e.attr('placeholder')) {
                            e.addClass('formerize-placeholder');
                            e.val(e.attr('placeholder'));
                        }
                    }).blur(function () {
                        var e = $(this);
                        if (e.attr('name').match(/_fakeformerizefield$/)) return;
                        if (e.val() == '') {
                            e.addClass('formerize-placeholder');
                            e.val(e.attr('placeholder'));
                        }
                    }).focus(function () {
                        var e = $(this);
                        if (e.attr('name').match(/_fakeformerizefield$/)) return;
                        if (e.val() == e.attr('placeholder')) {
                            e.removeClass('formerize-placeholder');
                            e.val('');
                        }
                    });
                    _form.find('input[type=password]').each(function () {
                        var e = $(this);
                        var x = $($('<div>').append(e.clone()).remove().html().replace(/type="password"/i,
                                                                                       'type="text"').replace(/type=password/i,
                                                                                                              'type=text'));
                        if (e.attr('id') != '') x.attr('id', e.attr('id') + '_fakeformerizefield');
                        if (e.attr('name') != '') x.attr('name', e.attr('name') + '_fakeformerizefield');
                        x.addClass('formerize-placeholder').val(x.attr('placeholder')).insertAfter(e);
                        if (e.val() == '') e.hide(); else x.hide();
                        e.blur(function (event) {
                            event.preventDefault();
                            var e = $(this);
                            var x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]');
                            if (e.val() == '') {
                                e.hide();
                                x.show();
                            }
                        });
                        x.focus(function (event) {
                            event.preventDefault();
                            var x = $(this);
                            var e = x.parent().find('input[name=' + x.attr('name').replace('_fakeformerizefield', '') +
                                                        ']');
                            x.hide();
                            e.show().focus();
                        });
                        x.keypress(function (event) {
                            event.preventDefault();
                            x.val('');
                        });
                    });
                    _form.submit(function () {
                        $(this).find('input[type=text],input[type=password],textarea').each(function (event) {
                            var e = $(this);
                            if (e.attr('name').match(/_fakeformerizefield$/)) e.attr('name', '');
                            if (e.val() == e.attr('placeholder')) {
                                e.removeClass('formerize-placeholder');
                                e.val('');
                            }
                        });
                    }).bind("reset", function (event) {
                        event.preventDefault();
                        $(this).find('select').val($('option:first').val());
                        $(this).find('input,textarea').each(function () {
                            var e = $(this);
                            var x;
                            e.removeClass('formerize-placeholder');
                            switch (this.type) {
                                case 'submit':
                                case 'reset':
                                    break;
                                case 'password':
                                    e.val(e.attr('defaultValue'));
                                    x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]');
                                    if (e.val() == '') {
                                        e.hide();
                                        x.show();
                                    } else {
                                        e.show();
                                        x.hide();
                                    }
                                    break;
                                case 'checkbox':
                                case 'radio':
                                    e.attr('checked', e.attr('defaultValue'));
                                    break;
                                case 'text':
                                case 'textarea':
                                    e.val(e.attr('defaultValue'));
                                    if (e.val() == '') {
                                        e.addClass('formerize-placeholder');
                                        e.val(e.attr('placeholder'));
                                    }
                                    break;
                                default:
                                    e.val(e.attr('defaultValue'));
                                    break;
                            }
                        });
                        window.setTimeout(function () {
                            for (x in _fakes) _fakes[x].trigger('formerize_sync');
                        }, 10);
                    });
                    return _form;
                };
                $form.n33_formerize();
            }

        }

        // Scrolly links.
        $('.scrolly').scrolly(1000, function () {
            return (skel.isActive('mobile') ? 70 : 190);
        });

        // Full screen #fullscreen.
        var idtags = ['#header', '#myQuotes', '#myHumor', '#photography', '#footer'];

        for (i = 0; i < idtags.length; i++) {
            FullScreen($(idtags[i]));
        }

        function FullScreen(idTag) {
            if (idTag.length > 0) {

                var $header_header = idTag.find('header');

                $window
                    .on('resize.overflow_fsh', function () {

                            if (skel.isActive('mobile')) {
                                idTag.css('padding', '');
                                document.getElementById("panoramio").innerHTML =
                                    '<iframe frameborder="0" height="200" marginheight="0" marginwidth="0" scrolling="no"src="http://www.panoramio.com/wapi/template/slideshow.html?user=2481456&amp;tag=best&amp;width=330&amp;height=200&amp;order=date_desc&amp;delay=8"width="330"></iframe>';
                            } else {
                                var p = Math.max(60, ($window.height() - $header_header.outerHeight(true)) / 2);
                                idTag.css('padding', p + 'px 0 ' + p + 'px 0');
                            }

                        })
                    .trigger('resize.overflow_fsh');

                $window.load(function () {
                    $window.trigger('resize.overflow_fsh');
                });

            }

        }

        // Parallax background.

        // Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
        if (skel.vars.browser == 'ie'
            || skel.vars.isMobile)
            settings.parallax = false;

        if (settings.parallax) {

            var $dummy = $(), $bg;

            $window
                .on('scroll.overflow_parallax', function () {

                        // Adjust background position.
                        $bg.css('background-position',
                                'center ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');

                    })
                .on('resize.overflow_parallax', function () {

                        // If we're in a situation where we need to temporarily disable parallax, do so.
                        if (!skel.isActive('wide')
                            || skel.isActive('narrow')) {

                            $body.css('background-position', '');
                            $bg = $dummy;

                        }

                        // Otherwise, continue as normal.
                        else
                            $bg = $body;

                        // Trigger scroll handler.
                        $window.triggerHandler('scroll.overflow_parallax');

                    })
                .trigger('resize.overflow_parallax');

        }

    });

})(jQuery);