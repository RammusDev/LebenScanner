export function cropROI(video, roiElement, canvas) {

    const ctx = canvas.getContext("2d");

    const videoRect = video.getBoundingClientRect();
    const roiRect = roiElement.getBoundingClientRect();

    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;

    const x = (roiRect.left - videoRect.left) * scaleX;
    const y = (roiRect.top - videoRect.top) * scaleY;

    const width = roiRect.width * scaleX;
    const height = roiRect.height * scaleY;


    console.log("ROI position:", {
        x,
        y,
        width,
        height
    });


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