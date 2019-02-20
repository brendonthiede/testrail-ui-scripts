name: Test Step Cloning
description: Allows for cloning a test step
author: Brendon thiede
version: 1.0
includes: ^cases/edit
excludes:

js:
$(document).ready(function () {
    window.TestRailCustomUI = window.TestRailCustomUI || {};
    window.TestRailCustomUI.Cases = window.TestRailCustomUI.Cases || {};
    window.TestRailCustomUI.Cases.cloneStep = function (projectId, fieldName, originUUID) {
        var $fieldContainer = $("#" + fieldName + "_container");
        $(".addStepBusy", $fieldContainer).show();
        $(".addStep", $fieldContainer).hide();
        var $fieldTable = $("#" + fieldName + "_table");
        var newIndex = $("tr", $fieldTable).length + 1;
        App.Ajax.call({
            target: "/cases/ajax_render_step",
            arguments: {index: newIndex, project_id: projectId, field_name: fieldName},
            success: function (data) {
                window.applyDropOriginal = App.Dropzone.applyDrop;
                App.Dropzone.applyDrop = function () {
                    console.log('applyDrop called, but thwarted');
                };
                try {
                    $(".noSteps", $fieldContainer).hide();
                    var $newStep = $(data);
                    var $originRow = $fieldTable.find("tr.step-" + originUUID);

                    $newStep.insertAfter($originRow);
                    $newStep.appendTo($fieldTable);
                    $(".addStepBusy", $fieldContainer).hide();
                    $(".addStep", $fieldContainer).show();

                    TestRailCustomUI.Cases.addCloneButtons();
                    var $originStepContent = $('#stepContent-' + originUUID);
                    var $originStepExpected = $('#stepExpected-' + originUUID);
                    var $newStepContent = $newStep.find('div.step-text-content textarea');
                    var $newStepExpected = $newStep.find('div.step-text-expected textarea');
                    $newStepContent.val($originStepContent.val());
                    $newStepExpected.val($originStepExpected.val());

                    $newStep.find("textarea:first").focus();
                    App.Cases.changeSteps(fieldName);
                } catch (ex) {
                    console.log('*************Error encountered in Cloning*************');
                    console.log(ex);
                } finally {
                    App.Dropzone.applyDrop = window.applyDropOriginal;
                }
            },
            error: function (data) {
                $(".addStepBusy", $fieldContainer).hide();
                $(".addStep", $fieldContainer).show();
                App.Ajax.handleError(data);
            }
        })
    };

    window.TestRailCustomUI.Cases.addCloneButtons = function () {
        $("td.step-buttons").each(function () {
            var $stepButtons = $(this);
            if ($stepButtons.find("div.clone").length == 0) {
                var $cloneButton = $stepButtons.find("a.moveDown:first").clone();
                var $cloneImage = $cloneButton.find("img");
                $cloneImage.attr("src", "https://static.testrail.io/5.6.0.3862/images/icons/move.png");
                $cloneImage.attr("alt", "Clone");
                $cloneImage.attr("title", "Clone");
                $cloneButton.attr("onClick", $cloneButton.attr("onClick").replace("App.Cases.addStep", "TestRailCustomUI.Cases.cloneStep"));
                var $cloneButtonDiv = $("<div class='clone' />");
                $cloneButtonDiv.append($cloneButton);
                $cloneButtonDiv.insertAfter($stepButtons.find("div>div:first"));
            }
        });
    };

    TestRailCustomUI.Cases.addCloneButtons();
    $(document).change(TestRailCustomUI.Cases.addCloneButtons);
});