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


    try{

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

            });

        }


        return result;


    }catch(error){

        debug(
            "Paddle Error",
            error.message
        );

        return null;
    }

}