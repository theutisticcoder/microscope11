document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const toggleCameraButton = document.getElementById('toggle-camera');
    const microscopeStage = document.querySelector('.microscope-stage');
    const sampleImage = document.getElementById('sample-image');
    const liveCamera = document.getElementById('live-camera');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    let activeElement = sampleImage; // Tracks which element is currently visible
    let cameraStream = null;

    let currentZoom = 1;
    const zoomStep = 1;
    const maxZoom = 50;
    const minZoom = 1;
    
    let isDragging = false;
    let startX;
    let startY;
    let imageX = 0;
    let imageY = 0;

    // Function to reset the view and controls
    function resetView() {
        currentZoom = 1;
        imageX = 0;
        imageY = 0;
        activeElement.style.transform = `scale(1)`;
        zoomInButton.disabled = false;
        zoomOutButton.disabled = false;
    }

    // Function to start the camera stream
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, video: {facingMode: 'environment'} });
            liveCamera.srcObject = stream;
            cameraStream = stream;
            liveCamera.style.display = 'block';
            sampleImage.style.display = 'none';
            activeElement = liveCamera;
            liveCamera.play();
            resetView();
        } catch (err) {
            console.error("Error accessing the camera: ", err);
            alert("Could not access the camera. Please check your permissions.");
        }
    }

    // Function to stop the camera stream
    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            liveCamera.style.display = 'none';
        }
    }

    // Toggle button event listener
    toggleCameraButton.addEventListener('click', () => {
        if (activeElement === sampleImage) {
            // Switch to camera
            imageUpload.style.display = 'none';
            stopCamera(); // Ensure old stream is stopped
            startCamera();
        } else {
            // Switch back to file upload
            stopCamera();
            sampleImage.style.display = 'block';
            liveCamera.style.display = 'none';
            activeElement = sampleImage;
            imageUpload.style.display = 'block';
            resetView();
        }
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            stopCamera(); // Stop camera if an image is selected
            liveCamera.style.display = 'none';
            sampleImage.style.display = 'block';
            activeElement = sampleImage;
            const reader = new FileReader();
            reader.onload = (e) => {
                sampleImage.src = e.target.result;
                resetView();
            };
            reader.readAsDataURL(file);
        }
    });

    zoomInButton.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
            activeElement.style.transform = `scale(${currentZoom}) translate(${imageX}px, ${imageY}px)`;
        }
    });

    zoomOutButton.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom = Math.max(currentZoom - zoomStep, minZoom);
            activeElement.style.transform = `scale(${currentZoom}) translate(${imageX}px, ${imageY}px)`;
        }
    });
    
    // Mouse down event to start dragging
    microscopeStage.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - imageX;
            startY = e.clientY - imageY;
            microscopeStage.classList.add('grabbing');
        }
    });

    // Mouse up event to stop dragging
    microscopeStage.addEventListener('mouseup', () => {
        isDragging = false;
        microscopeStage.classList.remove('grabbing');
    });

    // Mouse move event to handle the actual dragging
    microscopeStage.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        imageX = e.clientX - startX;
        imageY = e.clientY - startY;

        const stageWidth = microscopeStage.offsetWidth;
        const stageHeight = microscopeStage.offsetHeight;
        const imageWidth = activeElement.offsetWidth * currentZoom;
        const imageHeight = activeElement.offsetHeight * currentZoom;

        const maxImageX = (imageWidth - stageWidth) / (2 * currentZoom);
        const maxImageY = (imageHeight - stageHeight) / (2 * currentZoom);

        imageX = Math.max(Math.min(imageX, maxImageX), -maxImageX);
        imageY = Math.max(Math.min(imageY, maxImageY), -maxImageY);

        activeElement.style.transform = `scale(${currentZoom}) translate(${imageX}px, ${imageY}px)`;
    });

    // Handle mouse leaving the stage while dragging
    microscopeStage.addEventListener('mouseleave', () => {
        isDragging = false;
        microscopeStage.classList.remove('grabbing');
    });
});