export async function decodeMHD(canvas,debug){

    debug("OCR","Start");
    const scale=4;
    const processCanvas=document.createElement("canvas");

    processCanvas.width=canvas.width*scale;
    processCanvas.height=canvas.height*scale;

    const ctx=processCanvas.getContext("2d");

    ctx.drawImage(
        canvas,
        0,
        0,
        processCanvas.width,
        processCanvas.height
    );

    const imageData=ctx.getImageData(
        0,
        0,
        processCanvas.width,
        processCanvas.height
    );

    const data=imageData.data;

    for(let i=0;i<data.length;i+=4){

        const gray=
            data[i]*0.299+
            data[i+1]*0.587+
            data[i+2]*0.114;


        // const value =
        //     gray > 160 ? 255 : 0;


        data[i]=gray;
        data[i+1]=gray;
        data[i+2]=gray;
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    debug(
        "OCR Image",
        `${processCanvas.width} x ${processCanvas.height}`
    );

    const result=await Tesseract.recognize(
        processCanvas,
        "eng"
    );

    debug(
        "OCR Text",
        result.data.text
    );

    return result.data.text;
}