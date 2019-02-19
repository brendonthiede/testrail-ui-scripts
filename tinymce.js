name: TinyMCE
description: Adds TinyMCE as an editor option for all textareas
author: Brendon Thiede
version: 1.0
includes:
excludes:

js:
var scriptTag = document.createElement('script');
scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.0.0/tinymce.min.js';
document.getElementsByTagName('head')[0].appendChild(scriptTag);

var synchronizationTimer;
var buttonAddingTimer;

function synchronize(force) {
    $('textarea.synchronized').each(function () {
        var textareaId = $(this).attr('data-textarea-id');
        var clonerId = $(this).attr('id');
        var editor = tinyMCE.editors[clonerId];
        if (editor && (editor.isDirty() || force)) {
            $('#' + textareaId).val("{{html}}\n" + editor.getContent() + "\n{{html}}");
        }
    });
}

function loadMce(caller) {
    if ("tinymce" in window) {
        if (!synchronizationTimer) {
            synchronizationTimer = setInterval(synchronize, 500);
        }

        var $loadButton = $(caller);
        var $unloadButton = $loadButton.parent().find('a.unload-mce');
        var $imageButton = $unloadButton.parent().find('img[src="images/icons/markdownImage.png"]').parent();
        var textareaId = $loadButton.attr('data-textarea-id');
        var clonerId = textareaId + '-cloner';
        var selector = 'textarea#' + textareaId;
        var clonerSelector = 'textarea#' + clonerId;
        var $textarea = $(selector);
        var $cloner = $(clonerSelector);
        if ($cloner.length == 0) {
            $cloner = $(selector).clone();
            $cloner.attr('id', clonerId);
            $cloner.attr('data-textarea-id', textareaId);
            $cloner.attr('name', $textarea.attr('name') + '-cloner');
            $cloner.addClass('synchronized');
            $(selector).after($cloner);
        }

        $cloner.val($textarea.val().replace(/{\{html}}/g, ''));
        $cloner.show();

        tinymce.init({
            selector: clonerSelector,
            plugins: "table code image",
            tools: "inserttable",
            menubar: "edit format table tools",
            setup: function(ed) {
                ed.on("init", function() {
                    synchronize(true);
                })}
        });
        $unloadButton.show();
        $textarea.hide();
        $loadButton.hide();
        $imageButton.hide();

        synchronize(true);
    } else {
        setTimeout(loadMce, 500);
    }
}

function unloadMce(caller) {
    synchronize(true);
    var $unloadButton = $(caller);
    var $loadButton = $unloadButton.parent().find('a.load-mce');
    var $imageButton = $unloadButton.parent().find('img[src="images/icons/markdownImage.png"]').parent();
    var textareaId = $(caller).attr('data-textarea-id');
    var clonerId = textareaId + '-cloner';
    tinyMCE.editors[clonerId].remove();
    $('#' + textareaId).show();
    $('#' + clonerId).hide();
    $unloadButton.hide();
    $loadButton.show();
    $imageButton.show();
}

function createTinyMceButtons() {
    $('div.form-group').not('.mce-enabled').each(function () {
        $(this).addClass('mce-enabled');
        var $toolbar = $(this).find('label>span.form-toolbar');
        var $markdownHelpLink = $toolbar.find('img[src="images/icons/markdownHelp.png"]').parent();

        var $loadButton = $('<a class="load-mce link-tooltip" href="javascript:void(0)" onclick="loadMce(this)" />');
        $loadButton.attr('data-textarea-id', $(this).find('textarea').attr('id'));
        $loadButton.attr('tab-index', '-1');
        $loadButton.attr('tooltip-text', 'Switch to TinyMCE editor.');
        $loadButton.html('<img src="../public/images/html-16x16.png" />');

        var $unloadButton = $('<a class="unload-mce link-tooltip" href="javascript:void(0)" onclick="unloadMce(this)" />');
        $unloadButton.attr('data-textarea-id', $(this).find('textarea').attr('id'));
        $unloadButton.attr('tab-index', '-1');
        $unloadButton.attr('tooltip-text', 'Switch back to markdown editor.');
        $unloadButton.html('<img src="../public/images/markdown.png" />');
        $unloadButton.hide();

        $markdownHelpLink.before($loadButton);
        $markdownHelpLink.before($unloadButton);
    });
}

$(document).ready(
    function() {
        createTinyMceButtons();
        if (!buttonAddingTimer) {
            buttonAddingTimer = setInterval(createTinyMceButtons, 1000);
        }
    }
);