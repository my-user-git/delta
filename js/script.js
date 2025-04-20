const weekDay = {
    revenue: 480521,
    cash: 300000,
    cardless: 100000,
    cards: 100000,
    averageCheck: 900,
    averageGuest: 800,
    deletionsAfter: 900,
    deletionsBefore: 900,
    checks: 34,
    guests: 32
};

class Data {
    constructor() {
        this.revenue = this.getRandomFloat(400000, 501000);
        this.cash = this.getCash(this.revenue);
        this.cardless = this.getCardless(this.revenue, this.cash);
        this.cards = this.revenue - this.cash - this.cardless;
        this.deletionsAfter = this.getRandomFloat(750, 1250);
        this.deletionsBefore = this.getRandomFloat(750, 1250);
        this.guests = this.getRandomInt(29, 33);
        this.checks = this.getChecks(this.guests);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getCash(revenue) {
        return this.getRandomInt(0.5 * revenue, 0.55 * revenue);
    }

    getCardless(revenue, cash) {
        return this.getRandomInt(0.45 * (revenue - cash), 0.5 * (revenue - cash));
    }

    getChecks(guests) {
        return Math.ceil(guests + this.getRandomInt(1, 3));
    }

    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    calculateYesterday(currentData) {
        let yesterdayData = new Data();
        yesterdayData.revenue = currentData.revenue * this.getRandomFloat(0.97, 1.05);
        yesterdayData.revenuePercentage = this.getPercentage(currentData.revenue, yesterdayData.revenue);

        yesterdayData.cash = this.getCash(yesterdayData.revenue);
        yesterdayData.cashPercentage = this.getPercentage(currentData.cash, yesterdayData.cash);

        yesterdayData.cardless = this.getCardless(yesterdayData.revenue, yesterdayData.cash);
        yesterdayData.cardlessPercentage = this.getPercentage(currentData.cardless, yesterdayData.cardless);

        yesterdayData.cards = yesterdayData.revenue - yesterdayData.cash - yesterdayData.cardless;
        yesterdayData.cardsPercentage = this.getPercentage(currentData.cards, yesterdayData.cards);

        yesterdayData.averageCheck = (yesterdayData.revenue - yesterdayData.deletionsAfter) / yesterdayData.checks;
        yesterdayData.averageCheckPercentage = this.getPercentage(currentData.averageCheck, yesterdayData.averageCheck);

        yesterdayData.averageGuest = (yesterdayData.revenue - yesterdayData.deletionsBefore) / yesterdayData.guests;
        yesterdayData.averageGuestPercentage = this.getPercentage(currentData.averageGuest, yesterdayData.averageGuest);

        yesterdayData.deletionsAfter = this.getRandomFloat(750, 1250);
        yesterdayData.deletionsAfterPercentage = this.getPercentage(currentData.deletionsAfter, yesterdayData.deletionsAfter);

        return yesterdayData;
    }

    getPercentage(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2);
    }
}

// Создаем данные
const todayData = new Data();
const yesterdayData = todayData.calculateYesterday(todayData);

