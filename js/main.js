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
import {decodeBarcode,validateBarcode} from "./barcode.js";
import {DOM} from "./dom.js";
import {initPaddle, detectText} from "./paddle.js";
import {sendToGoogleSheet} from "./google.js";

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

        const hasBarcode = DOM.barcodeInput.value.trim() !== "";
        const hasArtikel = DOM.artikelInput.value.trim() !== "";
        if(hasBarcode || hasArtikel){
            debug("Scan Mode","MHD Only");
            const result = await detectText(DOM.snapshot,debug);
            if(result){
                fillMHD(result);
                showToast("MHD: "+result,"success");
                //focusArtikel();
            }
            else{
                showToast("MHD Not Found","error");
            }
        }
        else{
            debug("Scan Mode","Barcode First");
            currentBarcode = await decodeBarcode(DOM.snapshot,debug);

            if(validateBarcode(currentBarcode)){

                fillBarcode(currentBarcode);
                showToast("Barcode: "+currentBarcode,"success");
            }
            else
            {
                showToast("Barcode: Not Found","error");
            }
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

DOM.submitBtn.onclick=async()=>{

    const data={
        time: new Date().toISOString(),
        barcode: DOM.barcodeInput.value.trim(),
        artikel: DOM.artikelInput.value.trim(),
        mhd: DOM.mhdInput.value.trim(),
        qty: DOM.qtyInput.value.trim()
    };

    debug("Submit Data",JSON.stringify(data));

    const success =await sendToGoogleSheet(data,debug);

    if(success){
        showToast("資料已送出","success");
    }
    else{
        showToast("送出失敗","error");
    }

};
