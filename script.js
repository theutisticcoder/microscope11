document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const sampleImage = document.getElementById('sample-image');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    let currentZoom = 1;
    const zoomStep = 0.2;
    const maxZoom = 5;
    const minZoom = 1;

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                sampleImage.src = e.target.result;
                sampleImage.style.display = 'block';
                currentZoom = 1;
                sampleImage.style.transform = 'scale(1)';
                zoomInButton.disabled = false;
                zoomOutButton.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    zoomInButton.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            sampleImage.style.transform = `scale(${currentZoom})`;
        }
    });

    zoomOutButton.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            sampleImage.style.transform = `scale(${currentZoom})`;
        }
    });
});