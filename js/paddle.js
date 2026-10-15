import { findDate } from "./date.js";
export { findDate } from "./date.js";
let ocr = null;
export async function initPaddle(debug) {
  debug("Paddle", "Loading");
  const { PaddleOCR } = await import("https://cdn.jsdelivr.net/npm/@paddleocr/paddleocr-js@0.4.2/+esm");
  ocr = await PaddleOCR.create({lang: "en",ocrVersion: "PP-OCRv5",ortOptions: { backend: "wasm" }});
  debug("Paddle", "Model Ready");
}
export async function detectText(canvas, debug) {
  if (!ocr) throw new Error("OCR 尚未就緒，請稍後再試或手動輸入。");
  const [result] = await ocr.predict(canvas);
  const items = result?.items || [];
  debug("OCR lines", items.length);
  return findDate(items);
}
