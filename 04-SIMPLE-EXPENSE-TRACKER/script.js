const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('incomeAmount');
const expenseAmountEl = document.getElementById('expenseAmount');
const transactionListEl= document.getElementById('transactionList');
const transactionFormEl = document.getElementById('transactionForm');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');


// THIS WILL GET ITEMS FROM LOCAL STORAGE IF THERE ARE ANY.
// WE WILL WRAP IT IN JSON.PARSE (TO HAVA A STRUCTURED DATA INSTEAD OF A STRING)
let transactions =  JSON.parse(localStorage.getItem('transactions')) || [];

transactionFormEl.addEventListener("submit", addTransaction)

function addTransaction(e) {
    e.preventDefault(); //THIS WILL PREVENT PAGE FROM REFRESHING.

    //GET THE FORM VALUES.
    const description = descriptionEl.value.trim(); // TRIM OFF ANY SPACES
    const amount = +amountEl.value.trim();  //CONVERT TO NUMS AND TRIM SPACES

    //PUSH THESE VALUES INTO TRANSACTION ARRAY.
    transactions.push({
        id:Date.now(),
        description,
        amount
    })

    //NOW STORE THE TRANSACTION ARRAY IN THE LOCAL STORAGE
    localStorage.setItem('transactions', JSON.stringify(transactions));

    //UPDATE THE TRANSACTION LIST & THE SUMMARY TABS.
    updateTransactionList()
    updateSummary()

    transactionFormEl.reset();
}

function updateTransactionList() {
    //FIRST THING IS YOU CLEAR THE PREVIOUS LIST
    transactionListEl.innerHTML = ""
    const sortedTransaction = [...transactions].reverse() //get everything from the array transactions and reverse it

    //THIS WILL CREATE A TRANSACTION CARD FOR EACH OBJECT STORED IN TRANSACTION_ARRAY
    sortedTransaction.forEach((transaction) => {
        const transactionEl= createTransactionElement(transaction)
        //ONCE CREATED ITS QUICKLY APPEaNED TO THE DOM TREE.
        transactionListEl.appendChild(transactionEl)
    })
}

function createTransactionElement(transaction){
    // THIS CREATES A LIST ELEMENT
    const li = document.createElement('li');
    //THIS ADDS THE CLASS ELEMENTS TO BE UES BY THE STYLING SHEET.
    li.classList.add('transaction');
    li.classList.add(transaction.amount >0 ? 'income' : 'expense');
    // THIS WILL ADD ELEMENTS INSIDE THE LIST ELEMENT.
    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${formatCurrency(transaction.amount)} 
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>    
    `
    return li;
}


function updateSummary() {
    const balance = transactions
        .reduce((acc,transaction)=> acc + transaction.amount, 0);

    const income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expenses);
}


// HERE THE OUTPUT IS FORMATED
// function formatCurrency(number) {
//     return new Intl.NumberFormat("de-DE", {
//         style: "currency",
//         currency: "EUR",
//     }).format(number);
// }

function formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
    }).format(number);
}

function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

// initial render
updateTransactionList();
updateSummary();