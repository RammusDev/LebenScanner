export function setStatus(message) {
    document.getElementById("status").innerText = message;
}
let toastTimer=null;


export function showToast(text){

    const toast=
        document.getElementById("toast");


    if(!toast){
        return;
    }


    toast.textContent=text;
    toast.style.display="block";


    if(toastTimer){
        clearTimeout(toastTimer);
    }


    toastTimer=setTimeout(()=>{

        toast.style.display="none";

    },2000);

}