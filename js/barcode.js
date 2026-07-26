export async function decodeBarcode(canvas,debug){

    if(!window.ZXing){
        debug(
            "Barcode",
            "ZXing not loaded"
        );
        return null;
    }

    try{

        const codeReader=new ZXing.BrowserMultiFormatReader();

        debug(
            "Barcode",
            "Decode start"
        );

        const result=await codeReader.decodeFromImage(canvas);

        const text=result.getText();

        debug(
            "Barcode",
            text
        );

        return text;

    }catch(error){

        debug(
            "Barcode",
            "No result"
        );

        return null;
    }
}