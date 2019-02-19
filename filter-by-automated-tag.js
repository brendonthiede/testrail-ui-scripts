name: Filter by Automated tag
description: Hides test cases that have a tag of Automated (Requires Tags column to be visible)
author: Brendon Thiede
version: 1.0
includes: ^(suites|runs)/view
excludes: 

js:
$(document).ready(function () {
    window.TestRailCustomUI = window.TestRailCustomUI || {};
    window.TestRailCustomUI.TagFilter = window.TestRailCustomUI.TagFilter || {};

    window.TestRailCustomUI.TagFilter.filter = function (tagValue, isChecked) {
        if (isChecked) {
            $('.tag-' + tagValue).hide();
            localStorage.setItem('tagsFilter' + tagValue, true);
        } else {
            $('.tag-' + tagValue).show();
            localStorage.setItem('tagsFilter' + tagValue, false);
        }
        // TODO: hide tables with no visible children of the ('tr.caseRow, tr.row') variety
    };

    function isRunPage() {
        return location.href.indexOf("/runs/view") === (location.protocol + "//" + location.hostname + location.pathname + "?").length;
    }

    function tagEmptyTables() {
        $('table.selectable').each(function () {
            var $table = $(this);
            $table.find('');
        });
    }

    window.TestRailCustomUI.TagFilter.assignTags = function () {
        var tagsChildPosition = -1;
        var tagOffset = 3;
        if (isRunPage()) {
            tagOffset = 2;
        }
        $('tr.header:first>th>a.link-noline').each(function (index) {
            if ($(this).text() === 'Tags') {
                tagsChildPosition = index + tagOffset;
            }
        });
        if (tagsChildPosition >= tagOffset) {
            $('tr.caseRow, tr.row').each(function () {
                var $this = $(this);
                $this.find('td:nth-child(' + tagsChildPosition + ')').text()
                    .replace(/\s/g, '').split(',')
                    .forEach(function (tagValue) {
                        $this.addClass('tag-' + tagValue);
                    });
            });
        }
    };

    window.TestRailCustomUI.TagFilter.addFilterCheckbox = function (tagValue) {
        var tagFilterId = 'tag-filter-' + tagValue;
        var $tagFilter = $('#' + tagFilterId);
        if ($('tr.header>th>a.link-noline:contains("Tags")').length > 0) {
            if ($tagFilter.length === 0) {
                $tagFilter = $('<li id="' + tagFilterId + '" class="toolbar-menu-item toolbar-menu-item-last text-ppp"/>');
                var tagFilterInputId = tagFilterId + '-input';
                var $tagFilterInput = $('<input id="' + tagFilterInputId + '" type="checkbox" class="selectionCheckbox">');
                $tagFilterInput.attr('data-tag-value', tagValue);
                $tagFilterInput.attr('title', 'Hides entries with a tag of ' + tagValue);
                $tagFilterInput.change(function () {
                    window.TestRailCustomUI.TagFilter.filter(tagValue, $(this).is(':checked'));
                });
                var $tagFilterLabel = $('<label for="' + tagFilterInputId + '"> Hide ' + tagValue + '</label>');
                $tagFilter.append($tagFilterInput);
                $tagFilter.append($tagFilterLabel);
                $('ul.toolbar-menu').append($tagFilter);
                if (localStorage.getItem('tagsFilter' + tagValue) && localStorage.getItem('tagsFilter' + tagValue) === 'true') {
                    setTimeout(function () {
                        $tagFilterInput.click();
                    }, 100);
                }
            }
        } else {
            $tagFilter.remove();
        }
    };

    $(document).ajaxSuccess(function(e, xhr, opt) {
        TestRailCustomUI.TagFilter.addFilterCheckbox('Automated');
        window.TestRailCustomUI.TagFilter.assignTags();
    });
});