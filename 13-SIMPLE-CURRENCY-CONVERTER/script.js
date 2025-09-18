const convertBtn = document.getElementById('convertBtn');
const converterForm= document.getElementById('converterForm');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const resultDiv = document.getElementById('resultContainer');


async function fetchCurrencies() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const currencyOptions = Object.keys(data.rates)
    currencyOptions.forEach((currency) => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');

        option1.value = currency;
        option2.value = currency;
        option1.textContent = currency;
        option2.textContent = currency;

        toCurrency.appendChild(option1);
        fromCurrency.appendChild(option2);
    })
}
async function convertCurrency(e) {
    e.preventDefault();
    const amount = +amountInput.value;
    //This will check for empty submit request.
    if(amount === '' || amount <= 0){
        alert('Please enter a valid amount');
        return;
    }

    const fromCurrencyValue = fromCurrency.value;
    const toCurrencyValue = toCurrency.value;
    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrencyValue}`;
    const response = await fetch(url);
    const data = await response.json();

    const rate = (amount * data.rates[toCurrencyValue]).toFixed(2);
    console.log(rate);
    resultDiv.textContent = `${amount} ${fromCurrencyValue} = ${rate} ${toCurrencyValue}`;

    const switcher = document.createElement("i");
    switcher.classList.add("fas", "fa-refresh");
    resultDiv.appendChild(switcher);
    switcher.addEventListener("click", ()=>{
        const switchCurrency = (amount/data.rates[toCurrencyValue]).toFixed(2);
        resultDiv.textContent = `${amount} ${toCurrencyValue} = ${switchCurrency} ${fromCurrencyValue}`;
    });
}


//THIS WILL FETCH ALL THE CURRENCIES WHEN RELOADED OR LOADED
window.addEventListener("load", fetchCurrencies)
//THIS WILL REFETCH ALL THE LATEST CONVERSION DATA
converterForm.addEventListener('submit', convertCurrency)