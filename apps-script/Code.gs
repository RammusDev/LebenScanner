// Set SPREADSHEET_ID in Apps Script > Project settings > Script properties.
// Deploy as Web app: execute as yourself. Choose access appropriate for your use.
// Public deployments accept writes from anyone with the URL; use a dedicated demo sheet.
function doPost(e) {
  var lock=LockService.getScriptLock();
  try {
    var data=JSON.parse(e.postData.contents);
    if ((!data.barcode && !data.artikel) || !Number.isInteger(data.qty) || data.qty<1 || !/^\d{2}\.\d{2}\.\d{4}$/.test(data.mhd)) throw new Error('Invalid record');
    var parts=data.mhd.split('.').map(Number);
    var date=new Date(Date.UTC(parts[2],parts[1]-1,parts[0]));
    if(date.getUTCFullYear()!==parts[2] || date.getUTCMonth()!==parts[1]-1 || date.getUTCDate()!==parts[0])throw new Error('Invalid date');
    lock.waitLock(10000);
    var sheet=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')).getSheets()[0];
    function cell(value){var text=String(value||'');return /^[=+@\-]/.test(text)?"'"+text:text;}
    sheet.appendRow([new Date().toISOString(),cell(data.barcode),cell(data.artikel),cell(data.mhd),data.qty]);
    SpreadsheetApp.flush();
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:'Write not confirmed'})).setMimeType(ContentService.MimeType.JSON);
  } finally {if(lock.hasLock())lock.releaseLock();}
}