// Функция для вывода данных в таблицу
function displayData() {
    const tableContainer = document.getElementById('table-container');

    const indicators = [
        { name: 'Выручка, руб', current: Math.round(todayData.revenue), yesterday: Math.round(yesterdayData.revenue), week: Math.round(weekDay.revenue) },
        { name: 'Наличные, руб.', current: Math.round(todayData.cash), yesterday: Math.round(yesterdayData.cash), week: Math.round(weekDay.cash) },
        { name: 'Безналичный расчёт', current: Math.round(todayData.cardless), yesterday: Math.round(yesterdayData.cardless), week: Math.round(weekDay.cardless) },
        { name: 'Кредитные карты', current: Math.round(todayData.cards), yesterday: Math.round(yesterdayData.cards), week: Math.round(weekDay.cards) },
        { name: 'Средний чек, руб', current: Math.round((todayData.revenue - todayData.deletionsAfter) / todayData.checks), yesterday: Math.round(yesterdayData.averageCheck), week: Math.round(weekDay.averageCheck) },
        { name: 'Средний гость, руб.', current: Math.round(todayData.revenue / todayData.guests), yesterday: Math.round(yesterdayData.averageGuest), week: Math.round(weekDay.averageGuest) },
        { name: 'Удаления из чека (после оплаты), руб.', current: Math.round(todayData.deletionsAfter), yesterday: Math.round(yesterdayData.deletionsAfter), week: Math.round(weekDay.deletionsAfter) },
        { name: 'Удаления из чека (до оплаты), руб.', current: Math.round(todayData.deletionsBefore), yesterday: Math.round(yesterdayData.deletionsBefore), week: Math.round(weekDay.deletionsBefore) },
        { name: 'Количество чеков', current: Math.round(todayData.checks), yesterday: Math.round(yesterdayData.checks), week: Math.round(weekDay.checks) },
        { name: 'Количество гостей', current: Math.round(todayData.guests), yesterday: Math.round(yesterdayData.guests), week: Math.round(weekDay.guests) },
    ];

    indicators.forEach(indicator => {
        const tbody = document.createElement('tbody');
        const row = document.createElement('tr');
        tbody.appendChild(row);
        row.classList.add('table__row');

        // Вычисляем процент изменения от вчерашнего значения к текущему
        const percentageChange = ((indicator.current - indicator.yesterday) / indicator.yesterday * 100).toFixed(2);

        const percentageColor = percentageChange >= 0 ? 'style="color:#76b55f"' : 'style="color:#ff4359"';
        const percentageBG = percentageChange >= 0 ? 'style="background-color:#ecf7e7"' : 'style="background-color:#fee6e6"';

        const currentFormatted = indicator.current.toLocaleString('ru-RU');
        const yesterdayFormatted = indicator.yesterday.toLocaleString('ru-RU');
        const weekDayFormatted = indicator.week.toLocaleString('ru-RU');

        // Добавляем значение за вчера и процент с окраской
        const yesterdayDisplay = `${yesterdayFormatted}<span ${percentageColor};">${percentageChange}%</span>`;

        row.innerHTML = `<td class="table__cell">${indicator.name}</td>
        <td class="table__cell">${currentFormatted}</td>
        <td class="table__cell" ${percentageBG}>${yesterdayDisplay}</td>
        <td class="table__cell">${weekDayFormatted}</td>
    `;
        tableContainer.appendChild(row);
    });
}


document.getElementById('table-container').addEventListener('click', function (e) {
    let dataValue;
    const dataRow = [];
    // Проверяем, кликнули ли мы по строке
    const targetRow = e.target.closest('.table__row');

    let figure = document.querySelector('.highcharts-figure');

    if (figure) {
        figure.remove();
    }

    figure = document.createElement('tr');
    figure.classList.add('highcharts-figure');
    figure.innerHTML = `
        <td colspan="100%">
            <div id="container"></div>
        </td>
    `
    function appendAfter(referenceNode, newNode) {
        referenceNode.insertAdjacentElement('afterend', newNode);
    }

    appendAfter(targetRow, figure);

    console.log(targetRow);
    if (targetRow) {
        const childDivs = targetRow.getElementsByClassName('table__cell');
        for (let i = 1; i < childDivs.length; i++) {
            let dataValue = childDivs[i].innerHTML;
            dataValue = dataValue.replace(/<span[^>]*>.*?<\/span>/g, '').trim();
            dataValue = dataValue.replace(/&nbsp;/g, ''); 
            dataValue = dataValue.replace(/\s+/g, '');
            let numericValue = Math.floor(parseFloat(dataValue));
            if (!isNaN(numericValue)) {
                dataRow.push(numericValue);
            }
        }
        
        dataArrFun(dataRow, childDivs[0].textContent);
    }
});

document.addEventListener('click', function (e) {
    const figure = document.querySelector('.highcharts-figure');
    const tableContainer = document.getElementById('table-container');

    if (!tableContainer.contains(e.target) && figure) {
        figure.remove();
    }
});

function dataArrFun(dataRow, yAxis) {

    const categories = ['Текущий день', 'Вчера', 'Этот день недели'];

    if (dataRow.length !== categories.length) {
        console.error('Количество значений в dataRow не совпадает с количеством категорий!');
        return;
    }

    Highcharts.chart('container', {
        title: {
            text: 'Структура и динамика продаж',
            align: 'left'
        },

        yAxis: {
            title: {
                text: yAxis
            }
        },

        xAxis: {
            type: 'category',
            categories: categories // Используем заранее определенные категории
        },

        legend: {
            enabled: false // Убираем легенду
        },

        accessibility: {
            enabled: false
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 0 // Начинаем с 0, так как у нас категории
            }
        },

        series: [{
            data: dataRow.map(value => [value]), // Подготавливаем данные в формате, ожидаемом Highcharts
            name: '' // Устанавливаем пустое название для серии
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}

// Отображаем данные
displayData();
