let paddleLoaded=false;

export async function initPaddle(debug){

    debug(
        "Paddle",
        "Loading"
    );

    try{

        const module =
            await import(
                "https://cdn.jsdelivr.net/npm/@paddleocr/paddleocr-js/+esm"
            );

        window.PaddleOCR =
            module.PaddleOCR;

        paddleLoaded=true;

        debug(
            "Paddle",
            "Loaded"
        );

        return true;

    }catch(error){

        debug(
            "Paddle Error",
            error.message
        );

        return false;
    }
}