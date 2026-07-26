export async function decodeMHD(canvas,debug){

    debug("OCR","Start");

    const result = await Tesseract.recognize(canvas,"eng");

    debug("OCR Text", result.data.text);

    return result.data.text;
}