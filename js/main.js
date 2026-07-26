import {startCamera,getVideo} from "./camera.js";
import {cropROI} from "./roi.js";

import {
    setStatus,
    showToast,
    setLoading,
    fillBarcode,
    fillMHD,
    clearForm,
    focusArtikel
} from "./ui.js";

import {debug,initDebug} from "./debug.js";
import {decodeBarcode} from "./barcode.js";
import {DOM} from "./dom.js";
import {initPaddle, detectText} from "./paddle.js";

let currentBarcode = null;
let paddleBusy=false;

initDebug();
initPaddle(debug);

debug("Elements",`start:${!!DOM.startBtn} capture:${!!DOM.captureBtn} roi:${!!DOM.roi} canvas:${!!DOM.snapshot}`);

DOM.startBtn.onclick=async()=>{

    try{

        await startCamera();
        setStatus("相機已開啟","success");

        DOM.startBtn.style.display="none";
        DOM.captureBtn.style.display="block";

        const video=getVideo();

        debug("Camera","Started");
        debug("Video",`${video.videoWidth} x ${video.videoHeight}`);

    }
    catch(error){
        debug("Camera Error",error.message);
        setStatus("相機開啟失敗","danger");
    }

};

DOM.captureBtn.onclick=async()=>{

    if(paddleBusy){
        debug("Paddle Busy","Skip");
        return;
    }
    paddleBusy=true;
    //setLoading(true);

    try{
        const video=getVideo();

        cropROI(
            video,
            DOM.roi,
            DOM.snapshot,
            debug
        );

        DOM.snapshot.style.display="block";

        setStatus("ROI裁切完成","info");

        const result = await detectText(DOM.snapshot,debug);

        if(result){
            fillMHD(result);
            showToast("MHD: "+result,"success");
            focusArtikel();
        }
        else{
            showToast("MHD Not Found","error");
        }

        currentBarcode = await decodeBarcode(DOM.snapshot,debug);

        if(currentBarcode){
            fillBarcode(currentBarcode);
        }

    }
    finally{
        paddleBusy=false;
        //setLoading(false);
        debug("Paddle Busy","False");
    }
};

DOM.clearBtn.onclick=()=>{
    clearForm();
    showToast("資料已清除","success");
    debug("Clear","Clicked");
};

DOM.submitBtn.onclick=()=>{
    debug("Submit","Clicked");
};