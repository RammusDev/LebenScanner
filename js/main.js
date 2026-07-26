import { startCamera, getVideo } from "./camera.js";
import { cropROI } from "./roi.js";
import { setStatus } from "./ui.js";
import { debug, initDebug } from "./debug.js";
import { startBarcodeScanner } from "./barcode.js";

initDebug();

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");

const roiElement = document.getElementById("roi");
const snapshot = document.getElementById("snapshot");

startBtn.onclick = async () => {
    try {
        await startCamera();

        setStatus("相機已開啟");

        const video = getVideo();

        debug("Camera", "Started");

        debug(
            "Video",
            `${video.videoWidth} x ${video.videoHeight}`
        );

    } catch (error) {
        console.error(error);

        setStatus("相機開啟失敗");

        debug(
            "Camera Error",
            error.message
        );
    }
};

captureBtn.onclick = () => {

    const video = getVideo();

    debug(
        "Capture",
        "Barcode Mode"
    );

    startBarcodeScanner(
        video,
        debug
    );

};