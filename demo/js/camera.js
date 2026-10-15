let stream=null;

const video=document.getElementById("camera");

export async function startCamera(){

    stream=await navigator.mediaDevices.getUserMedia({
        video:{
            facingMode:{
                ideal:"environment"
            }
        },
        audio:false
    });

    video.srcObject=stream;

    await video.play();
}

export function getVideo(){
    return video;
}

export function stopCamera(){

    if(stream){
        stream.getTracks().forEach(track=>{
            track.stop();
        });

        stream=null;
    }
}