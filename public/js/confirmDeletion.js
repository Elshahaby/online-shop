document.addEventListener("DOMContentLoaded", () => { 

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
                    .then(data => data.json())
                    .then(result => {
                        if (result.success) {
                            if(deleteUrl.includes("/admin/pages/deletePage")){
                                Swal.fire("Deleted!", 'Page has been deleted successfully.', "success");
                                this.closest("tr").remove();
                            }else if(deleteUrl.includes("/admin/products/deleteProduct")){
                                Swal.fire("Deleted!", 'Product has been deleted successfully.', "success");
                                this.closest("tr").remove();
                            }else if(deleteUrl.includes("/admin/categories/deleteCategory")){
                                Swal.fire("Deleted!", 'Category has been deleted successfully.', "success");
                                this.closest("tr").remove();
                            }else if(deleteUrl.includes("/cart/clear")){
                                Swal.fire("Deleted!", 'Cart has been Cleared successfully.', "success").then(() => {
                                    location.reload();
                                });
            
                            }
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

})