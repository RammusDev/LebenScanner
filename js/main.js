import { startCamera, getVideo } from "./camera.js";
import { cropROI } from "./roi.js";
import { setStatus } from "./ui.js";

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");
const roiElement = document.getElementById("roi");

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

    const roiImage = cropROI(
        video,
        roiElement
    );

    console.log(
        "ROI Image:",
        roiImage
    );

    setStatus("ROI裁切完成");

    roiImage.style.display = "block";
};