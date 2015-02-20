/* ------------------------------------------------------------

███╗   ███╗██████╗     
████╗ ████║██╔══██╗    Developer: Martin Pluta
██╔████╔██║██████╔╝    Website: http://www.martinpluta.eu
██║╚██╔╝██║██╔═══╝     E-Mail: martin.pluta@martinpluta.eu
██║ ╚═╝ ██║██║     
╚═╝     ╚═╝╚═╝     
                   
This software is not subject to copyright protection and is
in the public domain. This software is an experimental system.
The original author assumes no responsibility whatsoever for
its use by other parties, and makes no guarantees, expressed or
implied, about its quality, reliability, or any other
characteristic. An attribution is appreciated, but not required.

If you like this plugin, you may attribute to:

http://www.martinpluta.eu

----------------------------------------------------------- */
(function($) {

    $.Direction = {
        PREVIOUS: 0,
        NEXT: 1,
    };
    
    if (!$.version || $.version.major < 1) {
        throw new Error("OpenSeadragonMultiRow requires OpenSeadragon version 1.0.0+");
    }

    $.Viewer.prototype.multiRow = function(options) {
        if (!this.Instance) {
            options = options || {};
            options.viewer = this;
            this.multiRowInstance = new $.MultiRow(options);
        }
    };

    $.MultiRow = function(options) {
        options = options || {};
        if (!options.viewer) {
            throw new Error("A viewer must be specified.");
        }
        this.viewer = options.viewer;
        this.setDefaultOptions();
        this.updateOptions(options);
        this.bindMultiRowControls();
        var self = this;
        this.viewer.addHandler("open", function() {
            var sequenceIndex = getSequenceIndex(self.viewer);
            self.updateMultiRowButtons(sequenceIndex);
        });
    };

    $.MultiRow.prototype = {
        setDefaultOptions: function() {
            this.prefixUrl = "/multi-row/multi-row-images/";
            this.imagesPerRow = 0;
            this.invertVertical = false;
            this.invertHorizontal = false;
            this.preventOverride = false;
            this.multiRowControlAnchor = OpenSeadragon.ControlAnchor.TOP_LEFT;
            this.navImages = {
                previousRow: {
                    REST:   "previous_row_rest.png",
                    GROUP:  "previous_row_grouphover.png",
                    HOVER:  "previous_row_hover.png",
                    DOWN:   "previous_row_pressed.png"
                },
                nextRow: {
                    REST:   "next_row_rest.png",
                    GROUP:  "next_row_grouphover.png",
                    HOVER:  "next_row_hover.png",
                    DOWN:   "next_row_pressed.png"
                }
            };
        }, updateOptions: function(options) {
            if (!options || options === undefined) {
                return;
            }
            if (isDefined(options.prefixUrl)) {
                this.prefixUrl = options.prefixUrl;
            }
            if (isDefined(options.imagesPerRow)) {
                this.imagesPerRow = options.imagesPerRow;
            }
            if (isDefined(options.invertVertical)) {
                this.invertVertical = options.invertVertical;
            }
            if (isDefined(options.invertHorizontal)) {
                this.invertHorizontal = options.invertHorizontal;
            }
            if (isDefined(options.preventOverride)) {
                this.preventOverride = options.preventOverride;
            }
            if (isDefined(options.navImages)) {
                this.navImages = options.navImages;
            }
        }, bindMultiRowControls: function() {
            if (!this.preventOverride) {
                this.overrideHorizontalButtons();
            }
            this.createVerticalButtons();
            this.addButtons(true);
            
        }, addButtons(useGroup) {
            if (useGroup) {
                this.paging = new $.ButtonGroup({
                    buttons: [
                        this.previousButton,
                        this.nextButton,
                        this.previousRowButton,
                        this.nextRowButton
                    ],
                    clickTimeThreshold: this.viewer.clickTimeThreshold,
                    clickDistThreshold: this.viewer.clickDistThreshold
                });

                this.pagingControl = this.paging.element;

                if( this.viewer.toolbar ){
                    this.viewer.toolbar.addControl(
                        this.pagingControl,
                        {anchor: $.ControlAnchor.BOTTOM_RIGHT}
                    );
                }else{
                    this.viewer.addControl(
                        this.pagingControl,
                        {anchor: this.multiRowControlAnchor || OpenSeadragon.ControlAnchor.TOP_LEFT}
                    );
                }
            }
        }, createVerticalButtons() {
            var onPreviousRowHandler    = $.delegate( this, onPreviousRow ),
                onNextRowHandler        = $.delegate( this, onNextRow ),
                navImages               = this.navImages;

            this.previousRowButton = new $.Button({
                element:    this.previousRowButton ? $.getElement( this.previousRowButton ) : null,
                clickTimeThreshold: this.clickTimeThreshold,
                clickDistThreshold: this.clickDistThreshold,
                tooltip:    "Previous Row",
                srcRest:    resolveUrl( this.prefixUrl, this.navImages.previousRow.REST ),
                srcGroup:   resolveUrl( this.prefixUrl, this.navImages.previousRow.GROUP ),
                srcHover:   resolveUrl( this.prefixUrl, this.navImages.previousRow.HOVER ),
                srcDown:    resolveUrl( this.prefixUrl, this.navImages.previousRow.DOWN ),
                onRelease:  onPreviousRowHandler,
                onFocus:    this.viewer.onFocusHandler,
                onBlur:     this.viewer.onBlurHandler
            });

            this.nextRowButton = new $.Button({
                element:    this.nextRowButton ? $.getElement( this.nextRowButton ) : null,
                clickTimeThreshold: this.viewer.clickTimeThreshold,
                clickDistThreshold: this.viewer.clickDistThreshold,
                tooltip:    "Next Row",
                srcRest:    resolveUrl( this.prefixUrl, this.navImages.nextRow.REST ),
                srcGroup:   resolveUrl( this.prefixUrl, this.navImages.nextRow.GROUP ),
                srcHover:   resolveUrl( this.prefixUrl, this.navImages.nextRow.HOVER ),
                srcDown:    resolveUrl( this.prefixUrl, this.navImages.nextRow.DOWN ),
                onRelease:  onNextRowHandler,
                onFocus:    this.viewer.onFocusHandler,
                onBlur:     this.viewer.onBlurHandler
            });
        }, overrideHorizontalButtons() {
            this.viewer.removeControl(this.viewer.pagingControl);
            this.previousButton = new $.Button({
                element:    this.previousButton ? $.getElement( this.previousButton ) : null,
                clickTimeThreshold: this.clickTimeThreshold,
                clickDistThreshold: this.clickDistThreshold,
                tooltip:    $.getString( "Tooltips.PreviousPage" ),
                srcRest:    resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.previous.REST ),
                srcGroup:   resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.previous.GROUP ),
                srcHover:   resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.previous.HOVER ),
                srcDown:    resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.previous.DOWN ),
                onRelease:  createHorizontalHandler($.Direction.PREVIOUS, this.invertHorizontal),
                onFocus:    this.viewer.onFocusHandler,
                onBlur:     this.viewer.onBlurHandler
            });
            this.nextButton = new $.Button({
                element:    this.nextButton ? $.getElement( this.nextButton ) : null,
                clickTimeThreshold: this.clickTimeThreshold,
                clickDistThreshold: this.clickDistThreshold,
                tooltip:    $.getString( "Tooltips.NextPage" ),
                srcRest:    resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.next.REST ),
                srcGroup:   resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.next.GROUP ),
                srcHover:   resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.next.HOVER ),
                srcDown:    resolveUrl( this.viewer.prefixUrl, this.viewer.navImages.next.DOWN ),
                onRelease:  createHorizontalHandler($.Direction.NEXT, this.invertHorizontal),
                onFocus:    this.viewer.onFocusHandler,
                onBlur:     this.viewer.onBlurHandler
            });
        }, updateMultiRowButtons: function(page) {
            if ( this.nextRowButton ) {
                if (!this.invertVertical) {
                    if(!this.viewer.tileSources || this.viewer.tileSources.length - 1 - this.imagesPerRow === page) {
                        if ( !this.navPrevNextWrap ) {
                            this.nextRowButton.disable();
                        }
                    } else {
                        this.nextRowButton.enable();
                    }
                } else {
                    if(page < this.imagesPerRow) {
                        if ( !this.navPrevNextWrap ) {
                            this.nextRowButton.disable();
                        }
                    } else {
                        this.nextRowButton.enable();
                    }
                }
            }
            if ( this.previousRowButton ) {
                if (!this.invertVertical) {
                    if ( page > this.imagesPerRow - 1  ) {
                        this.previousRowButton.enable();
                    } else {
                        if ( !this.navPrevNextWrap ) {
                            this.previousRowButton.disable();
                        }
                    }
                } else {
                    if ( !this.viewer.tileSources || page < this.viewer.tileSources.length - 1 - this.imagesPerRow ) {
                        this.previousRowButton.enable();
                    } else {
                        if ( !this.navPrevNextWrap ) {
                            this.previousRowButton.disable();
                        }
                    }
                }
            }
        }
    };

    function onPrevious() {
        var sequenceIndex = getSequenceIndex(this.viewer);
        var previous = sequenceIndex - 1;
        if(previous < 0) {
            previous += this.viewer.multiRowInstance.imagesPerRow;
        }
        this.viewer.goToPage( previous );
    }

    function onNext() {
        var sequenceIndex = getSequenceIndex(this.viewer);
        var imagesPerRow = this.viewer.multiRowInstance.imagesPerRow;
        var next = sequenceIndex + 1;
        if(next % imagesPerRow == 0){
            next -= imagesPerRow;
        }
        this.viewer.goToPage( next );
    }

    function onPreviousRow() {
        var sequenceIndex = getSequenceIndex(this.viewer);
        var previous = sequenceIndex - this.imagesPerRow;
        if (this.invertVertical) {
            previous = sequenceIndex + this.imagesPerRow;
        }
        if(this.viewer.navPrevNextWrap && previous < 0){
            previous += this.viewer.tileSources.length;
        }
        this.viewer.goToPage( previous );
    }

    function onNextRow(){
        var sequenceIndex = getSequenceIndex(this.viewer);
        var next = sequenceIndex + this.imagesPerRow;
        if (this.invertVertical) {
            next = sequenceIndex - this.imagesPerRow;
        }
        if(this.viewer.navPrevNextWrap && next >= this.viewer.tileSources.length){
            next = 0;
        }
        this.viewer.goToPage( next );
    }

    function createHorizontalHandler(direction, invertHorizontal) {
        if (direction == $.Direction.PREVIOUS) {
            if (invertHorizontal) {
                return $.delegate( this, onNext );
            } else {
                return $.delegate( this, onPrevious );
            }
        } else if (direction == $.Direction.NEXT) {
            if (invertHorizontal) {
                return $.delegate( this, onPrevious );
            } else {
                return $.delegate( this, onNext );
            }
        }
    }

    function getSequenceIndex(viewer) {
        if (viewer.sequenceIndex) {
            return viewer._sequenceIndex;
        } else  {
            return viewer.currentPage();
        }
    }
    
    function resolveUrl( prefix, url ) {
        return prefix ? prefix + url : url;
    }

    function isDefined(variable) {
        return typeof (variable) !== "undefined";
    }

}(OpenSeadragon));