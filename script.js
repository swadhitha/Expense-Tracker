const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const textInputEl = document.getElementById('text');
const amountInputEl = document.getElementById('amount');
let transactions = loadTransactions();
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateValues();
}
function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}₹${Math.abs(transaction.amount).toLocaleString('en-IN')}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    listEl.appendChild(item);
}
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);  
    const total = amounts.reduce((acc, item) => (acc += item), 0);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0);
    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1;
    
    balanceEl.innerText = `₹${total.toLocaleString('en-IN')}`;
    moneyPlusEl.innerText = `+₹${income.toLocaleString('en-IN')}`;
    moneyMinusEl.innerText = `-₹${expense.toLocaleString('en-IN')}`;
    
    balanceEl.classList.add('balance-update');
    setTimeout(() => balanceEl.classList.remove('balance-update'), 500);
}
function generateID() {
    return Math.floor(Math.random() * 1000000);
}
function addTransaction(e) {
    e.preventDefault();
    
    if (textInputEl.value.trim() === '' || amountInputEl.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }
    const transaction = {
        id: generateID(),
        text: textInputEl.value,
        amount: +amountInputEl.value
    };
    
    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateValues();
    saveTransactions();
    
    textInputEl.value = '';
    amountInputEl.value = '';
}
function removeTransaction(id) {
    const item = document.querySelector(`[onclick="removeTransaction(${id})"]`).parentElement;
    item.classList.add('deleting');
    
    setTimeout(() => {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactions();
        init();
    }, 300);
}
function loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    return storedTransactions ? JSON.parse(storedTransactions) : [];
}
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

formEl.addEventListener('submit', addTransaction);


init();