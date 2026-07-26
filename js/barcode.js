let codeReader=null;
let scanning=false;

export function startBarcodeScanner(video,debug){
    if(!window.ZXing){
        debug("Barcode","ZXing not loaded");
        return;
    }

    if(scanning)return;

    scanning=true;
    codeReader=new ZXing.BrowserMultiFormatReader();

    debug("Barcode","Scanner Ready");

    codeReader.decodeFromVideoElement(video)
    .then(result=>{
        debug("Barcode",result.getText());
        stopBarcodeScanner();
    })
    .catch(error=>{
        if(scanning){
            requestAnimationFrame(()=>{
                startBarcodeScanner(video,debug);
            });
        }
    });
}

export function stopBarcodeScanner(){
    scanning=false;

    if(codeReader){
        codeReader.reset();
        codeReader=null;
    }
}