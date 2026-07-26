const debugData={};

export function initDebug(){

    const box=document.getElementById("debug");

    if(box){
        box.innerHTML=
        `${APP_CONFIG.name} ${APP_CONFIG.version}<br><br>`;
    }
}

export function debug(key,value){

    debugData[key]=value;

    const box=document.getElementById("debug");

    if(!box){
        return;
    }

    let html=
    `${APP_CONFIG.name} ${APP_CONFIG.version}<br><br>`;

    Object.keys(debugData).forEach(item=>{
        html+=`${item}: ${debugData[item]}<br>`;
    });

    box.innerHTML=html;
}