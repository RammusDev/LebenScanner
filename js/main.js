import { startCamera, captureImage } from "./camera.js";
import { setStatus } from "./ui.js";

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");

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
    const image = captureImage();

    console.log("Captured:", image);

    setStatus("照片取得完成");
};