const Excel = require('exceljs');

async function getIdUsers(path) {
  const workbook = new Excel.Workbook();
  const worksheet = await workbook.csv.readFile(path);
  const idUsers = worksheet.getColumn('A').values;
  const ids = idUsers.map((elm) => elm || '').filter(String);

  return ids;
}

module.exports = { getIdUsers };
