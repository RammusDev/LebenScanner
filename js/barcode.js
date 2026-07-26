export async function decodeBarcode(canvas,debug){

    if(!window.ZXingBrowser){
        debug(
            "Barcode",
            "ZXingBrowser not loaded"
        );
        return null;
    }

    try{

        const reader=new ZXingBrowser.BrowserMultiFormatReader();

        debug(
            "Barcode",
            "Decode start"
        );

        const result=await reader.decodeFromCanvas(canvas);

        const text=result.getText();

        debug(
            "Barcode",
            text
        );

        return text;

    }catch(error){

        debug(
            "Barcode",
            error.message
        );

        return null;
    }
}