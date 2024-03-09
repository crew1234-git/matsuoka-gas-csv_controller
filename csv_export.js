// GETリクエストを処理する関数
const doGet = (e) => {
  // トークンが一致するか確認
  if (e.parameter.token !== UPLOAD_TOKEN) {
    return ContentService.createTextOutput("不正なトークンです。").setMimeType(ContentService.MimeType.TEXT);
  }

  const folder = getOrCreateFolder(UPLOAD_FOLDER_NAME);
  let files = folder.getFiles();
  let fileData = [];

  while (files.hasNext()) {
    let file = files.next();
    let csvContent = file.getBlob().getDataAsString();
    fileData.push({name: file.getName(), content: csvContent});
    file.setTrashed(true); // ファイルをゴミ箱に移動
  }

  // CSVデータをJSON形式で返す
  return ContentService.createTextOutput(JSON.stringify(fileData)).setMimeType(ContentService.MimeType.JSON);
};