let workingCanvas=null;

export function setWorkingCanvas(canvas){
    workingCanvas=canvas;
}

export function getWorkingCanvas(){
    return workingCanvas;
}

export function createCanvas(width,height){
    const canvas=document.createElement("canvas");

    canvas.width=width;
    canvas.height=height;

    return canvas;
}

export function drawCanvas(source,target){
    const ctx=target.getContext("2d");

    ctx.clearRect(
        0,
        0,
        target.width,
        target.height
    );

    ctx.drawImage(
        source,
        0,
        0,
        target.width,
        target.height
    );
}