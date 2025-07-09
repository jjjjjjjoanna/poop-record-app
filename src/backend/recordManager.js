const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'poop-record.json');

function loadAll() {
  if (!fs.existsSync(dataFile)) return {};
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function saveRecord(date, time, type, note) {
  const data = loadAll();
  if (!data[date]) data[date] = [];
  data[date].push({ time, type, note });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function getRecordsByDate(date) {
  const data = loadAll();
  return data[date] || [];
}

function deleteRecord(date, index){
  const data = loadAll();
  if (data[date]) {
    data[date].splice(index, 1);
    if (data[date].length === 0) {
      delete data[date];
    }
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
}

module.exports = {
  saveRecord,
  getRecordsByDate,
  loadAll,
  deleteRecord
};
