name: HTML Rendering
description: Renders HTML in special tags as HTML
author: Brendon Thiede
version: 1.0
includes:
excludes:

js:
var renderHtml = function () {
    $('div.markdown>p').each(function () {
        var markdownText = $(this).text();
        var htmlBeginMarker = markdownText.indexOf("{{html}}") + "{{html}}".length;
        var htmlEndMarker = markdownText.indexOf("{{html}}", htmlBeginMarker + 1);
        while (htmlEndMarker > 0) {
            var htmlLength = htmlEndMarker - htmlBeginMarker;
            var htmlSegment = "<p>" + markdownText.substr(htmlBeginMarker, htmlLength) + "</p>";
            $(this).html($(this).html().replace(/({\{html}}).*?({\{html}})/, htmlSegment));
            markdownText = $(this).text();
            htmlBeginMarker = markdownText.indexOf("{{html}}") + "{{html}}".length;
            htmlEndMarker = markdownText.indexOf("{{html}}", htmlBeginMarker + 1);
        }
    });
    setTimeout(renderHtml, 2000);
};

$(document).ready(function () {
    renderHtml();
});

css:
div.markdown table td {
    border: 1px solid black;
    padding: 3px;
}
 