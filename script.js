document.addEventListener('DOMContentLoaded', () => {
    const sampleImage = document.getElementById('sample-image');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');

    let currentZoom = 1;
    const zoomStep = 0.2;
    const maxZoom = 5;
    const minZoom = 1;

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
