let stream = null;

const video = document.getElementById("camera");
const canvas = document.getElementById("snapshot");

export async function startCamera() {
    stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: {
                ideal: "environment"
            }
        },
        audio: false
    });

    video.srcObject = stream;
}

export function captureImage() {
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas;
}

export function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }
}