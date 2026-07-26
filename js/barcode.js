let codeReader=null;
let scanning=false;
let timer=null;

export function startBarcodeScanner(video,debug){

    if(!window.ZXing){
        debug("Barcode","ZXing not loaded");
        return;
    }

    if(scanning)return;

    scanning=true;

    codeReader=new ZXing.BrowserMultiFormatReader();

    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");

    debug("Barcode","Scanner Ready");

    function scan(){

        if(!scanning)return;

        if(video.videoWidth===0){
            timer=requestAnimationFrame(scan);
            return;
        }

        canvas.width=video.videoWidth;
        canvas.height=video.videoHeight;

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        codeReader.decodeFromCanvas(canvas)
        .then(result=>{

            debug(
                "Barcode",
                result.getText()
            );

            stopBarcodeScanner();

        })
        .catch(()=>{

            timer=requestAnimationFrame(scan);

        });
    }

    scan();
}

export function stopBarcodeScanner(){

    scanning=false;

    if(timer){
        cancelAnimationFrame(timer);
        timer=null;
    }

    codeReader=null;
}