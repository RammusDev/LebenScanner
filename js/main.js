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
    } catch (error) {
        console.error(error);
        setStatus("相機開啟失敗");
    }
};

captureBtn.onclick = () => {
    const video = getVideo();

    cropROI(
        video,
        roiElement,
        snapshot
    );

    snapshot.style.display = "block";

    setStatus("ROI裁切完成");
};