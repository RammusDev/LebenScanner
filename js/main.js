import { startCamera, getVideo } from "./camera.js";
import { cropROI } from "./roi.js";
import { setStatus } from "./ui.js";
import { debug } from "./debug.js";

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");

const roiElement = document.getElementById("roi");
const snapshot = document.getElementById("snapshot");

startBtn.onclick = async () => {
    try {
        await startCamera();

        setStatus("相機已開啟");
        debug("Camera started");

        const video = getVideo();

        debug(
            "Video: " +
            video.videoWidth +
            " x " +
            video.videoHeight
        );

    } catch (error) {
        debug("Camera error");
        debug(error.message);
    }
};

captureBtn.onclick = () => {

    debug("Capture clicked");

    const video = getVideo();

    debug(
        "Video size: " +
        video.videoWidth +
        " x " +
        video.videoHeight
    );

    cropROI(
        video,
        roiElement,
        snapshot,
        debug
    );

    snapshot.style.display = "block";

    setStatus("ROI裁切完成");
};