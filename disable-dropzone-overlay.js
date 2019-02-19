name: Disable Dropzone overlay
description: Stops Dropzone from being able to create the overlay for "Drop images here to embed."
author: Brendon Thiede
version: 1.0
includes:
excludes:

js:
$(document).ready(
    function() {
        function disableDZOverlay() {
            if (App && App.Dropzone && App.Dropzone.show) {
                App.Dropzone.show = function () {};
            } else {
                setTimeout(disableDZOverlay, 500);
            }
        }
        disableDZOverlay();
    }
);