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
export function validateBarcode(code){

    if(!code){
        return false;
    }


    code=String(code).trim();


    // 只接受數字條碼
    if(!/^\d+$/.test(code)){
        return false;
    }


    // 常見商品條碼長度
    const validLengths=[
        8,
        12,
        13,
        14
    ];


    if(!validLengths.includes(code.length)){
        return false;
    }


    return true;

}