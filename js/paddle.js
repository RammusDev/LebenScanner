let paddleLoaded=false;

export async function initPaddle(debug){

    debug(
        "Paddle",
        "Loading"
    );

    // 先確認 Paddle OCR runtime 是否存在
    if(!window.PaddleOCR){

        debug(
            "Paddle",
            "Library not loaded"
        );

        return false;
    }

    paddleLoaded=true;

    debug(
        "Paddle",
        "Ready"
    );

    return true;
}


export async function detectText(canvas,debug){

    if(!paddleLoaded){

        debug(
            "Paddle",
            "Not ready"
        );

        return [];
    }


    debug(
        "Paddle",
        "Detect Start"
    );


    /*
        這裡下一步接 Detection Model

        輸出格式預計：

        [
            {
                box:[
                    [x,y],
                    [x,y],
                    [x,y],
                    [x,y]
                ]
            }
        ]

    */


    debug(
        "Paddle",
        "Detect Done"
    );


    return [];

}