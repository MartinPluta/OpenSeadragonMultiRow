This OpenSeadragon ( http://openseadragon.github.io/ ) plugin adds row navigation options to the openseadragon viewer for displaying of high resolution multi row image sequences.

To use the plugin, simply copy the 'multi-row-plugin' folder into the folder containing the openseadragon js and image files. Include the 'multi-row-plugin/openseadragon-multi-row.js' file after including the 'openseadragon.min.js' file.

A demo is available at: http://www.martinpluta.eu/applications/openseadragon/multi-row/

It can be used like this:
`````javascript
    viewer.multiRow({
        ....
        prefixUrl:      "/openseadragon/multi-row-plugin/images/", //relative path to the plugin images folder
        imagesPerRow:   10,
        invertVertical: true,
        ...
    });
`````

Following options are available:
`````javascript
    prefixUrl : "/multi-row/multi-row-images/",
    imagesPerRow : 0,
    invertVertical : false,
    invertHorizontal : false,
    preventOverride : false,
    sequenceControlAnchor = OpenSeadragon.ControlAnchor.TOP_LEFT,
    navImages = {
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
`````

Disclaimer:

Developer: Martin Pluta

Website: http://www.martinpluta.eu

E-Mail: martin.pluta@martinpluta.eu

This software is not subject to copyright protection and is in the public domain. This software is an experimental system. The original author assumes no responsibility whatsoever for its use by other parties, and makes no guarantees, expressed or implied, about its quality, reliability, or any other characteristic. An attribution is appreciated, but not required.

If you like this plugin, you may attribute to:

http://www.martinpluta.eu
