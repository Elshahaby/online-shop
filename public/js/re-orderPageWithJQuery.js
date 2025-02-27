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



    // confirm Deletion using SweetAlert

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const deleteUrl = this.getAttribute("href");

            Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(deleteUrl, { method: "DELETE" })
                    .then(data => {
                        console.log("The Data: ",data);
                        if (data.ok) {
                            Swal.fire("Deleted!", 'Page has been deleted successfully.', "success");
                            this.closest("tr").remove();
                        } else {
                            Swal.fire("Error!", "Deletion Error Detected", "error");
                        }
                    })
                    .catch(error => {
                        console.error('Detected Error !! : ', error);
                        Swal.fire("Error!", "Something went wrong.", "error");
                    });
                }
            });
        });
    });

});
  


  