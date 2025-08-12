document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const microscopeStage = document.querySelector('.microscope-stage');
    const sampleImage = document.getElementById('sample-image');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    let currentZoom = 1;
    const zoomStep = 1.0;
    const maxZoom = 20; // Maximum zoom is now 20
    const minZoom = 1;
    
    let isDragging = false;
    let startX;
    let startY;
    let imageX = 0;
    let imageY = 0;

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                sampleImage.src = e.target.result;
                sampleImage.style.display = 'block';
                currentZoom = 1;
                imageX = 0;
                imageY = 0;
                sampleImage.style.transform = `scale(${currentZoom}) translate(${imageX}px, ${imageY}px)`;
                zoomInButton.disabled = false;
                zoomOutButton.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    zoomInButton.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
            sampleImage.style.transform = `scale(${currentZoom}) translate(${imageX}px, ${imageY}px)`;
        }
    });

    zoomOutButton.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom = Math.max(currentZoom - zoomStep, minZoom);
            sampleImage.style.transform = `scale(${currentZoom}) translate(${imageX}px, ${imageY}px)`;
        }
    });
    
    // Mouse down event to start dragging
    microscopeStage.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (currentZoom > 1) { // Only allow dragging when zoomed in
            isDragging = true;
            startX = e.clientX - imageX;
            startY = e.clientY - imageY;
            microscopeStage.classList.add('grabbing');
        }
    });

    // Mouse up event to stop dragging
    microscopeStage.addEventListener('mouseup', (e) => {
        e.preventDefault();
        isDragging = false;
        microscopeStage.classList.remove('grabbing');
    });

    // Mouse move event to handle the actual dragging
    microscopeStage.addEventListener('mousemove', (e) => {
        e.preventDefault();
        if (!isDragging) return;
        e.preventDefault();
        imageX = e.clientX - startX;
        imageY = e.clientY - startY;

        // Boundary checks to prevent dragging the image completely out of view
        const stageWidth = microscopeStage.offsetWidth;
        const stageHeight = microscopeStage.offsetHeight;
        const imageWidth = sampleImage.offsetWidth * currentZoom;
        const imageHeight = sampleImage.offsetHeight * currentZoom;

        const maxImageX = (imageWidth - stageWidth) / (2 * currentZoom);
        const maxImageY = (imageHeight - stageHeight) / (2 * currentZoom);

        imageX = Math.max(Math.min(imageX, maxImageX), -maxImageX);
        imageY = Math.max(Math.min(imageY, maxImageY), -maxImageY);

        sampleImage.style.transform = `scale(${currentZoom}) translate(${imageX}px, ${imageY}px)`;
    });

    // Handle mouse leaving the stage while dragging
    microscopeStage.addEventListener('mouseleave', () => {
        isDragging = false;
        microscopeStage.classList.remove('grabbing');
    });
});