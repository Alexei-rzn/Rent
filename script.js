const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRzVzUVVYfYPsMmI-_4EQk4K185C0dMqX6z65oJdfXq1cMdql0xYH5CFNbim5UjeFk60nJmg1kyII24/pub?output=csv';

const data = [];

async function fetchData() {
    const response = await fetch(sheetURL);
    const csv = await response.text();
    const rows = csv.split('\n').map(row => row.split(','));
    
    for (let i = 1; i < rows.length; i++) {
        const day = rows[i][0];
        const minHours = parseInt(rows[i][1]);
        const rates = rows[i].slice(2).map(Number);
        data.push({ day, minHours, rates });
    }
}

function calculateCost() {
    const startDate = new Date(document.getElementById('start_date').value + 'T' + document.getElementById('start_time').value);
    const endDate = new Date(document.getElementById('end_date').value + 'T' + document.getElementById('end_time').value);
    let totalCost = 0;

    if (startDate >= endDate) {
        document.getElementById('result').innerText = "Ошибка: Время окончания должно быть позже времени начала.";
        return;
    }

    // Рассчитываем общую длительность аренды в часах
    const totalDuration = (endDate - startDate) / (1000 * 60 * 60); // Разница в часах

    // Определяем день начала аренды
    const startDayName = startDate.toLocaleString('ru-RU', { weekday: 'long' });
    const dayData = data.find(d => d.day === startDayName);

    if (dayData) {
        const minHours = dayData.minHours;

        // Проверка выполнения минимального заказа по дням
        if (totalDuration < minHours) {
            document.getElementById('result').innerText = `Минимальный заказ: ${minHours} часов не выполнен.`;
            return;
        }

        // Проходим по часам с разбивкой по дням для расчета стоимости
        let currentDate = new Date(startDate);
        while (currentDate < endDate) {
            const currentDayName = currentDate.toLocaleString('ru-RU', { weekday: 'long' });
            const currentDayData = data.find(d => d.day === currentDayName);

            if (currentDayData) {
                const startHour = (currentDate.getDate() === startDate.getDate()) ? startDate.getHours() : 0;
                const endHour = (currentDate.getDate() === endDate.getDate()) ? endDate.getHours() : 24;

                for (let hour = startHour; hour < endHour; hour++) {
                    totalCost += currentDayData.rates[hour] || 0;
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(0);
        }

        document.getElementById('result').innerText = `Стоимость аренды: ${totalCost} руб.`;
    } else {
        document.getElementById('result').innerText = "Ошибка: Невозможно определить минимальные часы для данного дня.";
    }
}

// Fetch data on page load
fetchData();
