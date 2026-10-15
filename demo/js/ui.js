import {DOM} from "./dom.js";

let toastTimer=null;

export function setStatus(text,type="secondary"){

    DOM.status.className=
        `alert alert-${type} mt-3 mb-3`;

    DOM.status.textContent=text;

}

export function showToast(text,type="success"){

    DOM.toast.textContent=text;

    DOM.toast.classList.remove(
        "toast-success",
        "toast-error"
    );

    DOM.toast.classList.add(
        type==="success"
            ?"toast-success"
            :"toast-error"
    );

    DOM.toast.style.display="block";

    if(toastTimer){
        clearTimeout(toastTimer);
    }

    toastTimer=setTimeout(()=>{

        DOM.toast.style.display="none";

    },2000);

}

export function setLoading(loading){

    DOM.captureBtn.disabled=loading;

    DOM.captureBtn.textContent=
        loading
            ?"掃描中..."
            :"掃描";

}

export function fillBarcode(value){

    DOM.barcodeInput.value=value??"";

}

export function fillMHD(value){

    DOM.mhdInput.value=value??"";

}

export function clearForm(){

    DOM.barcodeInput.value="";
    DOM.artikelInput.value="";
    DOM.mhdInput.value="";
    DOM.qtyInput.value="";

}

export function focusArtikel(){

    DOM.artikelInput.focus();

}