// init const values
const valcode = document.getElementById("valcode");
const form = document.getElementById('currencyForm');
const currencies = new Map([
    ['usd', 'USD — Долар США'],
    ['eur', 'EUR — Євро'],
    ['gbp', 'GBP — Фунт стерлінгів'],
    ['pln', 'PLN — Польський злотий']
]);
let myChart = null;

// init dropdown input 
(function() {
    for (const [name, description] of currencies) {
        let option = document.createElement('option');
        option.setAttribute('value', name);
        option.textContent = description;
        valcode.appendChild(option);
    }
})();

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const valcode = document.getElementById('valcode').value;
    const startDate = document.getElementById('startDate').value.replaceAll('-', '');
    const endDate = document.getElementById('endDate').value.replaceAll('-', '');
    
    const url = `https://bank.gov.ua/NBU_Exchange/exchange_site?start=${startDate}&end=${endDate}&valcode=${valcode}&sort=exchangedate&json`;
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState !== 4) {
            return;
        }

        const [dates, rates] = parseStringRates(xhr.responseText);

        if (myChart) {
            myChart.data.labels = dates; // Update X-axis labels
            myChart.data.datasets[0].data = rates; // Update Y-axis dataset values
            myChart.update(); // Re-render the chart with a smooth transition
        }
        else {
            document.getElementById('temp-div').remove();
            const canvas = document.createElement('canvas');
            canvas.id = 'myLineChart';
            const ctx = canvas.getContext('2d');

            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates, // Передаем массив дат
                    datasets: [{
                    label: `Курс ${currencies.get(valcode)} (НБУ)`,
                    data: rates,  // Передаем массив курсов
                    borderColor: '#4bc0c0',
                    tension: 0.2
                    }]
                }
            });
            
            const chartArea = document.getElementById('chartArea');
            chartArea.appendChild(canvas);
        }
    });

    xhr.send();
});

/**
 * Extracts dates and exchange rates from NBU data array.
 * 
 * @param {object[]} arrayOfRates - Array of exchange rate objects
 * @returns {[string[], number[]]} Tuple of two arrays: [dates, rates]
 */
function parseStringRates(exchangeRates) {
    /** @type {Array} */
    const arrayOfRates = JSON.parse(exchangeRates);
    const dates = arrayOfRates.map(rateData => rateData.exchangedate);
    const rates = arrayOfRates.map(rateData => rateData.rate);
    return [dates, rates];
}