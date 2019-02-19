name: Collapsible Changes
description: Allows you to collapse items in the changes are of a run
author: Brendon Thiede
version: 1.0
includes:
excludes:

js:
function toggleSection(caller) {
    var $change = $(caller).closest('div.change');
    var $table = $(caller).closest('div.table');
    var $collapsedTable = $change.find('div.table.collapsed');
    if ($collapsedTable.length == 0) {
        $collapsedTable = $change.find('div.table').clone();
        $collapsedTable.addClass('collapsed');
        $collapsedTable.find('a.collapser>img').attr('src', 'images/icons/expand.png');
        var changer = " " + $collapsedTable.find('div.change-meta p>span>strong').text();
        $collapsedTable.find('div.change-meta p').remove();
        $collapsedTable.find('div.change-meta').append(changer);

        var $content = $collapsedTable.find('div.change-column-content');
        $content.html($content.text().substr(0, 100).trim() + '...');

        $change.append($collapsedTable);
    }
    if ($table.hasClass('collapsed')) {
        $change.find('div.table.expanded').show();
        $change.find('div.table.collapsed').hide();
    } else {
        $change.find('div.table.expanded').hide();
        $change.find('div.table.collapsed').show();
    }
}

$(document).ready(function () {
    $('span.status').before('<a href="javascript:void(0)" class="collapser" onclick="toggleSection(this)" />');
    $('a.collapser').html('<img src="images/icons/collapse.png" /> ').each(function() {
        $(this).closest('div.table').addClass('expanded');
        toggleSection(this);
    });
});
