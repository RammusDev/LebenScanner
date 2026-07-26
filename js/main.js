import { startCamera, getVideo } from "./camera.js";
import { cropROI } from "./roi.js";
import { setStatus } from "./ui.js";

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");

const roiElement = document.getElementById("roi");
const snapshot = document.getElementById("snapshot");

startBtn.onclick = async () => {
    try {
        await startCamera();
        setStatus("相機已開啟");
        console.log("Camera started");
    } catch (error) {
        console.error(error);
        setStatus("相機開啟失敗");
    }
};

captureBtn.onclick = () => {
    console.log("Capture button clicked");

    const video = getVideo();

    console.log("Video size:", video.videoWidth, video.videoHeight);

    cropROI(
        video,
        roiElement,
        snapshot
    );

    console.log(
        "Canvas size:",
        snapshot.width,
        snapshot.height
    );

    snapshot.style.display = "block";

    setStatus("ROI裁切完成");
};