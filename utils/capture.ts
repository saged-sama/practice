export function capturePhoto(videoElement: HTMLVideoElement | null) {
    if (videoElement) {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d')?.drawImage(videoElement, 0, 0);
        return canvas.toBlob(blob => {
            return blob;
        });
    }
}