document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const productId = button.getAttribute("data-product-id");
            const imagePath = button.getAttribute("data-image-path");

            // Confirm deletion with SweetAlert
            const confirmDelete = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to recover this image!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!"
            });

            if (!confirmDelete.isConfirmed) return; // If user cancels, do nothing
            try{
                const response = await fetch('/admin/products/deleteImage', {
                    method: 'DELETE',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId, imagePath })
                });
        
                const result = await response.json();
                if (result.success) {
                    // Success message
                    Swal.fire({
                        title: "Deleted!",
                        text: "The image has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    const imageContainer = button.closest(".image-container");
                    imageContainer.remove();
        
                    const updatedImages = result.product.images;
                    updateImageInputs(updatedImages);
                } else {
                    // Error message
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete image: " + result.message,
                        icon: "error"
                    });
                }
            }catch(error){
                console.error("Error deleting image:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Something went wrong while deleting the image.",
                    icon: "error"
                });
            }

        });
    });
})  

// update the hidden input that detect the existing images
function updateImageInputs(imageArray) {
    document.getElementById("imageInputs").innerHTML = ""; // Clear existing inputs
    imageArray.forEach(img => {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "existingImages[]";
        input.value = img;
        document.getElementById("imageInputs").appendChild(input);
    });
}
