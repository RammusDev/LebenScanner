# LebenScanner

以手機相機掃描商品條碼與有效日期（MHD / Mindesthaltbarkeitsdatum），並將商品資料送至 Google Sheets 的瀏覽器工具。

目前版本：`V0.8.1`（見 `js/config.js`）。

## 功能

- 使用裝置相機，優先選擇後鏡頭。
- 裁切畫面中的辨識區域（ROI）。
- 使用 ZXing 辨識條碼。
- 使用 PaddleOCR 辨識有效日期。
- 手動補充或修正 Artikel、MHD 與數量。
- 透過 Google Apps Script 傳送資料至 Google Sheets。
- 提供 Debug 面板查看模型載入及辨識訊息。

## 使用方式

1. 開啟頁面，允許相機權限，按「開啟相機」。
2. 將條碼放入框內並按「掃描」；條碼欄位為空且未填 Artikel 時，會先辨識條碼。
3. 已有條碼或 Artikel 後，將有效日期放入框內，再按「掃描」辨識 MHD。
4. 檢查並修正商品名稱、日期與數量。
5. 按「送出資料」，並在目標試算表確認資料是否寫入。
6. 按「清除資料」開始下一筆。

OCR 初始化完成後才能辨識日期，可在 Debug 面板查看 `Model Ready`。

## 本機執行

這是原生 HTML、CSS 與 JavaScript 專案，沒有建置步驟。安裝 Python 3 後，在專案根目錄執行：

```sh
python -m http.server 8000
```

開啟 `http://localhost:8000`。相機需要瀏覽器允許的安全來源；手機連線至電腦的普通 HTTP 區網網址通常不符合要求，手機測試請使用 HTTPS 部署。

外部函式庫與 OCR 模型需經網路載入。

## Google Sheets 設定

在 `js/google.js` 將 `GOOGLE_SCRIPT_URL` 改為自己的 Google Apps Script Web App 網址。

接收端需處理 POST JSON，欄位如下：

| 欄位 | 內容 |
| --- | --- |
| time | ISO 格式提交時間 |
| barcode | 條碼字串 |
| artikel | 商品名稱或編號 |
| mhd | 有效日期字串 |
| qty | 數量字串 |

Google Apps Script 接收端程式不包含在此 repo，需要另行建立及部署。單純複製此 repo 不會建立試算表或接收端。

## 程式結構

| 檔案 | 職責 |
| --- | --- |
| index.html / style.css | 操作畫面與樣式 |
| js/main.js | 掃描與提交流程 |
| js/camera.js | 相機存取 |
| js/roi.js / js/canvas.js | 影像裁切與處理 |
| js/barcode.js | 條碼辨識 |
| js/paddle.js | OCR 初始化與日期擷取 |
| js/google.js | 傳送至 Apps Script |
| js/ui.js / js/dom.js | 畫面操作 |
| js/debug.js | Debug 訊息 |
| js/config.js | 顯示名稱與版本 |

## 目前限制

- 日期擷取目前以八位數的日、月、年解析；僅檢查日與月的範圍，未完整驗證曆法日期。
- 程式會將部分 OCR 誤辨識的年份（2031–2099）改為 2026，送出前需人工核對。
- Google Sheets 提交使用 `no-cors`，前端無法讀取接收端的回應；「送出」提示不能證明試算表寫入成功。
- 相機、OCR 與試算表寫入的實際可用性需在目標裝置及部署環境驗證。

## 後續整理方向

- 補充實機操作截圖。
- 改善日期驗證及年份修正規則。
- 加入可確認寫入結果的提交機制。
- 固定外部依賴版本，改善重現性。
