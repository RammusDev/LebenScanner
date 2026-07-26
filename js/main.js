import {startCamera,getVideo} from "./camera.js";
import {cropROI} from "./roi.js";
import {setStatus,showToast} from "./ui.js";
import {debug,initDebug} from "./debug.js";
import {decodeBarcode} from "./barcode.js";
import {DOM} from "./dom.js";
import {initPaddle, detectText } from "./paddle.js";

let currentBarcode = null;
let paddleBusy=false;

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

    if(paddleBusy){
        debug("Paddle Busy","Skip");
        return;
    }

    paddleBusy=true;

    try{
        const video=getVideo();
        cropROI(
            video,
            roiElement,
            snapshot,
            debug
        );

        snapshot.style.display="block";
        setStatus("ROI裁切完成");
        const result=await detectText(snapshot,debug);
        if(result){
            showToast("MHD: "+result);
        }
        else{
            showToast("MHD Not Found");
        }
        currentBarcode =await decodeBarcode(snapshot,debug);
    }
    finally{
        paddleBusy=false;
        debug("Paddle Busy","False");
    }
};