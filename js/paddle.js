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
                backend:"wasm"
            }
        });

        debug("Paddle","Model Ready");

    }catch(error){
        debug("Paddle Error",error.message);
    }

}
export function downscaleCanvas(sourceCanvas, maxSize = 960) {
    const scale = Math.min(maxSize / sourceCanvas.width, maxSize / sourceCanvas.height, 1);
    if (scale === 1) return sourceCanvas;
    
    const small = document.createElement("canvas");
    small.width = sourceCanvas.width * scale;
    small.height = sourceCanvas.height * scale;
    small.getContext("2d").drawImage(sourceCanvas, 0, 0, small.width, small.height);
    return small;
}

export async function detectText(canvas,debug){

    debug("Paddle Canvas",`${canvas.width} x ${canvas.height}`);
    if(!ocr){
        debug("Paddle","Not Ready");
        return null;
    }
    debug("Paddle","Predict Start");

    try{
        const result = await ocr.predict(downscaleCanvas(canvas));

        debug("Paddle","Predict Done");

        if(result && result[0] && result[0].items)
        {
            const items=result[0].items;
            debug("Paddle Boxes",items.length);
            items.forEach((item,index)=>{

                const date = findDate(items,debug);
                if(date){
                    debug("Result",date);
                    alert("Find MHD:"+ date );
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
        const match=text.match(/[0-9OIlZ./-]{6,}/);
        if(!match){
            continue;
        }
        let value=match[0];
         // 只修正日期候選區
        let value = match[0]
            .replace(/O/g,"0")
            .replace(/I/g,"1")
            .replace(/l/g,"1")
            .replace(/Z/g,"2")
            .replace(/[^\d]/g,"");

        if(!/^\d{8}$/.test(value)){
            continue;
        }
        
        let day=value.slice(0,2);
        let month=value.slice(2,4);
        let year=value.slice(4,8);

        let d=parseInt(day);
        let m=parseInt(month);
        let y=parseInt(year);

        // 日期合理性
        if(d<1 ||d>31 ||m<1 ||m>12)
        {
            continue;
        }
        // OCR 常見年份錯誤
        if(y>2030 &&y<2100
        ){
            y=2026;
        }
        const result = String(d).padStart(2,"0")+"."+String(m).padStart(2,"0")+"."+y;
        return result;
        // for(const regex of dateRegex){
        //     const match=text.match(regex);
        //     if(match){
        //         debug("Date Candidate",match[0]);
        //         return match[0];
        //     }
        // }
    }

    //debug("Date Candidate","Not Found");

    return null;
}