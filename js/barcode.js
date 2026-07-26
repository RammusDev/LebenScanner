let codeReader = null;

export function startBarcodeScanner(video, debug) {

    if (!window.ZXing) {
        debug(
            "Barcode",
            "ZXing not loaded"
        );
        return;
    }

    codeReader = new ZXing.BrowserMultiFormatReader();

    debug(
        "Barcode",
        "Scanner Ready"
    );

    codeReader.decodeFromVideoDevice(
        null,
        video,
        (result, error) => {
            if (result) {

                debug(
                    "Barcode",
                    result.getText()
                );
                stopBarcodeScanner();
            }
        }
    );
}

export function stopBarcodeScanner(){

    if(codeReader){
        codeReader.reset();
    }

}