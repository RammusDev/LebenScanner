import {setWorkingCanvas} from "./canvas.js";

export function cropROI(video,roiElement,canvas,debug){

    const ctx=canvas.getContext("2d");

    const videoRect=video.getBoundingClientRect();
    const roiRect=roiElement.getBoundingClientRect();

    const scaleX=video.videoWidth/videoRect.width;
    const scaleY=video.videoHeight/videoRect.height;

    const x=(roiRect.left-videoRect.left)*scaleX;
    const y=(roiRect.top-videoRect.top)*scaleY;

    const width=roiRect.width*scaleX;
    const height=roiRect.height*scaleY;

    debug(
        "ROI",
        `${Math.round(x)},${Math.round(y)} ${Math.round(width)} x ${Math.round(height)}`
    );

    const outputWidth=800;
    const outputHeight=Math.round(
        height/width*outputWidth
    );

    canvas.width=outputWidth;
    canvas.height=outputHeight;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        video,
        x,
        y,
        width,
        height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    setWorkingCanvas(canvas);

    debug(
        "Canvas",
        `${canvas.width} x ${canvas.height}`
    );
}