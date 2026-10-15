// Set a CORS-enabled endpoint returning {ok:true} after a confirmed write.
export const SUBMIT_URL = "";
export async function sendToGoogleSheet(data, debug, endpoint = SUBMIT_URL) {
  if (!endpoint)
    throw new Error("尚未設定雲端接收服務，請使用示範模式或匯出 JSON。");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error("接收服務回應失敗，請確認寫入結果後再重試。");
  const result = await response.json();
  if (result.ok !== true) throw new Error("接收服務未確認寫入成功。");
  debug("Google Sheet", "Confirmed");
  return true;
}
