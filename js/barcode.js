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

        const image=new Image();

        image.src=canvas.toDataURL();

        await new Promise(resolve=>{
            image.onload=resolve;
        });

        const result=await reader.decodeFromImageElement(image);

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