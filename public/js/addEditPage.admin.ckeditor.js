
// Instead of moving scripts to the footer, 
// you can keep them in the <head> but ensure they execute after the DOM is fully loaded.
// by using document.addEventListener("DOMContentLoaded", () => { // your code });


document.addEventListener("DOMContentLoaded", () => { 

    ClassicEditor.create(document.querySelector('#editor'), {
        
    })
    .then(editor => {
        const root = editor.editing.view.document.getRoot();
        const path = editor.editing.view;

        path.change(writer => {
            writer.setStyle('background-color', '#333', root);
            writer.setStyle('color', '#eee', root);
            writer.setStyle('min-height', '150px', root);
            writer.setStyle('padding', '10px', root);

            // Add focus styles
            writer.setStyle("border", "1px solid #666", root);
            writer.setStyle("transition", "all 0.3s ease-in-out", root);
        });

        editor.editing.view.document.on("focus", () => {
            path.change(writer => {
                writer.setStyle("background-color", "#333", root);
                writer.setStyle("color", "#fff", root);
                writer.setStyle("border-color", "#00d9ff", root);
                writer.setStyle("box-shadow", "0 0 8px rgba(0, 217, 255, 0.4)", root);
            });
        });

        // Listen for blur event on the editor
        editor.editing.view.document.on("blur", () => {
            path.change(writer => {
                writer.setStyle("background-color", "#333", root);
                writer.setStyle("color", "#ffffff", root);
                writer.setStyle("border-color", "#666", root);
                writer.setStyle("box-shadow", "none", root);
            });
        });
        
        // Style the toolbar
        document.querySelector('.ck.ck-toolbar').style.backgroundColor = '#333';
        document.querySelector('.ck.ck-toolbar').style.border = '1px solid #666';

        // Invert icons for better visibility
        document.querySelectorAll('.ck.ck-toolbar .ck-button').forEach(button => {
            button.style.filter = 'invert(1) brightness(1.2)';
        });

        // Hover effect for buttons
        document.querySelectorAll('.ck.ck-toolbar .ck-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#eee';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = 'transparent';
            });
        });

    })
    .catch(error => console.error(error));
 
});
  
  