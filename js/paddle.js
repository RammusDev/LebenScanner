let ocr=null;

export async function initPaddle(debug){

    debug("Paddle","Loading");

    try{

        const module=await import("https://cdn.jsdelivr.net/npm/@paddleocr/paddleocr-js/+esm");

        const PaddleOCR=module.PaddleOCR;

        debug("Paddle","Library Loaded");

        ocr=await PaddleOCR.create({
            lang:"en",
            ocrVersion:"PP-OCRv5",
            ortOptions:{
                backend:"auto"
            }
        });

        debug("Paddle","Model Ready");

    }catch(error){
        debug("Paddle Error",error.message);
    }

}

export async function detectText(canvas,debug){

    debug("Paddle Canvas",`${canvas.width} x ${canvas.height}`);
    if(!ocr){
        debug("Paddle","Not Ready");
        return null;
    }
    debug("Paddle","Predict Start");

    try{
        const result = await ocr.predict(canvas);

        debug(
            "Paddle",
            "Predict Done"
        );

        if(result && result[0] && result[0].items)
        {
            const items=result[0].items;
            debug("Paddle Boxes",items.length);
            items.forEach((item,index)=>{

                const date = findDate(items,debug);
                if(date){
                    debug("Result",normalizeDate(date));
                }
                else{
                    debug("Paddle "+index,`${item.text} (${item.score.toFixed(2)})`);
                }
            });
        }
        return result;
    }catch(error){
        debug("Paddle Error",error.message);
        return null;
    }
}

export function findDate(items,debug){

    const dateRegex=[
        /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/,
        /\b\d{4}[./-]\d{1,2}[./-]\d{1,2}\b/,
        /\b\d{1,2}[./-]\d{1,2}\d{4}\b/
    ];
    for(const item of items){
        const text=item.text;
        for(const regex of dateRegex){
            const match=text.match(regex);
            if(match){
                debug("Date Candidate",match[0]);
                return match[0];
            }
        }
    }

    debug("Date Candidate","Not Found");

    return null;
}

function normalizeDate(text){

    let value=text
        .replace(/O/g,"0")
        .replace(/I/g,"1")
        .replace(/l/g,"1")
        .replace(/[^\d]/g,"");
    let day;
    let month;
    let year;
    // DDMMYYYY
    if(value.length===8){

        day=value.substring(0,2);
        month=value.substring(2,4);
        year=value.substring(4,8);

    }
    else{       
        return null;
    }
    year=parseInt(year);
    // OCR 常見年份錯誤
    if(
        year>2030 &&
        year<2100
    ){
        year=2026;
    }
    return (day.padStart(2,"0")+"."+month.padStart(2,"0")+"."+year);
}