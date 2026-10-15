import { startCamera, getVideo, stopCamera } from "./camera.js";
import { cropROI } from "./roi.js";
import { decodeBarcode, validateBarcode } from "./barcode.js";
import { parseDate } from "./date.js";
import { sendToGoogleSheet } from "./google.js";
const $ = (id) => document.getElementById(id);
const records = [];
let busy = false,
  ocrPromise,
  barcodePromise;
const debug = (key, value) => {
  $("debug").textContent = (
    key +
    ": " +
    value +
    "\n" +
    $("debug").textContent
  ).slice(0, 6000);
};
const status = (text, type = "info") => {
  $("status").textContent = text;
  $("status").dataset.type = type;
};
function clear() {
  for (const id of ["barcodeInput", "artikelInput", "mhdInput"])
    $(id).value = "";
  $("qtyInput").value = 1;
}
function initOCR() {
  return (ocrPromise ??= import("./paddle.js")
    .then(async (m) => {
      await m.initPaddle(debug);
      $("ocrStatus").textContent = "OCR 就緒";
      return m;
    })
    .catch((e) => {
      ocrPromise = null;
      $("ocrStatus").textContent = "OCR 載入失敗，可手動輸入";
      throw e;
    }));
}
function initBarcode() {
  return (barcodePromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/@zxing/browser@0.1.5/umd/zxing-browser.min.js";
    s.onload = resolve;
    s.onerror = () => {
      barcodePromise = null;
      reject(new Error("條碼函式庫載入失敗，請檢查網路。"));
    };
    document.head.append(s);
  }));
}
$("demoBtn").onclick = () => {
  $("barcodeInput").value = "4006381333931";
  $("artikelInput").value = "Bio Haferdrink · 示範商品";
  $("mhdInput").value = "15.12.2027";
  $("qtyInput").value = 1;
  status("已填入示範資料，請確認後儲存。");
};
$("demoMode").onchange = () => {
  stopCamera();
  $("captureBtn").hidden = true;
  $("startBtn").hidden = false;
  $("cameraPlaceholder").hidden = false;
  $("roi").style.display = "none";
  $("demoBtn").hidden = !$("demoMode").checked;
  $("submitBtn").textContent = $("demoMode").checked
    ? "儲存示範紀錄"
    : "提交至雲端";
  $("modeHint").textContent = $("demoMode").checked
    ? "無需相機或帳號；資料只保存在此頁面記憶體。"
    : "實機模式：開啟相機掃描；雲端提交需先設定接收服務。";
  clear();
  status("模式已切換，請重新登錄商品。");
};
$("startBtn").onclick = async () => {
  if ($("demoMode").checked) {
    status("目前為示範模式，請按「載入示範商品」；使用相機請先關閉示範模式。");
    return;
  }
  try {
    $("startBtn").disabled = true;
    await startCamera();
    $("startBtn").hidden = true;
    $("captureBtn").hidden = false;
    $("cameraPlaceholder").hidden = true;
    $("roi").style.display = "flex";
    status("相機已開啟。先將條碼放入框內。");
    initOCR().catch((e) => debug("OCR", e.message));
  } catch (e) {
    stopCamera();
    status(
      "無法開啟相機。請確認 HTTPS、相機權限與裝置支援；也可手動輸入。",
      "danger",
    );
    debug("Camera", e.message);
  } finally {
    $("startBtn").disabled = false;
  }
};
$("captureBtn").onclick = async () => {
  if (busy) return;
  busy = true;
  $("captureBtn").disabled = true;
  $("captureBtn").textContent = "辨識中…";
  try {
    const video = getVideo();
    if (!video.videoWidth) throw new Error("相機尚未就緒，請稍後再試。");
    cropROI(video, $("roi"), $("snapshot"), debug);
    $("snapshot").hidden = false;
    if ($("barcodeInput").value.trim() || $("artikelInput").value.trim()) {
      status("正在載入 OCR 並辨識日期…");
      const m = await initOCR();
      const date = await m.detectText($("snapshot"), debug);
      if (!date)
        throw new Error("未辨識到完整日期，請調整光線或手動輸入四位數年份。");
      $("mhdInput").value = date;
      status("已辨識效期，請與包裝核對後儲存。");
    } else {
      await initBarcode();
      const code = await decodeBarcode($("snapshot"), debug);
      if (!validateBarcode(code))
        throw new Error("未辨識到商品條碼，請調整距離或手動輸入。");
      $("barcodeInput").value = code;
      status("條碼已填入。下一步：掃描有效日期。");
    }
  } catch (e) {
    status(e.message, "danger");
  } finally {
    busy = false;
    $("captureBtn").disabled = false;
    $("captureBtn").textContent = "掃描";
  }
};
$("clearBtn").onclick = () => {
  clear();
  status("已清除欄位，可登錄下一件商品。");
};
$("entryForm").onsubmit = async (e) => {
  e.preventDefault();
  if (busy) return;
  const data = {
    time: new Date().toISOString(),
    barcode: $("barcodeInput").value.trim(),
    artikel: $("artikelInput").value.trim(),
    mhd: parseDate($("mhdInput").value),
    qty: Number($("qtyInput").value),
    mode: $("demoMode").checked ? "demo" : "live",
  };
  if (!data.barcode && !data.artikel)
    return status("請填寫商品條碼或名稱。", "danger");
  if (data.barcode && !validateBarcode(data.barcode))
    return status("條碼需為 8、12、13 或 14 位數字。", "danger");
  if (!data.mhd)
    return status(
      "請輸入有效日期，例如 29.02.2028；年份需為四位數。",
      "danger",
    );
  if (!Number.isSafeInteger(data.qty) || data.qty < 1)
    return status("數量需為正整數。", "danger");
  busy = true;
  $("submitBtn").disabled = true;
  try {
    if (data.mode === "live") await sendToGoogleSheet(data, debug);
    records.push(data);
    const li = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = data.artikel || data.barcode;
    const info = document.createElement("span");
    info.textContent =
      data.mhd +
      " · " +
      data.qty +
      " 件 · " +
      (data.mode === "demo" ? "示範" : "雲端已確認");
    li.append(name, info);
    $("records").prepend(li);
    $("recordCount").textContent = records.length;
    $("emptyRecords").hidden = true;
    $("exportBtn").disabled = false;
    status(
      data.mode === "demo"
        ? "示範紀錄已加入。本次資料僅存在頁面中，可匯出 JSON。"
        : "接收服務已確認寫入成功。",
    );
    clear();
  } catch (e) {
    status(e.message, "danger");
  } finally {
    busy = false;
    $("submitBtn").disabled = false;
  }
};
$("exportBtn").onclick = () => {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(records, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "lebenscanner-records.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
window.addEventListener("pagehide", stopCamera);
