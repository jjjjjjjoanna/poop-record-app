const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentDate = new Date();
let poopData = {};

async function loadPoopData(year, month) {
  poopData = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    poopData[dateStr] = await window.ipcRenderer.invoke("get-records-by-date", dateStr);
  }
}

function formatDate(year, month, day) {
  const mm = (month + 1).toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

async function generateCalendar(year, month) {
  await loadPoopData(year, month);
  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${year} 年 ${month + 1} 月`;

  // 空白天數填充
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'calendar-day inactive';
    calendar.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    dayDiv.textContent = day;

    const dateStr = formatDate(year, month, day);

    if (poopData[dateStr] && poopData[dateStr].length > 0) {
          const icon = document.createElement('span');
          icon.className = 'poop-icon';
          icon.textContent = '💩';
          dayDiv.appendChild(icon);
        }

        dayDiv.addEventListener('click', () => {
          window.ipcRenderer.invoke('open-details-window', dateStr);
          // ipcRenderer.invoke('open-details-window', dateStr);
        });


    calendar.appendChild(dayDiv);
  }
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

generateCalendar(currentDate.getFullYear(), currentDate.getMonth());