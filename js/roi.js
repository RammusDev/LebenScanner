export function cropROI(video, roiElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const videoRect = video.getBoundingClientRect();
    const roiRect = roiElement.getBoundingClientRect();

    const scaleX = videoWidth / videoRect.width;
    const scaleY = videoHeight / videoRect.height;

    const x = (roiRect.left - videoRect.left) * scaleX;
    const y = (roiRect.top - videoRect.top) * scaleY;

    const width = roiRect.width * scaleX;
    const height = roiRect.height * scaleY;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
        video,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height
    );

    return canvas;
}