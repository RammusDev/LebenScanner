const GOOGLE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbwP7Wg9AncUZV3x7mIppccRXZK83yJTj1uUHFsS--44-0AwUQk_fVF0oZpWU7sC-OMVUQ/exec";

export async function sendToGoogleSheet(data,debug){

    try{
        debug(
            "Google Sheet",
            "Sending"
        );
        const response =
            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method:"POST",
                    mode:"no-cors",
                    headers:{
                        "Content-Type":
                            "application/json"
                    },
                    body:JSON.stringify(data)
                }
            );
        debug(
            "Google Sheet",
            "Sent"
        );
        return true;
    }
    catch(error){

        debug(
            "Google Error",
            error.message
        );

        return false;
    }

}