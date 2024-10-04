(async () => {
    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRzVzUVVYfYPsMmI-_4EQk4K185C0dMqX6z65oJdfXq1cMdql0xYH5CFNbim5UjeFk60nJmg1kyII24/pub?output=csv';
    const data = [];

    const fetchData = async () => {
        const response = await fetch(sheetURL);
        const csv = await response.text();
        const rows = csv.split('\n').map(row => row.split(','));

        for (let i = 1; i < rows.length; i++) {
            const day = rows[i][0];
            const minHours = parseInt(rows[i][1]);
            const rates = rows[i].slice(2).map(Number);
            data.push({ day, minHours, rates });
        }
    };

    const calculateCost = () => {
        const startDate = new Date(document.getElementById('start_date').value + 'T' + document.getElementById('start_time').value);
        const endDate = new Date(document.getElementById('end_date').value + 'T' + document.getElementById('end_time').value);
        let totalCost = 0;

        if (startDate >= endDate) {
            document.getElementById('result').innerText = "Ошибка: Время окончания должно быть позже времени начала.";
            return;
        }

        let currentDate = startDate;
        while (currentDate < endDate) {
            const dayName = currentDate.toLocaleString('ru-RU', { weekday: 'long'
