const params = new URLSearchParams(window.location.search);
const dateStr = params.get('date');

const dateTitle = document.getElementById('dateTitle');
const recordsDiv = document.getElementById('records');
const timeInput = document.getElementById('timeInput');
const noteInput = document.getElementById('noteInput');
const addBtn = document.getElementById('addBtn');
const backBtn = document.getElementById('backBtn');
const selectedPoopIcon = document.getElementById('selectedPoopIcon');
const poopOptions = document.getElementById('poopOptions');

const poopIcons = {
  poop1: '../assets/poop1.png',
  poop2: '../assets/poop2.png',
  poop3: '../assets/poop3.png',
  poop4: '../assets/poop4.png',
};

let selectedPoopType = 'poop1'; // 預設選擇的便便類型

dateTitle.textContent = `${dateStr}`;

const poopButtons = document.querySelectorAll('.poop-type-buttons button');

// 預設選擇第一個便便類型
poopButtons[0].classList.add('selected');
selectedPoopType = poopButtons[0].dataset.type;

poopButtons.forEach(button => {
  button.addEventListener('click', () => {
    poopButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedPoopType = button.dataset.type;
  });
});

async function loadRecords() {
  const records = await window.ipcRenderer.invoke('get-records-by-date', dateStr);
  renderRecords(records);
}

function renderRecords(records) {
  recordsDiv.innerHTML = '';
  if (records.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.textContent = '今天還沒有便便ㄛ';
    emptyMsg.className = 'empty-message';
    recordsDiv.appendChild(emptyMsg);
    return;
  }

  const container = document.createElement('div');
  container.className = 'card-container';

  records.forEach((record, i) => {
    const card = document.createElement('div');
    card.className = 'poop-card';

    const delBtn = document.createElement('button');
    delBtn.className = 'card-delete-btn';
    delBtn.textContent = '❌';
    delBtn.onclick = async () => {
      await window.ipcRenderer.invoke('delete-record', { date: dateStr, index: i });
      await loadRecords();
    };

    const time = document.createElement('div');
    time.className = 'card-time';
    time.textContent = record.time;

    const icon = document.createElement('img');
    icon.src = poopIcons[record.type] || 'assets/default.png';
    icon.alt = record.type;
    icon.className = 'record-icon';

    const note = document.createElement('div');
    note.className = 'card-note';
    note.textContent = record.note || '';

    card.appendChild(delBtn);
    card.appendChild(time);
    card.appendChild(icon);
    card.appendChild(note);

    container.appendChild(card);
  });

  recordsDiv.appendChild(container);
}

addBtn.onclick = async () => {
  const time = timeInput.value;
  const type = selectedPoopType;
  const note = noteInput.value;
  if (!time) return alert('請輸入時間');

  await window.ipcRenderer.invoke('save-record', { date: dateStr, time, type, note });
  timeInput.value = '';
  noteInput.value = '';
  await loadRecords();
};

backBtn.onclick = () => {
  window.location.href = 'app.html';
};

loadRecords();