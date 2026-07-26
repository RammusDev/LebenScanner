import {startCamera,getVideo} from "./camera.js";
import {cropROI} from "./roi.js";
import {setStatus} from "./ui.js";
import {debug,initDebug} from "./debug.js";
import {decodeBarcode} from "./barcode.js";
import {DOM} from "./dom.js";
import {decodeMHD} from "./ocr.js";
import {initPaddle} from "./paddle.js";

let currentBarcode = null;

initDebug();
initPaddle(debug);
const startBtn=DOM.startBtn;
const captureBtn=DOM.captureBtn;
const roiElement=DOM.roi;
const snapshot=DOM.snapshot;

debug(
    "Elements",
    `start:${!!startBtn} capture:${!!captureBtn} roi:${!!roiElement} canvas:${!!snapshot}`
);

startBtn.onclick=async()=>{
    try{
        await startCamera();

        setStatus("相機已開啟");

        const video=getVideo();

        debug("Camera","Started");
        debug("Video",`${video.videoWidth} x ${video.videoHeight}`);

    }catch(error){
        debug("Camera Error",error.message);
        setStatus("相機開啟失敗");
    }
};

captureBtn.onclick=async()=>{
  //  alert("1");
    const video=getVideo();
  //  alert("2");
    debug("Capture","Clicked");
  //  alert("3");
    debug(
        "Video",
        `${video.videoWidth} x ${video.videoHeight}`
    );
    //alert("4");
    cropROI(
        video,
        roiElement,
        snapshot,
        debug
    );
 //alert("5");
    snapshot.style.display="block";
    setStatus("ROI裁切完成");
    debug("ROI","Captured");

 //alert("6");
    currentBarcode = await(decodeBarcode(snapshot,debug));
 //alert("7");
    await decodeMHD(snapshot,debug);

};