document.addEventListener("DOMContentLoaded", () => { 
    // order Pages with JQuery
    $(document).ready(function () {
        $("tbody").sortable({
            items: "tr:not('.home')",
            placeholder: "ui-state-highlight",
            helper: function (e, ui) {
                ui.children().each(function () {
                    $(this).width($(this).width());
                });
                return ui;
            },
            start: function (event, ui) {
                ui.item.addClass("ui-sortable-helper");
            },
            stop: function (event, ui) {
                ui.item.removeClass("ui-sortable-helper");
            },
            update: function () {
                const ids = $("tbody").sortable("serialize");
                const url = "/admin/pages/reorderPages";

                $.post(url, ids, function(response) {
                    console.log("Order updated:", response);
                }).fail(function() {
                    alert("Failed to save new order.");
                });
            }
        }).disableSelection();
    });

});
  


  