// preview of uploaded images
document.getElementById("imageInput").addEventListener("change", function (event) {
    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = ""; // Clear previous previews
    const files = event.target.files;

    Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.width = "100px";
        img.style.margin = "5px";
        img.style.borderRadius = "10px";
        previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
    });
});