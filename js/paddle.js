let ocr=null;

export async function initPaddle(debug){

    debug(
        "Paddle",
        "Loading"
    );

    try{

        const module=
            await import(
                "https://cdn.jsdelivr.net/npm/@paddleocr/paddleocr-js/+esm"
            );


        const PaddleOCR=
            module.PaddleOCR;


        debug(
            "Paddle",
            "Library Loaded"
        );


        ocr=await PaddleOCR.create({
            lang:"en",
            ocrVersion:"PP-OCRv5",
            ortOptions:{
                backend:"auto"
            }
        });


        debug(
            "Paddle",
            "Model Ready"
        );


    }catch(error){

        debug(
            "Paddle Error",
            error.message
        );

    }

}


function drawBoxes(canvas,items){

    const ctx=
        canvas.getContext("2d");


    ctx.lineWidth=2;
    ctx.strokeStyle="red";


    items.forEach(item=>{

        const p=item.poly;


        ctx.beginPath();

        ctx.moveTo(
            p[0][0],
            p[0][1]
        );


        for(let i=1;i<p.length;i++){

            ctx.lineTo(
                p[i][0],
                p[i][1]
            );

        }


        ctx.closePath();

        ctx.stroke();

    });

}

export async function detectText(canvas,debug){

    if(!ocr){

        debug(
            "Paddle",
            "Not Ready"
        );

        return null;
    }


    debug(
        "Paddle",
        "Predict Start"
    );


    const result=
        await ocr.predict(
            canvas
        );


    debug(
        "Paddle",
        "Predict Done"
    );


    if(
        result &&
        result[0] &&
        result[0].items
    ){

        const items=result[0].items;


        debug(
            "Paddle Boxes",
            items.length
        );


        items.forEach((item,index)=>{

            debug(
                "Paddle "+index,
                `${item.text} (${item.score.toFixed(2)})`
            );


            if(item.poly){

                debug(
                    "Box "+index,
                    JSON.stringify(item.poly)
                );

            }

        });


        drawBoxes(
            canvas,
            items
        );

    }
    return result;
}