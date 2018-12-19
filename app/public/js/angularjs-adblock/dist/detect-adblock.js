'use strict';
(function () {
    angular.module('detectAdblock', [])
        .provider('adblock', function () {
            this.imagePath = 'https://pbs.twimg.com/profile_images/809117081274814464/az-86S-3_400x400.jpg';
            this.title = 'Adblock Detected!';
            this.description = 'Oops! Your browser is using the Adblock Plugin. You can not access to this website with the adblock plugin. To continue website please disable adblock plugin in you browser settings.';
            this.cancel = true;
            this.refresh = true;

                        this.$get = ['$injector', '$document', function ($injector, $document) {

                var imagePath = this.imagePath;
                var title = this.title;
                var description = this.description;
                var cancel = this.cancel;
                var refresh = this.refresh;

                function _detect() {
                    var ad = angular.element('<ins></ins>');
                    ad.addClass('AdSense');
                    ad.css({
                        'display': 'block',
                        'position': 'absolute',
                        'top': '-1px',
                        'height': '1px'
                    });
                    var body = $document.find('body').eq(0);
                    body.append(ad);
                    var isAdBlockEnabled = !ad[0].clientHeight;
                    return isAdBlockEnabled;
                }

                function _template() {
                    var element = {
                        body: function () {
                            return $document.find('body').eq(0);
                        },
                        div: function () {
                            return angular.element('<div></div>');
                        },
                        img: function () {
                            return angular.element('<img>');
                        },
                        span: function () {
                            return angular.element('<span></span>');
                        },
                        p: function () {
                            return angular.element('<p></p>');
                        },
                        button: function () {
                            return angular.element('<button></button>');
                        }    
                    }

                    var image = element.img(),
                        alertImage = element.div(),
                        alertTitle = element.span(),
                        alertDescription = element.p(),
                        alertContent = element.div(),
                        cancelButton = element.button(),
                        refreshButton = element.button(),
                        alertButtons = element.div(),
                        adAlert = element.div(),
                        body = $document.find('body').eq(0),
                        adblock = element.div();

                    image.attr('src', imagePath);                    
                    alertImage.addClass('alert-image');
                    alertImage.append(image);
                    alertTitle.append(title);
                    alertDescription.append(description);
                    alertContent.addClass('alert-content');
                    alertContent.append(alertTitle);
                    alertContent.append(alertDescription);
                    cancelButton.append('<i class="fa fa-times"></i>');
                    cancelButton.append('Cancel');
                    cancelButton.bind('click', function($event) {
                        body.find(".adblock-detect").remove();
                    });
                    refreshButton.append('<i class="fa fa-refresh"></i>');
                    refreshButton.addClass('refresh');
                    refreshButton.append('I Have Dısable Adblock');
                    refreshButton.bind('click', function($event) {
                       location.reload(); 
                    });
                    alertButtons.addClass('alert-buttons');
                    if(cancel){
                        alertButtons.append(cancelButton);
                    }
                    if(refresh){
                        alertButtons.append(refreshButton);
                    }
                    adAlert.addClass('ad-alert');
                    adAlert.append(alertImage);
                    adAlert.append(alertContent);
                     if(cancel || refresh){
                        adAlert.append(alertButtons);
                        adAlert.css({
                            'height': '380px'
                        })
                    }
                    adblock.addClass('adblock-detect');
                    adblock.append(adAlert);
                    return adblock;
                }

                function _alert() {
                    var adblock = _template();
                    var body = $document.find('body').eq(0);
                    body.append(adblock);
                }

                function _start() {
                    var adblock = _detect();
                    debugger;
                    if (adblock == true) {
                        _alert();
                    }
                }

                return {
                    detect: _start,
                };
            }];
        })
})();